import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
});

const rawEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
};

const env = envSchema.parse(rawEnv);

export const verifyEnv = () => {
  console.log('rawEnv', rawEnv);
  const result = envSchema.safeParse(rawEnv);
  return result.success;
};

export default env;
