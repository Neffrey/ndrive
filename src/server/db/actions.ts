import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import {
  DB_FolderType,
  files_table,
  folders_table,
  users_table,
} from "~/server/db/schema";

export const QUERIES = {
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
  createFile: async function (input: z.infer<typeof INPUT_SCHEMAS.createFile>) {
    const session = await auth();
    if (!session?.userId) {
      throw new Error("Unauthorized");
    }

    return await db.insert(files_table).values({
      ...INPUT_SCHEMAS.createFile.parse(input),
      ownerId: session.userId,
    });
  },

  createFolder: async function (
    input: z.infer<typeof INPUT_SCHEMAS.createFolder>,
  ) {
    const session = await auth();
    if (!session?.userId) {
      throw new Error("Unauthorized");
    }

    return await db.insert(folders_table).values({
      name: "New Folder", // Default name
      ...INPUT_SCHEMAS.createFolder.parse(input),
      ownerId: session.userId,
    });
  },
};

// ONBOARDING
export const completeOnboarding = async () => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const localDb = await db
    .selectDistinct()
    .from(users_table)
    .where(eq(users_table.id, userId));

  if (localDb.length === 0) {
    const rootFolder = await db
      .insert(folders_table)
      .values({
        name: "Root",
        ownerId: userId,
      })
      .$returningId();

    await db.insert(users_table).values({
      id: userId,
      rootId: rootFolder[0]!.id,
    });
  }
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
