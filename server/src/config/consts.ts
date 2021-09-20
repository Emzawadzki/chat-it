import { CookieOptions } from "express";

export const TOKEN_COOKIE = "access_token";
export const TOKEN_COOKIE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
};
