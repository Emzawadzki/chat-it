import { NextFunction, Request, Response } from "express";

import { decodeJWT } from "../utils/jwt";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const requestCookie = request.headers.cookie;
  if (!requestCookie) {
    return response.status(401).send();
  }
  const token = /access_token=([\w\.]+)/.exec(requestCookie);

  if (!token || !token[1]) {
    return response.status(401).send();
  }

  let payload;
  try {
    payload = decodeJWT<{ username?: string }>(token[1]);
  } catch (e) {
    // invalid token
    return response.status(401).send();
  }

  request.username = payload.username;
  next();
};
