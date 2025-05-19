// import dotenv from "dotenv";
// import { z } from "zod";

// dotenv.config();

// type Env = {
//   MONGODB_URI: string;
//   PORT: number;
//   CORS_ALLOWED_ORIGINS: string[];
// };

// const envSchema = z.object({
//   MONGODB_URI: z.string().min(1),
//   PORT: z.string().refine((val) => !isNaN(Number(val)), {
//     message: "PORT must be a number",
//   }),
//   CORS_ALLOWED_ORIGINS: z.string().min(1),
// });

// const rawEnv = {
//   MONGODB_URI: process.env.MONGODB_URI,
//   PORT: process.env.PORT,
//   CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
// };

// const env: Env = {
//   MONGODB_URI: String(process.env.MONGODB_URI),
//   PORT: Number(process.env.PORT),
//   CORS_ALLOWED_ORIGINS: String(process.env.CORS_ALLOWED_ORIGINS).split(","),
// };

// export const verifyEnv = () => {
//   const result = envSchema.safeParse(rawEnv);
//   if (!result.success) {
//     throw {
//       message: "Environment validation failed",
//       error: result.error.flatten().fieldErrors,
//     };
//   }
// };

// export default env;
