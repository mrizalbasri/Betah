import { SidebarNavLink } from "@/components/layout/SidebarNavLink";

const WORKSPACE_ITEMS = [
  { href: "/", label: "Dashboard", iconType: "dashboard" },
  { href: "/high-risk", label: "High Risk Tracker", iconType: "risk", badge: "285" },
  { href: "/department-risk", label: "Department Risk", iconType: "department" },
];

const AI_ANALYTICS_ITEMS = [
  { href: "/global-factors", label: "Global SHAP Factors", iconType: "shap" },
  { href: "/what-if", label: "What-If Simulator", iconType: "simulator" },
];

const SYSTEM_ITEMS = [
  { href: "http://localhost:8000/docs", label: "FastAPI Swagger Docs", iconType: "health", status: "Online" },
  { href: "/settings", label: "Model Configurations", iconType: "settings" },
];

export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-5">
      {/* Group 1: Workspace */}
      <div className="flex flex-col gap-1">
        <div className="mb-1 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        {WORKSPACE_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            iconType={item.iconType}
            badge={item.badge}
          />
        ))}
      </div>

      {/* Group 2: AI & Analytics API */}
      <div className="flex flex-col gap-1">
        <div className="mb-1 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          AI & Analytics API
        </div>
        {AI_ANALYTICS_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            iconType={item.iconType}
          />
        ))}
      </div>

      {/* Group 3: System */}
      <div className="flex flex-col gap-1">
        <div className="mb-1 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          System
        </div>
        {SYSTEM_ITEMS.map((item) => (
          <SidebarNavLink
            key={item.label}
            href={item.href}
            label={item.label}
            iconType={item.iconType}
            status={item.status}
          />
        ))}
      </div>
    </nav>
  );
}
