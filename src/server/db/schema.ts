// import "server-only";

import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  singlestoreTableCreator,
  text,
  timestamp,
} from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator((name) => `ndrive_${name}`);

export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    fileKey: text("file_key").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);

export type DB_FolderType = typeof folders_table.$inferSelect;

export const users_table = createTable(
  "users_table",
  {
    id: text("id").primaryKey(),
    rootId: bigint("root_id", { mode: "number", unsigned: true }),
    role: text("role", { enum: ["admin", "user", "restricted"] })
      .notNull()
      .default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  // (t) => {
  //   return [index("userid_index").on(t.id)];
  // },
);

export const users_relations = relations(users_table, ({ one }) => ({
  root: one(folders_table, {
    fields: [users_table.rootId],
    references: [folders_table.id],
  }),
}));

export type DB_UsersType = typeof users_table.$inferSelect;
