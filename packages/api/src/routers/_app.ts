import { router } from "../lib/trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;

export const test = "123";
