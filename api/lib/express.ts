import express from "express";
import cors from "cors";
import morgan from "morgan";
import env from "@/utils/env";
import { logError, logInfo } from "@/utils/logger";

const app = express();
const corsMiddleware = cors({
  origin: env.CORS_ALLOWED_ORIGINS,
});

app.use(morgan("dev"));
app.use(corsMiddleware);
app.use(express.json());

export const initExpress = () => {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(env.PORT, () => {
      logInfo(`Express server listening on port http://localhost:${env.PORT}`);
      resolve();
    });

    server.on("error", (error) => {
      logError("Error starting express server:", error);
      reject(error);
    });
  });
};
