import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  /**
   * This is where you'd normally pull the authenticated user out of the
   * request (cookies/headers) and put it on the context so every
   * procedure can access it. We'll wire this up to Better Auth once the
   * auth-aware procedures are needed.
   */
  return { userId: "user_123" };
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
