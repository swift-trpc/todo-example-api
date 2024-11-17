import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../trpc";
import { db } from "../db";
import { todos } from "../db/schema";
import { and, eq } from "drizzle-orm";
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
})