import { User } from "../models/user";
import { Request } from "express";

export interface UserRequest extends Request {
  user: User;
}
