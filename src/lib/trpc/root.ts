import { router } from "@/lib/trpc/init";
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
import { extractTextRouter } from "@/app/dashboard/extract-text/router";
import { upscaleRouter } from "@/app/dashboard/upscale/router";
import { editImageRouter } from "@/app/dashboard/edit-image/router";
import { compressImageRouter } from "@/app/dashboard/compress-image/router";
import { convertFormatRouter } from "@/app/dashboard/convert-format/router";

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
  extractText: extractTextRouter,
  upscale: upscaleRouter,
  editImage: editImageRouter,
  compressImage: compressImageRouter,
  convertFormat: convertFormatRouter,
});

export type AppRouter = typeof appRouter;
