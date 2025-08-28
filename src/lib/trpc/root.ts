import { router } from "@/lib/trpc/init";
import { contactRouter } from "@/lib/trpc/routers/contact";
import { signupRouter } from "@/lib/trpc/routers/signup";
import { loginRouter } from "@/lib/trpc/routers/login";
import { forgotPasswordRouter } from "@/lib/trpc/routers/forgot-password";
import { changePasswordRouter } from "@/lib/trpc/routers/change-password";
import { userRouter } from "@/context/user/router";
import { settingsRouter } from "@/lib/trpc/routers/settings";
import { billingRouter } from "@/lib/trpc/routers/billing";
import { generateImageRouter } from "@/lib/trpc/routers/generate-image";
import { removeBackgroundRouter } from "@/lib/trpc/routers/remove-background";
import { extractTextRouter } from "@/lib/trpc/routers/extract-text";
import { upscaleRouter } from "@/lib/trpc/routers/upscale";
import { editImageRouter } from "@/lib/trpc/routers/edit-image";
import { compressImageRouter } from "@/lib/trpc/routers/compress-image";
import { convertFormatRouter } from "@/lib/trpc/routers/convert-format";
import { resizeImageRouter } from "@/lib/trpc/routers/resize-image";
import { cropRotateFlipRouter } from "@/lib/trpc/routers/crop-rotate-flip";

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
  resizeImage: resizeImageRouter,
  cropRotateFlip: cropRotateFlipRouter,
});

export type AppRouter = typeof appRouter;
