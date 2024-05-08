import { Context, Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Google } from "arctic";
import { createDb } from "./db";
import { accountTable, userTable } from "./db/schema/auth";
import { createAuth } from "./lib/auth";

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

app.post(
  "/auth/:provider/sign-in",
  zValidator("param", z.object({ provider: z.enum(["google"]) })),
  zValidator(
    "json",
    z.object({
      code: z.string(),
    })
  ),
  async (c) => {
    const { provider } = c.req.valid("param");
    const { code } = c.req.valid("json");

    if (provider === "google") {
      const session = await createGoogleSession(c, code);

      return c.json({
        sessionId: session.id,
      });
    }
  }
);

async function createGoogleSession(
  c: Context<{ Bindings: Env }>,
  code: string
) {
  const db = createDb(c.env);
  const auth = createAuth(db);

  const profile = await getGoogleProfile(c, code);

  const existingAccount = await db.query.accounts.findFirst({
    where: (a, { eq }) => eq(a.providerUserId, profile.id),
  });

  if (existingAccount) {
    return auth.createSession(existingAccount.userId, {});
  }

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, profile.email),
  });

  let userId = existingUser?.id;

  if (!existingUser) {
    const user = await db
      .insert(userTable)
      .values({
        email: profile.email,
        name: profile.name,
      })
      .returning({ id: userTable.id });

    userId = user[0]?.id;
  }

  await db.insert(accountTable).values({
    providerId: "google",
    providerUserId: profile.id,
    userId: userId!,
  });

  return auth.createSession(userId!, {});
}

async function getGoogleProfile(c: Context<{ Bindings: Env }>, code: string) {
  const google = new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    ""
  );

  const tokens = await google.validateAuthorizationCode(code, "");
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    }
  );

  const user = googleUserSchema.parse(await response.json());

  return {
    id: user.sub,
    name: user.name,
    email: user.email,
  };
}

const googleUserSchema = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string(),
});

export default app;
