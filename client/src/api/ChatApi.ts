import { BaseApi } from "./BaseApi";

export class ChatApi extends BaseApi {
  static createWebSocket = () => {
    // TODO: read address from env
    return new WebSocket("ws://localhost:5000/ws/chat");
  };
}
