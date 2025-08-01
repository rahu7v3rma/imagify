import dotenv from "dotenv";
import { envSchema } from "../utils/zod-schema";

dotenv.config();

export const env = envSchema.parse(process.env);
