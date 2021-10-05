import { NextFunction, Request, Response } from "express";

import { getHttpUser } from "../utils/http";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData = getHttpUser(request.headers);
  if (!userData) return response.status(401).send();
  request.user = {
    name: userData.name,
    id: userData.id,
  };
  next();
};
