import { NextFunction, Response } from "express";
import { verifyJWT } from "../lib/jwt";
import UserModel from "../models/user";
import { UserRequest } from "../utils/types";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers?.authorization) {
      res.status(401).json({
        success: false,
        message: "unauthorized",
        data: null,
      });
      return;
    }

    const decodedToken = verifyJWT({
      token: req.headers.authorization,
    }) as { userId: string };
    if (!decodedToken) {
      res.status(401).json({
        success: false,
        message: "unauthorized",
        data: null,
      });
      return;
    }

    if (!decodedToken?.userId) {
      res.status(401).json({
        success: false,
        message: "unauthorized",
        data: null,
      });
    }

    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "unauthorized",
        data: null,
      });
      return;
    }

    if (!user.registerEmailConfirmed) {
      res.status(401).json({
        success: false,
        message: "unauthorized",
        data: null,
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "unauthorized",
      data: null,
    });
  }
};
