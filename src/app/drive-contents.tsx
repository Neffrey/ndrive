"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/components/uploadthing";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";
import { FileRow, FolderRow } from "./filerow";

export default function GoogleDriveClone(props: {
  files: DB_FileType[];
  folders: DB_FolderType[];
  parents: DB_FolderType[];
}) {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/n/1" className="mr-2 text-gray-300 hover:text-white">
              My Drive
            </Link>
            {props.parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/n/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                // handleFolderClick={() => handleFolderClick(folder.id)}
              />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>
      <UploadButton
        endpoint="imageUploader"
        className="m-4"
        onClientUploadComplete={() => {
          navigate.refresh();
        }}
      />
    </div>
  );
}
