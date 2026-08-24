import { SidebarBrand } from "@/components/layout/SidebarBrand";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SidebarFooter } from "@/components/layout/SidebarFooter";

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6 shadow-xs">
      <div className="flex flex-col gap-6">
        <SidebarBrand />
        <SidebarNav />
      </div>
      <SidebarFooter />
    </aside>
  );
}
