import { NextFunction, Request, Response } from "express";

import { decodeJWT } from "../utils/jwt";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return response.status(401).send();
  }

  let payload;
  try {
    payload = decodeJWT<{ username?: string }>(token);
  } catch (e) {
    // invalid token
    return response.status(401).send();
  }

  request.username = payload.username;
  next();
};
