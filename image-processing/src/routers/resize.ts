import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { resizeImageRequestBody, resizeImageResponseData } from "../utils/zod";
import { validateBody } from "../middlewares/request";
import { env } from "../utils/env";
import { sendErrorEmail } from "../lib/email";
import { resizeImage } from "../lib/resize";
import z from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateBody(resizeImageRequestBody),
  async (req: express.Request, res: express.Response) => {
    try {
      const { imageBase64, width, height } = req.body as z.infer<
        typeof resizeImageRequestBody
      >;

      // Resize the image using ImageMagick
      const result = await resizeImage(imageBase64, width, height);

      const responseData = resizeImageResponseData.parse({
        imageBase64: result.imageBase64,
      });

      res.json({
        success: true,
        message: "Image resized successfully",
        data: responseData,
      });
    } catch (error) {
      if (env.APP_ENV === "production") {
        await sendErrorEmail({ error });
      } else {
        console.error("Resize error:", error);
      }

      res.status(500).json({
        success: false,
        message: "Failed to resize image",
        data: null,
      });
    }
  }
);

export default router;