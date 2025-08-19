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

export const jsonSizeLimitMiddleware = async (opts: any) => {
  const { ctx, next } = opts;
  
  const MAX_JSON_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  
  const contentLengthHeader = ctx.req?.headers?.get("content-length");
  
  if (!contentLengthHeader) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Content-Length header is required.",
    });
  }
  
  const contentLength = parseInt(contentLengthHeader, 10);
  
  if (contentLength > MAX_JSON_SIZE) {
    throw new TRPCError({
      code: "PAYLOAD_TOO_LARGE",
      message: "Request payload too large. Maximum size is 10MB.",
    });
  }
  
  return next();
};
