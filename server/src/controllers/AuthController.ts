import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export class AuthController {
  static login = async (request: Request, response: Response) => {
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
      console.log("user not found");
      return response.status(401).send();
    }
    console.log("user found!");
    return response.status(200).send();
  };
}
