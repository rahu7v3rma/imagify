import mongoose from "mongoose";
import env from "@/utils/env";
import { logInfo } from "@/utils/logger";

export const initMongoose = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logInfo("MongoDB connected successfully");
};
