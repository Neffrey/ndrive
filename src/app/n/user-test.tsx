import { auth } from "@clerk/nextjs/server";

export default async function UserTest() {
  // const { user } = useUser();
  const { userId, sessionClaims } = await auth();
  const newMeta = { ...sessionClaims?.metadata };
  return (
    <div>
      <div>userId: {userId}</div>
      <div>metadata: {JSON.stringify(sessionClaims?.metadata?.role)}</div>
      <div>new: {JSON.stringify(newMeta)}</div>
    </div>
  );
}
