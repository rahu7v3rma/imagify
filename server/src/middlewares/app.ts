import rateLimit from "express-rate-limit";
import {
  RESPONSE_MESSAGES,
  RESPONSE_CODES,
  RESPONSE_DATA_CODES,
  RATE_LIMIT_MESSAGE,
} from "../constants/app";
import { NextFunction } from "express";
import { z } from "zod";
import { Request, Response } from "express";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "../configs/app";

export const rateLimitMiddleware = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  handler: (req, res) => {
    res.status(RESPONSE_CODES.TOO_MANY_REQUESTS).json({
      success: false,
      message: RATE_LIMIT_MESSAGE,
      data: null,
    });
  },
});

export const validateRequestBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      return res.status(RESPONSE_CODES.BAD_REQUEST).json({
        success: false,
        message: RESPONSE_MESSAGES.INVALID_REQUEST_BODY,
        code: RESPONSE_DATA_CODES.INVALID_REQUEST_BODY,
        data: {
          formErrors: error.flatten().formErrors,
          fieldErrors: error.flatten().fieldErrors,
        },
      });
    }
    next();
  };
};

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
    code: RESPONSE_DATA_CODES.INTERNAL_SERVER_ERROR,
    data: null,
  });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(RESPONSE_CODES.NOT_FOUND).json({
    success: false,
    message: RESPONSE_MESSAGES.NOT_FOUND,
    code: RESPONSE_DATA_CODES.NOT_FOUND,
    data: null,
  });
};
