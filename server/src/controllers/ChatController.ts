import { IncomingMessage } from "http";
import { getRepository, In } from "typeorm";
import WebSocket, { RawData } from "ws";

import { Conversation } from "../entity/Conversation";
import { Message } from "../entity/Message";
import { User } from "../entity/User";
import { getHttpUser } from "../utils/http";
import { BaseController } from "./BaseController";

export class ChatController extends BaseController {
  private static activeConnections: { [key: number]: WebSocket } = {};

  static handleConnectionUpgrade = async (
    ws: WebSocket,
    request: IncomingMessage
  ) => {
    const user = getHttpUser(request.headers);
    if (!user) {
      ws.terminate();
      return;
    }
    const userRepository = getRepository(User);
    const userFound = await userRepository.findOne({
      where: { username: user.name },
      relations: ["conversations"],
    });
    if (!userFound) {
      ws.terminate();
      return;
    }

    this.activeConnections[userFound.id] = ws;
    ws.on("message", (msg) => this.handleMessage(msg, userFound));
  };

  private static validateMessage = (
    message: unknown
  ): message is NewMessage => {
    try {
      return (
        typeof message === "object" &&
        message !== null &&
        message.hasOwnProperty("text") &&
        message.hasOwnProperty("conversationId") &&
        message.hasOwnProperty("type") &&
        (message as { type: string })["type"] === "NEW_MESSAGE"
      );
    } catch (e) {
      return false;
    }
  };

  private static handleMessage = async (message: RawData, author: User) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      if (!this.validateMessage(parsedMessage)) {
        throw new Error("Message type invalid");
      }

      if (
        !author.conversations.find(
          (conversation) => conversation.id === parsedMessage.conversationId
        )
      ) {
        throw new Error("Author has no conversation with provided id");
      }

      const conversationAttendees = await getRepository(Conversation)
        .createQueryBuilder("c")
        .leftJoinAndSelect("c.attendees", "user")
        .where("c.id = :conversationId", {
          conversationId: parsedMessage.conversationId,
        })
        .getOne();

      if (!conversationAttendees) {
        throw new Error("Conversation not found");
      }

      await getRepository(Message).save({
        author,
        conversation: conversationAttendees,
        text: parsedMessage.text,
      });

      const createdMessage = await getRepository(Message)
        .createQueryBuilder("m")
        .leftJoin("m.conversation", "c")
        .where("c.id = :conversationId", {
          conversationId: parsedMessage.conversationId,
        })
        .select("m")
        .addSelect("c.id")
        .orderBy("m.id", "DESC")
        .limit(1)
        .getOne();

      const messageToResend = {
        conversationId: createdMessage?.conversation.id,
        text: createdMessage?.text,
        id: createdMessage?.id,
        authorId: author.id,
      };

      const { attendees } = conversationAttendees;

      const stringifiedMessage = JSON.stringify(messageToResend);

      attendees.forEach(({ id }) => {
        if (this.activeConnections[id]) {
          this.activeConnections[id].send(stringifiedMessage);
        }
      });
    } catch (e) {
      console.log(e);
      // send WS error
    }
  };
}
