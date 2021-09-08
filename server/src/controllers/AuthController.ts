import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export class AuthController {
  static login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      if (!request.body) {
        return response.status(400).send();
      }
      const { username } = request.body;
      if (!username) {
        return response.status(400).send();
      }

      const userRepository = getRepository(User);

      const userFound = await userRepository.findOne({ where: { username } });
      if (!userFound) {
        return response.status(401).send();
      }
      return response.status(200).send();
    } catch (e) {
      next(e);
    }
  };
}
