import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { headers } from "next/headers";
import superjson from "superjson";

import { auth } from "@/lib/auth";

export const createTRPCContext = cache(async () => {
  // Pull the authenticated session (if any) out of the incoming request
  // headers so every procedure can access it via ctx.session.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return { session };
});

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// A procedure that requires a signed-in user. Throws UNAUTHORIZED otherwise.
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to do this.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.session,
    },
  });
});
