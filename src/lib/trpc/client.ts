import { createTRPCReact } from "@trpc/react-query";
import { appRouter } from "@/lib/trpc/root";

export const TRPC_ENDPOINT = "/api/trpc";

export const trpc = createTRPCReact<typeof appRouter>();
