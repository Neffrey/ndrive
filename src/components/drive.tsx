"use client"

import { Upload } from "lucide-react"
import { useState } from "react"
import { handleUpload } from "~/actions"
import { Button } from "~/components/ui/button"
import { FileTree } from "./file-tree"

// Mock data
const initialData = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    children: [
      { id: "2", name: "Report.docx", type: "file", url: "#" },
      { id: "3", name: "Spreadsheet.xlsx", type: "file", url: "#" },
    ],
  },
  {
    id: "4",
    name: "Images",
    type: "folder",
    children: [
      { id: "5", name: "Vacation.jpg", type: "file", url: "#" },
      { id: "6", name: "Family.png", type: "file", url: "#" },
    ],
  },
  { id: "7", name: "Notes.txt", type: "file", url: "#" },
  { id: "8", name: "Project.zip", type: "file", url: "#" },
]

export function Drive() {
  const [data, setData] = useState(initialData)
  const [isClient, setIsClient] = useState(false)

  const onUpload = async () => {
    const newFile = await handleUpload()
    setData((prevData) => [...prevData, newFile])
  }

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Google Drive Clone</h1>
        <Button onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" /> Upload File
        </Button>
      </div>
      <div className="border rounded-lg p-4">
        <FileTree items={data} />
      </div>
    </div>
  )
}

export default Drive

