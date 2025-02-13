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

// import Header from "~/components/Header"
// import Sidebar from "~/components/Sidebar"
// import FileList from "~/components/FileList"

// export default function Home() {
//   return (
//     <div className="flex flex-col h-screen">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-1 overflow-auto p-6">
//           <h1 className="text-2xl font-semibold mb-4">My Drive</h1>
//           <FileList />
//         </main>
//       </div>
//     </div>
//   )
// }
