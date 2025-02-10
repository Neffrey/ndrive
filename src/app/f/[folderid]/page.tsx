import { eq } from "drizzle-orm";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import { DB_FolderType, files_table, folders_table } from "~/server/db/schema";

const getAllParents = async (folderId: number) => {
  const parents: DB_FolderType[] = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folders_table)
      .where(eq(folders_table.id, currentId));
    if (!folder[0]) {
      throw new Error("Folder not found");
    }

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }
  return parents;
};

const Page = async (props: {
  params: Promise<{
    folderid: string;
  }>;
}) => {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderid);
  if (isNaN(parsedFolderId)) {
    return (
      <div className="m-4 text-2xl font-bold text-red-500">
        Invalid folder ID
      </div>
    );
  }

  const filesPromise = await db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, parsedFolderId));
  const foldersPromise = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);
  const [files, folders, parents] = await Promise.all([
    filesPromise,
    foldersPromise,
    parentsPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
};

export default Page;
