import { router } from "./init";
import { contactRouter } from "../../app/(public)/contact/router";

export const appRouter = router({
  contact: contactRouter,
});

