import { Context, Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Google } from "arctic";
import { createDb } from "../../db/src";
import { accountTable, userTable } from "../../db/src/schema/auth";
import { authRoutes, createAuth } from "./lib/auth";

export type { AppRouter } from "./routers/_app";

const app = new Hono<{ Bindings: Env }>();

app.get(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext(opts, c) {
      return createContext(c);
    },
  })
);

app.route("/auth", authRoutes);

export default app;
