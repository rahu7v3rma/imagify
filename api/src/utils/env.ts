import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_FROM = process.env.SMTP_FROM;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
