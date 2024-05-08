import { integer, primaryKey, text } from "drizzle-orm/sqlite-core";
import { commonTable } from "../utils";

export const userTable = commonTable("user", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("image"),
});

export const sessionTable = commonTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const accountTable = commonTable(
  "account",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.providerId, t.providerUserId] }),
  })
);
