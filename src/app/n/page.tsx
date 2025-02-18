import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.userId) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <div>userId: {JSON.stringify(session?.userId)}</div>
      <div>Test2: {JSON.stringify(session?.sessionClaims?.metadata?.root)}</div>
    </div>
  );
};

export default Page;
