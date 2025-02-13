import { Button } from "~/components/ui/button"
import { HardDrive, Star, Clock, Trash, Cloud, Plus } from "lucide-react"

export default function Sidebar() {
  const menuItems = [
    { icon: HardDrive, label: "My Drive" },
    { icon: Star, label: "Starred" },
    { icon: Clock, label: "Recent" },
    { icon: Trash, label: "Trash" },
  ]

  return (
    <aside className="w-64 p-4 border-r">
      <Button className="w-full mb-4">
        <Plus className="mr-2 h-4 w-4" /> New
      </Button>
      <nav>
        {menuItems.map((item, index) => (
          <Button key={index} variant="ghost" className="w-full justify-start mb-1">
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center">
          <Cloud className="mr-2 h-4 w-4" />
          <span className="text-sm text-muted-foreground">Storage</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">6.5 GB of 15 GB used</p>
      </div>
    </aside>
  )
}

