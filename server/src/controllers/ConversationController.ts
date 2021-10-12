import { RequestHandler } from "express";
import { getRepository } from "typeorm";

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
        .select("user.id")
        .addSelect("user.username")
        .getMany();

      return response.status(200).json({
        conversations: conversationsUsers,
      });
    } catch (e) {
      next(e);
    }
  };
}
