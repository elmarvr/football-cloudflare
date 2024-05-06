import type { Context as HonoContext } from "hono";
import { createDb } from "./db";

export function createContext(c: HonoContext<{ Bindings: Env }>) {
  const db = createDb({
    url: c.env.TURSO_URL,
    authToken: c.env.TURSO_AUTH_TOKEN,
  });

  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
