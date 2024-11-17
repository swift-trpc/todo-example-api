import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text().unique(),
})

export const todos = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),

  title: text().notNull(),
  checked: integer({ mode: 'boolean' }).default(false),

  userId: integer({ mode: 'number' }).references(() => users.id).notNull()
})