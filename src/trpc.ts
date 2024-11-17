import { TRPCError, initTRPC } from "@trpc/server";
import { type Context } from "./context";

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const authenticatedProcedure = t.procedure.use(async (opts) => {
  if(!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return opts.next({
    ctx: {
      user: opts.ctx.user
    }
  })
})