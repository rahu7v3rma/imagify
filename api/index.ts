import { verifyEnv } from "@/utils/env";
import { initExpress } from "@/lib/express";
import { initMongoose } from "@/lib/mongoose";
import logger from "@/lib/winston";

const initApp = async () => {
  try {
    verifyEnv();
    await initMongoose();
    await initExpress();
    logger.info("App started successfully");
  } catch (error) {
    logger.error("Failed to start app", { error });
    process.exit(1);
  }
};

initApp();
