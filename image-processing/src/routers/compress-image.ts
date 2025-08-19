import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { compressImageRequestBody, compressImageResponseData } from "../utils/zod";
import { validateBody } from "../middlewares/request";
import { env } from "../utils/env";
import { sendErrorEmail } from "../lib/email";
import { compressImage } from "../lib/compress-image";
import { parseDataUri } from "../utils/image";
import z from "zod";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateBody(compressImageRequestBody),
  async (req: express.Request, res: express.Response) => {
    try {
      const { imageBase64, quality } = req.body as z.infer<
        typeof compressImageRequestBody
      >;

      // Compress the image using the new format-specific compression
      const result = await compressImage(imageBase64, quality);

      // Extract format from the result dataUri
      const { format } = parseDataUri(result.dataUri);

      const responseData = compressImageResponseData.parse({
        imageBase64: result.dataUri,
        compressedSize: result.compressedSize,
        originalSize: result.originalSize,
        format: format,
      });

      res.json({
        success: true,
        message: "Image compressed successfully",
        data: responseData,
      });
    } catch (error) {
      if (env.APP_ENV === "production") {
        await sendErrorEmail({ error });
      } else {
        console.error("Image compression error:", error);
      }

      res.status(500).json({
        success: false,
        message: "Failed to compress image",
        data: null,
      });
    }
  }
);

export default router;
