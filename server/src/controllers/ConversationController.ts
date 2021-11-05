import { RequestHandler } from "express";
import { getRepository } from "typeorm";

import { Conversation } from "../entity/Conversation";
import { Message } from "../entity/Message";
import { User } from "../entity/User";
import { getHttpUser } from "../utils/http";
import { BaseController } from "./BaseController";

export class ConversationController extends BaseController {
  static getAll: RequestHandler = async (request, response, next) => {
    try {
      const requestUser = getHttpUser(request.headers)!; // controller behind auth middleware
      const userRepository = getRepository(User);
      const userFound = await userRepository.findOne({
        join: {
          alias: "user",
          innerJoinAndSelect: {
            conversations: "user.conversations",
          },
        },
        where: { id: requestUser!.id },
      });

      if (!userFound) {
        response.sendStatus(401);
        return;
      }

      const userConversationsIds = userFound.conversations.map(
        (conv) => conv.id
      );

      const conversationsUsers = await userRepository
        .createQueryBuilder("user")
        .innerJoin("user.conversations", "conversation")
        .where("conversation.id IN (:...convIds)", {
          convIds: userConversationsIds,
        })
        .andWhere("user.id != :authorId", { authorId: userFound.id })
        .select("user.username")
        .addSelect("conversation.id")
        .getMany();

      return response.status(200).json({
        conversations: conversationsUsers.map((user) => ({
          username: user.username,
          conversationId: user.conversations[0].id,
        })),
      });
    } catch (e) {
      next(e);
    }
  };

  static getById: RequestHandler = async (request, response, next) => {
    try {
      const conversationId = parseInt(request.params.id);
      if (typeof conversationId !== "number" || Number.isNaN(conversationId)) {
        response.sendStatus(404);
        return;
      }
      const requestUser = getHttpUser(request.headers)!; // controller behind auth middleware
      const userRepository = getRepository(User);
      const userFound = await userRepository.findOne({
        join: {
          alias: "user",
          innerJoinAndSelect: {
            conversations: "user.conversations",
          },
        },
        where: { id: requestUser!.id },
      });

      if (!userFound) {
        response.sendStatus(401);
        return;
      }

      const userConversationsIds = userFound.conversations.map(
        (conv) => conv.id
      );

      if (!userConversationsIds.includes(conversationId)) {
        response.sendStatus(403);
        return;
      }

      const messages = await getRepository(Message)
        .createQueryBuilder("m")
        .innerJoin("m.author", "user")
        .where("m.conversation.id = :conversationId", { conversationId })
        .select("m.id", "id")
        .addSelect("m.text", "text")
        .addSelect("m.createdAt", "createdAt")
        .orderBy("m.createdAt", "ASC")
        .addSelect("user.id", "authorId")
        .getRawMany();

      const conversationWithAttendees = await getRepository(Conversation)
        .createQueryBuilder("c")
        .leftJoinAndSelect("c.attendees", "user")
        .where("c.id = :conversationId", { conversationId })
        .getOne();

      if (!conversationWithAttendees) {
        return response.sendStatus(404);
      }

      const attendees = conversationWithAttendees.attendees.map(
        ({ id, username }) => ({ id, username })
      );

      return response.status(200).json({
        messages,
        attendees,
      });
    } catch (e) {
      next(e);
    }
  };
}
