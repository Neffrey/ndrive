"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const clearMetadata = async function () {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        ndriveRole: undefined,
        ndriveRootId: undefined,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
