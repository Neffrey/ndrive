"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const Home = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">Store and share from Anywhere</h2>
      <p className="text-lg">
        Access your documents, photos, and videos from any device, and
        collaborate with others in real-time.
      </p>

      <div className="flex gap-4 p-4">
        <SignedIn>
          <Button variant="default" onClick={() => router.push("/n")}>
            Go to Drive
          </Button>
        </SignedIn>
        <SignedOut>
          <Button variant="default" onClick={() => router.push("/sign-in")}>
            Log In
          </Button>
          <Button variant="default" onClick={() => router.push("/sign-up")}>
            Sign Up
          </Button>
        </SignedOut>
      </div>
    </div>
  );
};

export default Home;
