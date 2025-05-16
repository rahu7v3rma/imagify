import mongoose from "mongoose";
import env from "@/utils/env";
import logger from "@/lib/winston";

export const initMongoose = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info(`MongoDB connected successfully at ${env.MONGODB_URI}`);
};
