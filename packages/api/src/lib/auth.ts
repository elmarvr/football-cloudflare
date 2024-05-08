import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { Lucia } from "lucia";
import { Database } from "../db";
import { sessionTable, userTable } from "../db/schema/auth";

export function createAuth(db: Database) {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: false,
      },
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createAuth>;
    UserId: number;
  }
}
