import express from "express";
import cors from "cors";
import morgan from "morgan";
import { APP_MESSAGES, ROUTERS } from "./constants/app";
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
  rateLimitMiddleware,
} from "./middlewares/app";
import userRouter from "./routers/user";
import { MORGAN_FORMAT } from "./configs/app";
import { logInfo } from "./utils/logger";
import { env } from "./configs/env";
import mongoose from "mongoose";

const app = express();

app.use(morgan(MORGAN_FORMAT));
app.use(cors());
app.use(rateLimitMiddleware);
app.use(express.json());

app.use(ROUTERS.USER, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoose.connect(env.MONGO_URI).then(() => {
  logInfo({
    message: APP_MESSAGES.CONNECTED_TO_MONGO,
  });
});

app.listen(env.PORT, () => {
  logInfo({
    message: APP_MESSAGES.SERVER_RUNNING,
  });
});
