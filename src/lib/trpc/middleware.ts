import { TRPCError } from "@trpc/server";
import { decodeAccessToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";

export const accessTokenMiddleware = async (opts: any) => {
  try {
    const { ctx, next } = opts;

    const token = ctx.req?.headers?.get("authorization");
    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const decoded: any = decodeAccessToken({ token });
    if (!decoded) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const userId = Number(decoded?.userId);
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
};
