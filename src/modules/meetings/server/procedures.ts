import { eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { meetingsInsertSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select({
        ...getTableColumns(meetings),
        agent: agents,
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.userId, ctx.auth.user.id));

    return data;
  }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          id: crypto.randomUUID(),
          userId: ctx.auth.user.id,
        })
        .returning();

      // TODO: create the Stream Video call + upsert the Stream user once
      // the Video Call chapter wires that integration in.

      return createdMeeting;
    }),
});
