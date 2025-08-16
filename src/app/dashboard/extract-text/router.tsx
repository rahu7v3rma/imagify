import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { sendErrorEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getReplicateOutput } from "@/lib/replicate";
import { protectedProcedure, router } from "@/lib/trpc/init";
import { z } from "zod";

export const extractTextRouter = router({
  extractText: protectedProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1, "Image is required"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            extractedText: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          return { success: false, message: "User not found" };
        }

        const credits = ctx.user.credits || 0;
        if (credits < CREDIT_REQUIREMENTS.EXTRACT_TEXT) {
          return { success: false, message: "You do not have enough credits." };
        }

        const replicateInput = {
          image: input.imageBase64,
        };

        const replicateOutput = await getReplicateOutput(
          "abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61",
          replicateInput
        );

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.EXTRACT_TEXT,
            },
          },
        });

        return {
          success: true,
          message: "Text extracted successfully!",
          data: {
            extractedText: String(replicateOutput),
          },
        };
      } catch (error: any) {
        if (process.env.APP_ENV === "production") {
          sendErrorEmail({ error });
        } else {
          console.log("Error in extract text:", error);
        }
        return { success: false, message: "Failed to extract text." };
      }
    }),
});
