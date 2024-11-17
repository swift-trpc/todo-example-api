import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "./config";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";

export const createContext = async ({ req }: CreateNextContextOptions) => {
  const authorizationHeaderValue = req.headers['authorization']

  if(!authorizationHeaderValue || typeof authorizationHeaderValue !== 'string') {
    return {
      user: null
    }
  }

  const token = authorizationHeaderValue.split(' ')[1]

  if(!token) {
    return {
      user: null
    }
  }

  try {
    const tokenData = jwt.verify(token, JWT_SECRET)
    const userId = parseInt(tokenData.sub as string)

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    })

    return {
      user
    }
  } catch (e) {
    return {
      user: null
    }
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>