"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">nDrive</h1>
      </div>
      <div className="mx-4 flex w-full max-w-xl">
        <Input type="search" placeholder="Search" className="w-full" />
        <Button variant="ghost" size="icon" className="ml-2">
          <Search className="h-8 w-8" />
        </Button>
      </div>
      <div className="flex justify-end gap-4 space-x-2">
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
        {/* <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button> */}
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
