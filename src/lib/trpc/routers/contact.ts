import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '@/lib/trpc/init';
import { uploadContactFile } from '@/lib/upload';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { sendErrorEmail } from '@/lib/email';

export const contactRouter = router({
  sendMessage: publicProcedure
    .input(
      zfd.formData({
        email: zfd.text(z.email()),
        message: zfd.text(z.string().min(10).max(1000)),
        image: zfd
          .file(
            z
              .instanceof(File)
              .refine((file) => !file || file.size <= 10 * 1024 * 1024)
              .refine((file) => !file || file.type.startsWith('image/')),
          )
          .optional(),
      }),
    )
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const { email, message, image } = input;

        let uploadsPath: string | null = null;
        if (image) {
          uploadsPath = await uploadContactFile({
            file: image,
          });
        }

        await prisma.contact.create({
          data: {
            email,
            message,
            uploadsPath,
          },
        });

        return true;
      } catch (error: any) {
        if (process.env.APP_ENV === 'production') {
          sendErrorEmail({ error });
        } else {
          console.log('Error in contact:', error);
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
