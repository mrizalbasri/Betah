"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  AlertTriangle,
  Building2,
  PieChart,
  SlidersHorizontal,
  MessageSquareText,
  Activity,
  Settings,
  ExternalLink,
} from "lucide-react";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  iconType?: string;
  isNew?: boolean;
  badge?: string;
  status?: string;
  target?: string;
}

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  risk: AlertTriangle,
  department: Building2,
  shap: PieChart,
  simulator: SlidersHorizontal,
  chat: MessageSquareText,
  health: Activity,
  settings: Settings,
};

export function SidebarNavLink({
  href,
  label,
  iconType = "dashboard",
  isNew,
  badge,
  status,
  target,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isExternal = href.startsWith("http");
  const isActive = !isExternal && href !== "#" && !href.startsWith("#") && pathname === href;
  const IconComponent = ICON_MAP[iconType] || LayoutDashboard;

  const content = (
    <div className={cn(
      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all w-full",
      isActive
        ? "bg-blue-50 text-[#006FEE] font-bold border border-blue-100 shadow-2xs"
        : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
    )}>
      <div className="flex items-center gap-3">
        <IconComponent className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#006FEE]" : "text-slate-400")} />
        <span>{label}</span>
      </div>

      {isNew && (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
          New
        </span>
      )}

      {badge && (
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200">
          {badge}
        </span>
      )}

      {status && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      )}
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target={target || "_blank"} rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full">
      {content}
    </Link>
  );
}
