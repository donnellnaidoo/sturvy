import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Supabase databases ship many built-in schemas (auth, storage, realtime,
  // extensions, ...) full of objects. Without this, drizzle-kit introspects
  // all of them on every push, which is extremely slow.
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
