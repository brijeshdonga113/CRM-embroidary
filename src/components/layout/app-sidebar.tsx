import { Scissors } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card print:hidden md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
          <Scissors className="size-4" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold tracking-tight">Stitchworks</span>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">Stitchworks CRM v0.1</p>
        <p className="text-xs text-muted-foreground">UI preview — sample data</p>
      </div>
    </aside>
  );
}
