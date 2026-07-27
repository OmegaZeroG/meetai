import { eq } from "drizzle-orm";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const meetingsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select()
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    return data;
  }),
});
