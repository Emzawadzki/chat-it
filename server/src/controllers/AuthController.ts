import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";

import { User } from "../entity/User";
import { encodeJWT } from "../utils/jwt";
import { TOKEN_COOKIE } from "../config/consts";
import { RequestBody, ResponseBody } from "../types/http";
import { getRequestUser } from "../utils/http";

import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  static login: RequestHandler<
    {},
    ResponseBody.UserToken,
    RequestBody.UserCredentials
  > = async (request, response, next) => {
    try {
      const { username, password: plainPassword } = request.body;
      if (!username || !plainPassword) {
        return response.status(400).send();
      }

      const userRepository = getRepository(User);

      const userFound = await userRepository.findOne({ where: { username } });
      if (!userFound) {
        return response.status(401).send();
      }
      const { id, password } = userFound;
      const isPasswordCorrect = await bcrypt.compare(plainPassword, password);
      if (!isPasswordCorrect) {
        return response.status(401).send();
      }
      const token = encodeJWT({ username, id });
      return response
        .cookie(TOKEN_COOKIE, token, {
          httpOnly: true,
          secure: true,
          // TODO: add secure for production
        })
        .status(200)
        .send();
    } catch (e) {
      next(e);
    }
  };

  static register: RequestHandler<
    {},
    ResponseBody.UserToken,
    RequestBody.UserCredentials
  > = async (request, response, next) => {
    try {
      const { username, password } = request.body;
      if (!username || !password) {
        return response.status(400).send();
      }

      const userRepository = getRepository(User);
      const userFound = await userRepository.findOne({ where: { username } });
      if (userFound) {
        return response.status(409).send();
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await userRepository.save({
        username,
        password: hashedPassword,
      });
      const { id } = createdUser;
      const token = encodeJWT({ username, id });
      return response
        .cookie(TOKEN_COOKIE, token, {
          httpOnly: true,
          secure: true,
          // TODO: add secure for production
        })
        .status(201)
        .send();
    } catch (e) {
      next(e);
    }
  };

  static logout: RequestHandler = (request, response, next) => {
    try {
      const requestUser = getRequestUser(request);
      let responseStatus = requestUser ? 200 : 401;
      return response
        .cookie(TOKEN_COOKIE, "", {
          httpOnly: true,
          secure: true,
          expires: new Date(0),
        })
        .status(responseStatus)
        .send();
    } catch (e) {
      next(e);
    }
  };
}
