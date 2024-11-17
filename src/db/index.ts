import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const DATABASE_PATH = process.env.DATABASE_PATH ?? 'db.sqlite'

export const db = drizzle(DATABASE_PATH, { schema, casing: 'snake_case' })