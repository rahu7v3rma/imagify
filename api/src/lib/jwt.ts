import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env";

export const generateJWT = ({ userId }: { userId: string }) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

export const verifyJWT = ({ token }: { token: string }) => {
  return jwt.verify(token, JWT_SECRET);
};
