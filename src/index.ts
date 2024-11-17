import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext } from "./context";
import { appRouter } from "./routers";
import cors from 'cors'

const handler = createHTTPServer({
  createContext,
  router: appRouter,
  middleware: cors()
})

const result = handler.listen(8200)
console.log(`Server started at http://localhost:${result.port}`)