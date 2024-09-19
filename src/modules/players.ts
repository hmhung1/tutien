import { Request, Response } from "express";
import { Collection } from "mongodb";
import { Rvip, Players as PlayerProps } from "../types.js";
// import msg from "../string.js";

class Players {
  public aid: PlayerProps["aid"];
  public inventory: PlayerProps["inventory"] = {}
  constructor(aid: PlayerProps["aid"]) {
    this.aid = aid;
  }
};

export function createNewPlayer(players: Collection, user: { _id: PlayerProps["aid"] }) {
  return players.insertOne(new Players(user._id))
};

export function test() {
  return function (rq: Request, rs: Response) {
    console.log("test")
    //@ts-ignore
    console.dir(rq.user)
    rs.send({ data: "done" })
  }
};