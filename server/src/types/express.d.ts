declare module Express {
  interface Request {
    user?: UserData;
  }
}
