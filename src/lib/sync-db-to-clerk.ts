import { clerkClient } from "@clerk/nextjs/server";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

// If user is logged in but doesnt have clerk metadata
export default async function syncDbToClerk(userId: string) {
  const client = await clerkClient();
  const { publicMetadata } = await client.users.getUser(userId);
  if (userId && (!publicMetadata?.role || !publicMetadata?.root)) {
    const dbUser = await QUERIES.getUser(userId);

    // If user doesnt exist, create user and root folder and update clerk metadata
    if (dbUser.length === 0) {
      const newUser = await MUTATIONS.user.createUser();
      if (newUser.length === 0) {
        throw new Error("Failed to create user");
      }
      const rootFolder = await MUTATIONS.folder.createFolder({
        name: "nDrive",
      });
      if (rootFolder.length === 0) {
        throw new Error("Failed to create root folder");
      }
      await MUTATIONS.user.updateMyUser({
        rootId: rootFolder[0]!.id,
      });

      // Update clerk metadata
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: "user",
          root: rootFolder[0]!.id,
        },
      });
    }

    // If dbUser exists
    if (dbUser.length > 0) {
      // If user exists, but no rootId in DB, create root folder and update clerk metadata
      if (dbUser[0] && !dbUser[0].rootId) {
        const rootFolder = await MUTATIONS.folder.createFolder({
          name: "nDrive",
        });
        if (rootFolder.length === 0) {
          throw new Error("Failed to create root folder");
        }
        const updatedUser = await MUTATIONS.user.updateMyUser({
          rootId: rootFolder[0]!.id,
        });
        if (!updatedUser) {
          throw new Error("Failed to update user");
        }

        // Update clerk metadata
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            root: rootFolder[0]!.id,
          },
        });
      }

      // If dbUser rootId exists, but no clerk root, update clerk root
      if (dbUser[0]?.rootId && dbUser[0].rootId !== publicMetadata?.root) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            root: dbUser[0]!.rootId,
          },
        });
      }

      // If user exists, but no clerk role, update clerk role
      if (dbUser[0]?.role && dbUser[0].role !== publicMetadata?.role) {
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            role: dbUser[0]!.role,
          },
        });
      }
    }
  }
}
