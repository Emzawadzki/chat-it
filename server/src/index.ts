import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { createConnection } from "typeorm";
import { Server as WsServer } from "ws";
import http from "http";
import { Socket } from "net";

import { User } from "./entity/User";
import { Conversation } from "./entity/Conversation";
import { Message } from "./entity/Message";

import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { ChatController } from "./controllers/ChatController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { ConversationController } from "./controllers/ConversationController";

// @TODO: handle different environments
dotenv.config({ path: "../development.env" });

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

createConnection({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [User, Conversation, Message],
  synchronize: true,
  logging: false,
})
  .then(() => {
    const app = express();

    app.use(express.json());

    const openRouter = express.Router();
    openRouter.post("/login", AuthController.login);
    openRouter.post("/register", AuthController.register);
    openRouter.post("/logout", AuthController.logout);
    openRouter.get("/user", UserController.getUser);

    const protectedRouter = express.Router();
    protectedRouter.use(authMiddleware);
    protectedRouter.get("/users", UserController.getAll);
    protectedRouter.get("/conversations", ConversationController.getAll);
    protectedRouter.get(
      "/conversations/:id/messages",
      ConversationController.getMessages
    );

    app.use("/api", openRouter);
    app.use("/api", protectedRouter);

    const server = http.createServer(app);
    const wsServer = new WsServer({ path: "/ws/chat", noServer: true });

    server.listen(5000, () => {
      console.log("Server listening on port 5000...");
    });

    server.on("upgrade", (request, socket, head) => {
      wsServer.handleUpgrade(request, socket as Socket, head, (ws) => {
        ChatController.handleConnectionUpgrade(ws, request);
      });
    });
  })
  .catch((error) => console.log(error));
