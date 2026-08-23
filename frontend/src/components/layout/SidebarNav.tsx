import { SidebarNavLink } from "@/components/layout/SidebarNavLink";

const NAV_ITEMS = [
  { href: "/", label: "Employee Risk" },
  { href: "/global-factors", label: "Global Feature Importance" },
  { href: "/what-if", label: "What-If Simulator" },
];

/** Renders the sidebar's workspace navigation links. */
export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-0.5">
      <div className="mb-0.5 ml-2.5 font-mono text-[10px] uppercase tracking-wider text-[#6E7871]">
        Workspace
      </div>
      {NAV_ITEMS.map((item) => (
        <SidebarNavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
