import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { appRouter } from "./routers/_app";
import { createContext } from "./context";

export type { AppRouter } from "./routers/_app";

const app = new Hono().get(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext(opts, c) {
      return createContext(c);
    },
  })
);

export default app;
