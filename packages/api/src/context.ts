import type { Context as HonoContext } from "hono";
import { createDb } from "../../db/src";

export function createContext(c: HonoContext<{ Bindings: Env }>) {
  const db = createDb(c.env);

  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
