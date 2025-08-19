import express from "express";
import { z } from "zod";

export const validateBody = (schema: z.ZodSchema) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid request body" });
    }
  };
};
