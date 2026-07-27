import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "../init";
import { agentsRouter } from "@/modules/agents/server/procedures";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  agents: agentsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
