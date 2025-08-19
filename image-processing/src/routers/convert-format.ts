import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { convertFormatRequestBody, convertFormatResponseData } from "../utils/zod";
import { validateBody } from "../middlewares/request";
import { env } from "../utils/env";
import { sendErrorEmail } from "../lib/email";
import { convertFormat } from "../lib/convert-format";
import z from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateBody(convertFormatRequestBody),
  async (req: express.Request, res: express.Response) => {
    try {
      const { imageBase64, format } = req.body as z.infer<
        typeof convertFormatRequestBody
      >;

      // Convert the image format using ImageMagick
      const result = await convertFormat(imageBase64, format);

      const responseData = convertFormatResponseData.parse({
        imageBase64: result.imageBase64,
      });

      res.json({
        success: true,
        message: "Image format converted successfully",
        data: responseData,
      });
    } catch (error) {
      if (env.APP_ENV === "production") {
        await sendErrorEmail({ error });
      } else {
        console.error("Format conversion error:", error);
      }

      res.status(500).json({
        success: false,
        message: "Failed to convert image format",
        data: null,
      });
    }
  }
);

export default router;