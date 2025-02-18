import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import {
  DB_FolderType,
  DB_UsersType,
  files_table,
  folders_table,
  users_table,
} from "~/server/db/schema";

export const QUERIES = {
  getUser: async function (userId: string) {
    return await db
      .selectDistinct()
      .from(users_table)
      .where(eq(users_table.id, userId));
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents: DB_FolderType[] = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));
      if (!folder[0]) {
        throw new Error("Folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },

  getFolders: async function (folderId: number) {
    const session = await auth();
    if (!session?.userId) {
      throw new Error("Unauthorized");
    }
    return db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.parent, folderId),
          eq(folders_table.ownerId, session.userId),
        ),
      );
  },

  getFiles: function (folderId: number) {
    return db
      .select()
      .from(files_table)
      .where(eq(files_table.parent, folderId));
  },
};

// INPUT SCHEMAS
const INPUT_SCHEMAS = {
  createFile: z.object({
    name: z.string(),
    size: z.number(),
    fileKey: z.string(),
    url: z.string(),
    parent: z.number(),
  }),
  createFolder: z.object({
    name: z.string().optional(),
    parent: z.number().optional(),
  }),
};

// MUTATIONS
export const MUTATIONS = {
  user: {
    createUser: async function () {
      const { userId } = await auth();
      if (!userId) {
        throw new Error("Unauthorized");
      }

      return await db
        .insert(users_table)
        .values({
          id: userId,
        })
        .$returningId();
    },
    updateMyUser: async function (data: Partial<DB_UsersType>) {
      const session = await auth();
      if (!session?.userId) {
        throw new Error("Unauthorized");
      }

      return await db
        .update(users_table)
        .set(data)
        .where(eq(users_table.id, session.userId));
    },
    updateUser: async function (userId: string, data: Partial<DB_UsersType>) {
      const session = await auth();
      if (!session?.userId) {
        throw new Error("Unauthorized");
      }

      return await db
        .update(users_table)
        .set(data)
        .where(eq(users_table.id, userId));
    },
  },
  file: {
    createFile: async function (
      input: z.infer<typeof INPUT_SCHEMAS.createFile>,
    ) {
      const session = await auth();
      if (!session?.userId) {
        throw new Error("Unauthorized");
      }

      return await db.insert(files_table).values({
        ...INPUT_SCHEMAS.createFile.parse(input),
        ownerId: session.userId,
      });
    },
  },
  folder: {
    createFolder: async function (
      input: z.infer<typeof INPUT_SCHEMAS.createFolder>,
    ) {
      const session = await auth();
      if (!session?.userId) {
        throw new Error("Unauthorized");
      }

      return await db
        .insert(folders_table)
        .values({
          name: "New Folder", // Default name
          ...INPUT_SCHEMAS.createFolder.parse(input),
          ownerId: session.userId,
        })
        .$returningId();
    },
  },
};
