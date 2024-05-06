import { drizzle } from "drizzle-orm/libsql";
import { teamTable } from "./schema/common";
import { Config, createClient } from "@libsql/client";

export function createDb(config: Pick<Config, "url" | "authToken">) {
  const client = createClient(config);

  return drizzle(client, {
    schema: {
      team: teamTable,
    },
  });
}
