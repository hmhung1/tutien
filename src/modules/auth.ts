import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
const { genSalt, hash } = bcrypt;
const SECRET_KEY = process.env.SECRET_KEY!;
export const createToken = (user: { uid: string; uname: string }) => jwt.sign({ uid: user.uid, uname: user.uname }, SECRET_KEY, { expiresIn: '8h' });
export const verifyToken = (token: string) => { try { return jwt.verify(token, SECRET_KEY); } catch (err) { return null; } };
export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};
export const authMiddleware = (utoken: Map<string, string>) => (rq: Request, rs: Response, next: NextFunction) => {
  const token = rq.header('Authorization')?.replace('Bearer ', '')!;
  const decoded = verifyToken(token);
  if (typeof decoded == "string" || !decoded) return rs.send({ error: 'Unauthorized' });
  if (!utoken.has(decoded.uid + decoded.uname)) return rs.send({ error: 'Unauthorized' });
  //@ts-ignore
  rq.user = decoded;
  next();
};