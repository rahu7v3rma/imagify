import { router } from "./init";
import { contactRouter } from "@/app/(public)/contact/router";
import { signupRouter } from "@/app/(public)/signup/router";
import { loginRouter } from "@/app/(public)/login/router";
import { forgotPasswordRouter } from "@/app/(public)/forgot-password/router";
import { changePasswordRouter } from "@/app/(public)/change-password/router";
import { userRouter } from "@/context/user/router";

export const appRouter = router({
  contact: contactRouter,
  signup: signupRouter,
  login: loginRouter,
  forgotPassword: forgotPasswordRouter,
  changePassword: changePasswordRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
