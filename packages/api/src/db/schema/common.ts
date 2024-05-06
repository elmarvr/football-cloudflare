import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const teamTable = sqliteTable("team", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});
