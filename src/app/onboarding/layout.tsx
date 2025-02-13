import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { completeOnboarding } from "~/server/db/actions";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  const res = await completeOnboarding();
  if (res?.message) {
    redirect("/");
  }
  if (res?.error) {
    // redirect("/");
    throw new Error(res?.error);
  }

  return <>{children}</>;
}
