import { NextFunction, Request, Response } from "express";

import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  static getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = request.headers["authorization"];

      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return response.status(401).send();
      }

      let payload;
      try {
        payload = this.decodeJWT<{ username?: string }>(token);
      } catch (e) {
        // invalid token
        return response.status(401).send();
      }
      const { username } = payload;
      response.status(200).json({ username });
    } catch (e) {
      return next(e);
    }
  };
}
