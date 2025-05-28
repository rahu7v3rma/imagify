import * as Sentry from "@sentry/node";
import { SENTRY_DSN } from "./utils/env";

Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: true,
});
