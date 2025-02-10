import { eq } from "drizzle-orm";
import DriveContents from "~/app/drive-contents";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

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

  const files = await db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, parsedFolderId));
  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, parsedFolderId));

  return <DriveContents files={files} folders={folders} />;
};

export default Page;
