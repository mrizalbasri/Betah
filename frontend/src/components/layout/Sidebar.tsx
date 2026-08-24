import { SidebarBrand } from "@/components/layout/SidebarBrand";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SidebarFooter } from "@/components/layout/SidebarFooter";

/** The app's persistent left sidebar: brand, navigation, and current user. */
export function Sidebar() {
  return (
    <aside className="flex w-56 flex-shrink-0 flex-col gap-9 bg-ink px-5 py-7">
      <SidebarBrand />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}
