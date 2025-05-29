import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validateRequestBody = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const { error, success } = schema.safeParse(req.body || {});
    if (!success) {
      res.status(400).json({
        success: false,
        message: "invalid request body",
        data: error.flatten().fieldErrors
      });
      return;
    }
    next();
  };
};