import { RequestHandler } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { ResponseBody } from "../types/http";
import { getHttpUser } from "../utils/http";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  static getUser: RequestHandler<{}, ResponseBody.User> = async (
    request,
    response,
    next
  ) => {
    try {
      const requestUser = getHttpUser(request.headers);
      if (!requestUser) {
        return response.status(200).json({ user: null });
      }

      const userRepository = getRepository(User);
      const userFound = await userRepository.findOne({
        where: { id: requestUser.id },
      });
      if (!userFound) {
        return response.status(200).json({ user: null });
      }

      const { username, id } = userFound;
      response.status(200).json({ user: { name: username, id } });
    } catch (e) {
      return next(e);
    }
  };
}
