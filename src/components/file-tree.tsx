"use client"

import { ChevronDown, ChevronRight, File, Folder } from "lucide-react"
import { useState } from "react"
import { cn } from "~/lib/utils"

interface TreeItem {
  id: string
  name: string
  type: string//"file" | "folder"
  children?: TreeItem[]
  url?: string
}

interface FileTreeProps {
  items: TreeItem[]
  level?: number
}

export function FileTree({ items, level = 0 }: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <ul className={cn("space-y-1", level > 0 && "ml-4")}>
      {items.map((item) => (
        <li key={item.id}>
          {item.type === "folder" ? (
            <FolderItem
              item={item}
              isOpen={openFolders[item.id] ?? false}
              onToggle={() => toggleFolder(item.id)}
              level={level}
            />
          ) : (
            <FileItem item={item} />
          )}
        </li>
      ))}
    </ul>
  )
}

interface FolderItemProps {
  item: TreeItem
  isOpen: boolean
  onToggle: () => void
  level: number
}

function FolderItem({ item, isOpen, onToggle, level }: FolderItemProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 hover:bg-gray-100 rounded px-2 py-1 w-full text-left"
      >
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Folder className="h-4 w-4" />
        <span>{item.name}</span>
      </button>
      {isOpen && item.children && <FileTree items={item.children} level={level + 1} />}
    </div>
  )
}

interface FileItemProps {
  item: TreeItem
}

function FileItem({ item }: FileItemProps) {
  return (
    <a href={item.url} className="flex items-center space-x-2 hover:bg-gray-100 rounded px-2 py-1 ml-6">
      <File className="h-4 w-4" />
      <span>{item.name}</span>
    </a>
  )
}

