import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { type Database, createDb } from "@football/db";
import { Context, Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Google } from "arctic";
import { schema } from "@football/db";

export function createAuth(db: Database) {
  const adapter = new DrizzleSQLiteAdapter(db, schema.sessions, schema.users);

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: false,
      },
    },
  });
}

export const authRoutes = new Hono<{ Bindings: Env }>().post(
  "/:provider/sign-in",
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
      .insert(schema.users)
      .values({
        email: profile.email,
        name: profile.name,
      })
      .returning({ id: schema.users.id });

    userId = user[0]?.id;
  }

  await db.insert(schema.accounts).values({
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

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createAuth>;
    UserId: number;
  }
}
