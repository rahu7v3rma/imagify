import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { PORT, MONGODB_URI } from "./utils/env";
import "./instrument";
import * as Sentry from "@sentry/node";

const app = express();

Sentry.setupExpressErrorHandler(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "socialify status",
    data: null
  });
});

app.get("/error", (req, res) => {
  throw new Error("This is a test error");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    data: null
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  Sentry.captureException(err);
  res.status(500).json({
    success: false,
    message: "internal server error",
    data: null
  });
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
