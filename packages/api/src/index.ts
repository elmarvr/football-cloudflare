import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/_app";

export type { AppRouter } from "./routers/_app";

const app = new Hono();

app.get(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

export default app;
