import { initTRPC } from '@trpc/server';
import {
  accessTokenMiddleware,
  jsonSizeLimitMiddleware,
} from '@/lib/trpc/middleware';
import type { User } from '@prisma/client';
import { NextRequest } from 'next/server';

interface Context {
  user?: User;
  req?: NextRequest;
}

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(accessTokenMiddleware);
export const imageProcedure = t.procedure
  .use(jsonSizeLimitMiddleware)
  .use(accessTokenMiddleware);
