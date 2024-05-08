import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { teamTable } from "./schema/common";
import { createClient } from "@libsql/client";
import { accountTable, sessionTable, userTable } from "./schema/auth";

const schema = {
  users: userTable,
  sessions: sessionTable,
  accounts: accountTable,
  teams: teamTable,
};

export function createDb(env: Pick<Env, "TURSO_URL" | "TURSO_AUTH_TOKEN">) {
  const client = createClient({
    url: env.TURSO_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client, {
    schema,
  });
}

export type Database = LibSQLDatabase<typeof schema>;
