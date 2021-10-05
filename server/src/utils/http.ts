import { IncomingHttpHeaders } from "http";

import { decodeJWT } from "./jwt";

export const getHttpUser = (headers: IncomingHttpHeaders): UserData | null => {
  const requestCookie = headers.cookie;
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
