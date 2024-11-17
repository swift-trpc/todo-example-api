import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../trpc";
import { db } from "../db";
import { todos } from "../db/schema";
import { and, count, eq, sql, sum } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const todoRouter = router({
  create: authenticatedProcedure.input(z.object({
    title: z.string()
  })).mutation(async ({ input, ctx }) => {
    await db.insert(todos).values({
      title: input.title,
      userId: ctx.user.id
    })
  }),
  update: authenticatedProcedure.input(z.object({
    id: z.number().int(),
    checked: z.boolean()
  })).mutation(async ({ input, ctx }) => {
    const todo = await db.select().from(todos).where(
      and(
        eq(todos.userId, ctx.user.id),
        eq(todos.id, input.id)
      )
    )

    if(!todo) {
      throw new TRPCError({
        code: 'NOT_FOUND'
      })
    }

    const [updatedTodo] = await db.update(todos).set({
      checked: input.checked
    }).where(eq(todos.id, input.id)).returning()

    return updatedTodo
  }),
  all: authenticatedProcedure.query(async ({ctx}) => {
    return await db.select().from(todos).where(eq(todos.userId, ctx.user.id))
  }),
  stats: authenticatedProcedure.query(async ({ctx}) => {
    const [stats] = await db.select({
      total: count(),
      checked: sql`COALESCE(SUM(CASE WHEN ${todos.checked} THEN 1 ELSE 0 END), 0)`
    }).from(todos).where(eq(todos.userId, ctx.user.id))

    return stats
  })
})