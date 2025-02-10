import DriveContents from "~/app/drive-contents";
import { QUERIES } from "~/server/db/actions";
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

  const [files, folders, parents] = await Promise.all([
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
};

export default Page;
