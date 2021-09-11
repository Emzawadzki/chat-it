import { JwtPayload, sign, verify } from "jsonwebtoken";

export const encodeJWT = (payload: string | object) => {
  return sign(payload, process.env.JWT_ACCESS_TOKEN!);
};

export const decodeJWT = <T extends { [key: string]: any }>(token: string) => {
  return verify(token, process.env.JWT_ACCESS_TOKEN!) as JwtPayload & T;
};
