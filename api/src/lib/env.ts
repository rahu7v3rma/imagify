import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;