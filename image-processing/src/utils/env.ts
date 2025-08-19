import dotenv from "dotenv";

dotenv.config({});

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
};

export const env = {
  PORT: getEnvVar("PORT"),
  API_TOKEN: getEnvVar("API_TOKEN"),
  RESEND_API_KEY: getEnvVar("RESEND_API_KEY"),
  FROM_EMAIL: getEnvVar("FROM_EMAIL"),
  ADMIN_EMAIL: getEnvVar("ADMIN_EMAIL"),
  APP_ENV: process.env.APP_ENV || "development",
};
