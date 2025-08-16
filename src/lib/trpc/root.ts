import { router } from "./init";
import { contactRouter } from "@/app/(public)/contact/router";
import { signupRouter } from "@/app/(public)/signup/router";
import { loginRouter } from "@/app/(public)/login/router";
import { forgotPasswordRouter } from "@/app/(public)/forgot-password/router";
import { changePasswordRouter } from "@/app/(public)/change-password/router";
import { userRouter } from "@/context/user/router";
import { settingsRouter } from "@/app/dashboard/settings/router";
import { billingRouter } from "@/app/dashboard/billing/router";
import { generateImageRouter } from "@/app/dashboard/generate-image/router";
import { removeBackgroundRouter } from "@/app/dashboard/remove-background/router";

export const appRouter = router({
  contact: contactRouter,
  signup: signupRouter,
  login: loginRouter,
  forgotPassword: forgotPasswordRouter,
  changePassword: changePasswordRouter,
  user: userRouter,
  settings: settingsRouter,
  billing: billingRouter,
  generateImage: generateImageRouter,
  removeBackground: removeBackgroundRouter,
});

export type AppRouter = typeof appRouter;
