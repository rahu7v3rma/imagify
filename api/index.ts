import { verifyEnv } from "@/utils/env";
import { initExpress } from "@/lib/express";
import { initMongoose } from "@/lib/mongoose";
import { logError, logInfo } from "@/utils/logger";

const initApp = async () => {
  try {
    verifyEnv();
    await initMongoose();
    await initExpress();
    logInfo("App started successfully");
  } catch (error) {
    logError("Failed to start app:", error);
    process.exit(1);
  }
};

initApp();
