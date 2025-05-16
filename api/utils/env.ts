import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

type Env = {
  MONGODB_URI: string;
  PORT: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  CORS_ALLOWED_ORIGINS: string[];
  JWT_SECRET_KEY: string;
  OPENAI_API_KEY: string;
};

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  PORT: z.string().refine((val) => !isNaN(Number(val)), {
    message: "PORT must be a number",
  }),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().refine((val) => !isNaN(Number(val)), {
    message: "SMTP_PORT must be a number",
  }),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  CORS_ALLOWED_ORIGINS: z.string().min(1),
  JWT_SECRET_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

const rawEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

const env: Env = {
  MONGODB_URI: String(process.env.MONGODB_URI),
  PORT: Number(process.env.PORT),
  SMTP_HOST: String(process.env.SMTP_HOST),
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: String(process.env.SMTP_USER),
  SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
  CORS_ALLOWED_ORIGINS: String(process.env.CORS_ALLOWED_ORIGINS).split(","),
  JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
  OPENAI_API_KEY: String(process.env.OPENAI_API_KEY),
};

export const verifyEnv = () => envSchema.parse(rawEnv);

export default env;
