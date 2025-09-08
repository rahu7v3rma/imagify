import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '@/lib/trpc/init';
import { sendErrorEmail } from '@/lib/email';

export const blogRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const blogs = await prisma.blog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return blogs;
    } catch (error: any) {
      if (process.env.APP_ENV === 'production') {
        sendErrorEmail({ error });
      } else {
        console.log('Error in blog getAll:', error);
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get blogs.',
      });
    }
  }),
});
