import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { z } from "zod";
import { sendErrorEmail } from "@/lib/email";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { replicate } from "@/lib/replicate";
import axios from "axios";

export const generateImageRouter = router({
  generateImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().max(1000, "Prompt must be at most 1000 characters long"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        data: z
          .object({
            imageBase64: z.string(),
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
        if (credits < CREDIT_REQUIREMENTS.GENERATE_IMAGE) {
          return { success: false, message: "You do not have enough credits." };
        }

        const replicateInput = {
          prompt: input.prompt,
        };

        const replicateOutput = await replicate.run(
          "black-forest-labs/flux-schnell",
          {
            input: replicateInput,
          }
        );

        const replicateOutputUrl = Array.isArray(replicateOutput)
          ? replicateOutput[0].url()
          : // @ts-expect-error replicateOutput is of type object
            replicateOutput.url();

        const replicateImageResponse = await axios.get(replicateOutputUrl, {
          responseType: "arraybuffer",
        });
        const replicateImageBuffer = Buffer.from(replicateImageResponse.data);
        const replicateImageBase64 = replicateImageBuffer.toString("base64");

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            credits: {
              decrement: CREDIT_REQUIREMENTS.GENERATE_IMAGE,
            },
          },
        });

        return {
          success: true,
          message: "Image generated successfully!",
          data: {
            imageBase64: `data:image/png;base64,${replicateImageBase64}`,
          },
        };
      } catch (error: any) {
        sendErrorEmail({ error });
        return { success: false, message: "Failed to generate image." };
      }
    }),
});
