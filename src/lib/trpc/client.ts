import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./root";

export const TRPC_ENDPOINT = "/api/trpc";

export const trpc = createTRPCReact<AppRouter>();
