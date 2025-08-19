import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { extractTextRequestBody, extractTextResponseData } from "../utils/zod";
import { validateBody } from "../middlewares/request";
import { env } from "../utils/env";
import { sendErrorEmail } from "../lib/email";
import { extractText } from "../lib/extract-text";
import z from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateBody(extractTextRequestBody),
  async (req: express.Request, res: express.Response) => {
    try {
      const { imageBase64 } = req.body as z.infer<
        typeof extractTextRequestBody
      >;

      // Extract text from the image using tesseract CLI
      const result = await extractText(imageBase64);

      const responseData = extractTextResponseData.parse({
        extractedText: result.text,
      });

      res.json({
        success: true,
        message: "Text extracted successfully",
        data: responseData,
      });
    } catch (error) {
      if (env.APP_ENV === "production") {
        await sendErrorEmail({ error });
      } else {
        console.error("Text extraction error:", error);
      }

      res.status(500).json({
        success: false,
        message: "Failed to extract text from image",
        data: null,
      });
    }
  }
);

export default router;
