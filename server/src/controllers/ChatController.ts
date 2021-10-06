import { IncomingMessage } from "http";
import { getRepository } from "typeorm";
import WebSocket, { RawData, Server as WsServer } from "ws";

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
        message.hasOwnProperty("content") &&
        message.hasOwnProperty("addresseeId") &&
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
      const userRepository = getRepository(User);
      const addressee = await userRepository.findOne({
        where: { id: parsedMessage.addresseeId },
      });
      if (!addressee) {
        throw new Error("Message addressee not found");
      }

      let conversation =
        author.conversations &&
        author.conversations.find((conversation) =>
          conversation.attendees.includes(addressee)
        );
      if (!conversation) {
        const conversationRepository = getRepository(Conversation);
        conversation = await conversationRepository.save({
          attendees: [author, addressee],
        });
      }
      const messageRepository = getRepository(Message);
      await messageRepository.save({
        author,
        conversation,
        text: parsedMessage.content,
      });
      if (this.activeConnections[addressee.id]) {
        this.activeConnections[addressee.id].send(
          JSON.stringify(parsedMessage)
        );
      }
    } catch (e) {
      // send WS error
    }
  };
}
