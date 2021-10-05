import { IncomingMessage } from "http";
import { getRepository } from "typeorm";
import WebSocket, { RawData } from "ws";

import { User } from "../entity/User";
import { getHttpUser } from "../utils/http";
import { BaseController } from "./BaseController";

export class ChatController extends BaseController {
  static handleConnectionUpgrade = async (
    ws: WebSocket,
    request: IncomingMessage
  ) => {
    const user = getHttpUser(request.headers);
    if (!user) {
      ws.terminate();
      return;
    }
    const userRepository = getRepository(User);
    const userFound = await userRepository.findOne({
      where: { username: user.name },
    });
    if (!userFound) {
      ws.terminate();
      return;
    }
    ws.on("message", (msg) => this.handleMessage(msg, userFound));
  };

  static handleMessage = (message: RawData, author: User) => {
    try {
      console.log(
        "Received message:",
        message.toString(),
        "from user",
        author.username
      );
    } catch (e) {
      console.log(e);
    }
  };
}
