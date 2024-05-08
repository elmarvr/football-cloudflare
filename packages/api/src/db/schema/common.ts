import { integer, text } from "drizzle-orm/sqlite-core";
import { commonTable } from "../utils";

export const teamTable = commonTable("team", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});
