import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { encodeJWT } from "../utils/jwt";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  static login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { username } = request.body;
      if (!username) {
        return response.status(400).send();
      }

      const userRepository = getRepository(User);

      const userFound = await userRepository.findOne({ where: { username } });
      if (!userFound) {
        return response.status(401).send();
      }
      const { id } = userFound;
      const token = encodeJWT({ username, id });
      return response.status(200).json({ token }).send();
    } catch (e) {
      next(e);
    }
  };

  static register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { username } = request.body;
      if (!username) {
        return response.status(400).send();
      }

      const userRepository = getRepository(User);
      const userFound = await userRepository.findOne({ where: { username } });
      if (userFound) {
        return response.status(409).send();
      }
      const createdUser = await userRepository.save({ username });
      const { id } = createdUser;
      const token = encodeJWT({ username, id });
      return response.status(201).json({ token }).send();
    } catch (e) {
      next(e);
    }
  };
}
