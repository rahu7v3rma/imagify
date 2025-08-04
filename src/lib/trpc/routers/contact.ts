import { prisma } from "@/lib/prisma";
import { ContactSchema } from "@/schemas/public/contact";
import { publicProcedure, router } from "../init";
import { ERROR_CODES } from "@/constants/api";
import { TRPCError } from "@trpc/server";

export const contactRouter = router({
  post: publicProcedure.input(ContactSchema).mutation(async ({ input }) => {
    try {
      const contact = await prisma.contact.create({
        data: {
          email: input.email,
          message: input.message,
        },
      });
      return contact;
    } catch (error) {
      throw new TRPCError({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }),
});
