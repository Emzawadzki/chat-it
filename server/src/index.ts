import "reflect-metadata";
import dotenv from "dotenv";

import { createConnection } from "typeorm";

import { User } from "./entity/User";

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
  .then((connection) => {
    // ...
  })
  .catch((error) => console.log(error));
