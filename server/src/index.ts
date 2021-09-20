import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { createConnection } from "typeorm";

import { User } from "./entity/User";

import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";

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
  entities: [User],
  synchronize: true,
  logging: false,
})
  .then(() => {
    const server = express();

    server.use(express.json());

    const openRouter = express.Router();
    openRouter.post("/login", AuthController.login);
    openRouter.post("/register", AuthController.register);
    openRouter.get("/logout", AuthController.logout);
    openRouter.get("/user", UserController.getUser);

    const protectedRouter = express.Router();
    protectedRouter.use(authMiddleware);

    server.use("/", openRouter);
    server.use("/", protectedRouter);

    server.listen(5000, () => {
      console.log("Server listening on port 5000...");
    });
  })
  .catch((error) => console.log(error));
