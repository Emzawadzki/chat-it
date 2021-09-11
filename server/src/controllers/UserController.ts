import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  static getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userRepository = getRepository(User);
      if (!request.username) {
        return response.status(401).send();
      }
      const userFound = await userRepository.findOne({
        where: { username: request.username },
      });
      if (!userFound) {
        return response.status(401).send();
      }
      const { username, id } = userFound;
      response.status(200).json({ username, id });
    } catch (e) {
      return next(e);
    }
  };
}
