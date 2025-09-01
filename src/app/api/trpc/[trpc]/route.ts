import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/root';
import { TRPC_ENDPOINT } from '@/lib/trpc/client';
import { NextRequest } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    req,
    router: appRouter,
    createContext: () => ({
      req,
    }),
  });

export { handler as GET, handler as POST };
