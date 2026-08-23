import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Lazily creates the Drizzle client so importing this package never throws
 * before DATABASE_URL is actually needed (e.g. during a build with no DB
 * configured yet).
 */
export function getDb() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your app's environment to enable order storage."
    );
  }
  cached = drizzle(neon(url), { schema });
  return cached;
}
