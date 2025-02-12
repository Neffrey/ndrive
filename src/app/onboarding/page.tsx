"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as React from "react";
import LoadingSpinner from "~/components/ui/loading-spinner";
import { completeOnboarding } from "~/server/db/actions";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const onboardingEffect = async () => {
    const res = await completeOnboarding();
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      router.push("/n/");
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  React.useEffect(() => {
    onboardingEffect();
  }, []);

  return <LoadingSpinner />;
}
