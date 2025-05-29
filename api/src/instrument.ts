import * as Sentry from "@sentry/node";
import { SENTRY_DSN } from "./lib/env";

Sentry.init({
  dsn: SENTRY_DSN,
  sendDefaultPii: true,
});
