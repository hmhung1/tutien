import express from "express";
import { Db } from "mongodb";
import { login, logout, register } from "../modules/accounts.js";
import { test } from "../modules/players.js";
import { authMiddleware } from "../modules/auth.js";

export default async function api(db: Db) {
  const app = express();
  const port = 3000 || process.env.PORT;

  app.use(express.json());
  const accounts = db.collection("accounts");
  const players = db.collection("players")

  app.get('/', (rq, rs) => {
    rs.send("hello world")
  });
  let utoken: Map<string, string> = new Map();
  app.get('/login', login(accounts, utoken));
  //@ts-ignore
  app.get('/logout', authMiddleware(utoken), logout(utoken));
  app.get('/register', register(accounts, players));
  app.get('/test', authMiddleware(utoken), test());

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
}