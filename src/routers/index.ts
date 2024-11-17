import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { todoRouter } from "./todo";

export const appRouter = router({
  health: publicProcedure.query(async () => {
    return {
      healthy: true
    }
  }),
  auth: authRouter,
  todo: todoRouter
})

export type AppRouter = typeof appRouter