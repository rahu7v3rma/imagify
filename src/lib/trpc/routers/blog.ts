import { prisma } from '@/lib/prisma';
import { publicProcedure, router } from '@/lib/trpc/init';
import { handleTrpcError } from '@/utils/errors';
import { z } from 'zod';

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
      handleTrpcError(error, 'blog getAll');
    }
  }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const blog = await prisma.blog.findFirst({
          where: {
            slug: input.slug,
          },
        });

        if (!blog) {
          throw new Error('Blog not found');
        }

        return blog;
      } catch (error: any) {
        handleTrpcError(error, 'blog getBySlug');
      }
    }),
});
