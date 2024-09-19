import { Request, Response } from "express";
import { Collection } from "mongodb";
import bcrypt from "bcryptjs"
import { createToken, hashPassword } from "./auth.js";
import { Rvip } from "../types.js";
import msg from "../string.js";
import { createNewPlayer } from "./players.js";
export function login(accounts: Collection, utoken: Map<string, string>) {
  return async function (rq: Request, rs: Response) {
    if (!rq.query.uname) return rs.send({ error: msg.unf });
    if (!rq.query.password) return rs.send({ error: msg.pnf });
    if ((rq.query.password).toString().length > 16 || (rq.query.uname).toString().length > 60) return rs.send({ error: msg.ivd });
    const user = await accounts.findOne({ uname: rq.query.uname });
    if (!user) return rs.send({ error: msg.ade });
    const isMatch = await bcrypt.compare(rq.query.password.toString(), user.password);
    if (!isMatch) return rs.send({ error: msg.lf });
    const token = createToken({ uid: user.uid, uname: user.uname });
    utoken.set(user.uid.toString() + user.uname.toString(), token);
    return rs.send({ data: token });
  }
}

export function register(accounts: Collection, players: Collection) {
  return async function (rq: Request, rs: Response) {
    if (!rq.query.uname) return rs.send({ error: msg.unf });
    if (!rq.query.uid) return rs.send({ error: msg.uunf });
    if (!rq.query.password) return rs.send({ error: msg.pnf });
    if ((rq.query.password).toString().length > 16 || (rq.query.uname).toString().length > 60) return rs.send({ error: msg.ivd });
    const user = await accounts.findOne({ uname: rq.query.uname });
    if (user) return rs.send({ error: msg.aar });
    const upassword = await hashPassword(rq.query.password.toString())
    const result = await accounts.insertOne({ uid: rq.query.uid.toString(), uname: rq.query.uname.toString(), password: upassword });
    return createNewPlayer(players, { _id: result.insertedId }).then(() => rs.send({ data: msg.rss })).catch(() => rs.send({ error: msg.ue }))
  }
}
export function logout(utoken: Map<string, string>) {
  return async function (rq: Rvip, rs: Response) {
    if (!rq.user) return;
    utoken.delete(rq.user.uid + rq.user.uname)
    return rs.send({ data: msg.los });
  }
}



