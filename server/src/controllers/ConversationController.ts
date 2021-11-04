import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Conversation } from "../entity/Conversation";

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

      const conversation = await getRepository(Conversation).findOne({
        join: {
          alias: "c",
          innerJoinAndSelect: {
            messages: "c.messages",
          },
        },
        where: { id: conversationId },
      });

      if (!conversation) {
        return response.sendStatus(404);
      }

      return response.status(200).json({
        messages: conversation.messages,
      });
    } catch (e) {
      next(e);
    }
  };
}
