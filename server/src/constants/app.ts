import { env } from "../configs/env";

export const RATE_LIMIT_MESSAGE = "Too many requests, please try again later.";

export const RESPONSE_MESSAGES = {
  INVALID_REQUEST_BODY: "Invalid request body",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Not found",
};
export const RESPONSE_DATA_CODES = {
  INVALID_REQUEST_BODY: "INVALID_REQUEST_BODY",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
};
export const RESPONSE_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTERS = {
  USER: "/user",
};

export const ENDPOINTS = {
  SIGNUP: `${ROUTERS.USER}/signup`,
};

export const APP_MESSAGES = {
  CONNECTED_TO_MONGO: "Connected to MongoDB",
  SERVER_RUNNING: `Server is running on port ${env.PORT}`,
};