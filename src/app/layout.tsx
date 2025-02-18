import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { type Metadata } from "next";
import Header from "~/components/header";
import syncDbToClerk from "~/lib/sync-db-to-clerk";

export const metadata: Metadata = {
  title: "nDrive",
  description: "File Storage by Neffrey",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId, sessionClaims } = await auth();
  if (userId) {
    await syncDbToClerk(userId);
  }
  return (
    <ClerkProvider>
      <html lang="en" className={`dark`}>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
