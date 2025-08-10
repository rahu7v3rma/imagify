"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { useState } from "react";
import { trpc, TRPC_ENDPOINT } from "@/lib/trpc/client";

let authorizationHeader: string | null = null;
export const setAuthorizationHeader = (header: string | null) => {
  authorizationHeader = header;
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: TRPC_ENDPOINT,
          headers() {
            if (authorizationHeader) {
              return {
                authorization: authorizationHeader,
              };
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
