import { BuildColumns } from "drizzle-orm";
import {
  SQLiteColumnBuilderBase,
  SQLiteTableExtraConfig,
  integer,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

export function commonTable<
  TTableName extends string,
  TColumnsMap extends Record<string, SQLiteColumnBuilderBase>
>(
  name: TTableName,
  columns: TColumnsMap,
  extraConfig?: (
    self: BuildColumns<
      TTableName,
      TColumnsMap & typeof timestampColumns,
      "sqlite"
    >
  ) => SQLiteTableExtraConfig
) {
  return sqliteTable(name, { ...columns, ...timestampColumns }, extraConfig);
}

export const timestampColumns = {
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
} satisfies Record<string, SQLiteColumnBuilderBase>;
