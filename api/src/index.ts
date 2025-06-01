import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import userRouter from "./routers/user";
import { ALLOWED_ORIGINS, MONGODB_URI, PORT } from "./utils/env";
import { handleError } from "./utils/error";
import rateLimit from "express-rate-limit";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(
    rateLimit({
      windowMs: 1000,
      max: 1,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "too many requests",
          data: null,
        });
      },
    })
  );
}
app.use(
  cors({
    origin: ALLOWED_ORIGINS.split(","),
  })
);

app.use(morgan("dev"));
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use("/user", userRouter);

app.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "socialify status",
    data: null,
  });
});
app.post("/status", (req, res) => {
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError({
    error: err,
    url: req.originalUrl,
    method: req.method,
  });

  if (err?.type === "entity.too.large") {
    res.status(413).json({
      success: false,
      message: "request body too large",
      data: null,
    });
  }

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
