import { File, Folder, MoreVertical } from "lucide-react"
import { Button } from "~/components/ui/button"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  modified: string
}

const mockFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", modified: "2023-04-10" },
  { id: "2", name: "Images", type: "folder", modified: "2023-04-09" },
  { id: "3", name: "report.pdf", type: "file", size: "2.5 MB", modified: "2023-04-08" },
  { id: "4", name: "presentation.pptx", type: "file", size: "5.1 MB", modified: "2023-04-07" },
  { id: "5", name: "budget.xlsx", type: "file", size: "1.2 MB", modified: "2023-04-06" },
]

export default function FileList() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Last modified</div>
        <div className="col-span-1"></div>
      </div>
      {mockFiles.map((file) => (
        <div
          key={file.id}
          className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center hover:bg-gray-50"
        >
          <div className="col-span-6 flex items-center">
            {file.type === "folder" ? (
              <Folder className="h-5 w-5 mr-2 text-blue-500" />
            ) : (
              <File className="h-5 w-5 mr-2 text-gray-500" />
            )}
            {file.name}
          </div>
          <div className="col-span-2 text-sm text-muted-foreground">{file.size || "--"}</div>
          <div className="col-span-3 text-sm text-muted-foreground">{file.modified}</div>
          <div className="col-span-1 text-right">
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

