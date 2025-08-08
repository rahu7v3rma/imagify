import { router } from "./init";
import { contactRouter } from "../../app/(public)/contact/router";
import { signupRouter } from "../../app/(public)/signup/router";
import { loginRouter } from "../../app/(public)/login/router";

export const appRouter = router({
  contact: contactRouter,
  signup: signupRouter,
  login: loginRouter,
});
