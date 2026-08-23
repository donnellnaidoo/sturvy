import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Lazily creates the Drizzle client so importing this package never throws
 * before DATABASE_URL is actually needed (e.g. during a build with no DB
 * configured yet). Uses a plain Postgres wire-protocol connection so it
 * works against any standard Postgres host (Supabase, Neon, RDS, etc.).
 */
export function getDb() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your app's environment to enable order storage."
    );
  }
  // `prepare: false` is required for Supabase's transaction-mode pooler
  // (pgbouncer), which doesn't support prepared statements. Harmless
  // against a direct connection too.
  const sql = postgres(url, { ssl: "require", prepare: false });
  cached = drizzle(sql, { schema });
  return cached;
}
