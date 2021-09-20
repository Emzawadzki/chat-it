import { NextFunction, Request, Response } from "express";

import { getRequestUser } from "../utils/http";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userData = getRequestUser(request);
  if (!userData) return response.status(401).send();
  request.user = {
    name: userData.name,
    id: userData.id,
  };
  next();
};
