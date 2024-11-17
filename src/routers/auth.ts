import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../trpc";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config";

export const authRouter = router({
  login: publicProcedure.input(z.object({
    username: z.string()
  })).mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.username, input.username)
    }) ?? (await db.insert(users).values({ username: input.username }).returning())[0]

    const token = jwt.sign({ sub: user.id }, JWT_SECRET)

    return {
      token
    }
  }),
  iam: authenticatedProcedure.query(async ({ ctx }) => {
    return {
      username: ctx.user.username
    }
  })
})