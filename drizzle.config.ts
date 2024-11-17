import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_PATH ?? 'db.sqlite' },
  schema: "./src/db/schema.ts",
});
