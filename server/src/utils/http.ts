import { Request } from "express";

import { decodeJWT } from "./jwt";

export const getRequestUser = (request: Request): UserData | null => {
  const requestCookie = request.headers.cookie;
  if (!requestCookie) return null;

  const token = /access_token=([\w\.-]+)/.exec(requestCookie);

  if (!token || !token[1]) return null;

  let payload;
  try {
    payload = decodeJWT<{ username?: string; id?: number }>(token[1]);
  } catch (e) {
    // invalid token
    return null;
  }

  const { username, id } = payload;

  if (!username || !id) return null;
  return { name: username, id };
};
