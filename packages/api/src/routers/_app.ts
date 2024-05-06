import { z } from "zod";
import { procedure, router } from "../lib/trpc";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        message: input.name
      };
    }),
});

export type AppRouter = typeof appRouter;
