import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import DriveContents from "./drive-contents";

const Home = async () => {
  const files = await db.select().from(files_table);
  const folders = await db.select().from(folders_table);

  return <DriveContents files={files} folders={folders} />;
};

export default Home;
