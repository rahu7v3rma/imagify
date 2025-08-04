import { router, publicProcedure } from "../init";
import { ContactSchema } from "@/schemas/public/contact";

export const contactRouter = router({
  post: publicProcedure.input(ContactSchema).mutation(({ input }) => {
    return {
      message: `Hello ${input.email}!`,
    };
  }),
});
