import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "./routers/user";
import { ALLOWED_ORIGINS, MONGODB_URI, PORT } from "./utils/env";
import { handleError } from "./utils/error";

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS.split(","),
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);

app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "socialify status",
    data: null,
  });
});

app.get("/error", (req, res) => {
  throw new Error("test error");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    data: null,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError({
    error: err,
    url: req.originalUrl,
    method: req.method,
  });
  res.status(500).json({
    success: false,
    message: "internal server error",
    data: null,
  });
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
