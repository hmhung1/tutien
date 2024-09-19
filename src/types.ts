import { ObjectId } from "mongodb";

export interface Rvip extends Request {
  user: {
    [key: string]: any,
    uid: string,
    uname: string,
  }
};

//type for db:
type User = {
  _id: ObjectId,
  uid: string,
  uname: string,
  password: string,
};

export type Players = {
  _id?: ObjectId,
  aid: User["_id"],
  inventory?: Inventory,
};

type Inventory = Record<Item["type"], Item> | {};

type Item = {
  type: "consumable",
  quantity: number,
  name: string,
  unique: boolean,
  iid: ObjectId,
} | {
  type: "Equipment",
  quantity: number,
  name: string,
  properties: EquipmentProperties
  unique: boolean,
  iid: ObjectId,
};

type AttributeName =
  | "ATK"
  | "DEF"
  | "HP"
  | "MP"
  | "SP"  // speed
  | "STR" // strength
  | "EXP"
  | "CRP" // crit rate %
  | "CRD" // crit damage %
  | "RCD" // reduce cooldown %
  | "EVA" // evasion %
  | "AC"; // accuracy %

type Attribute = {
  type: AttributeName,
  value: number
};

type EquipmentProperties = {
  main: Attribute,
  sub: Attribute[],
  lv: number
};
