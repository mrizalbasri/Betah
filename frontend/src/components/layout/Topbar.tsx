"use client";

import type { ReactNode } from "react";
import { Search, Bell, Download } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: ReactNode;
  onExportData?: () => void;
}

export function Topbar({ title, subtitle, onExportData }: TopbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-8 py-5">
      <div>
        <h1 className="font-sans text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          title="Search"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          title="Notifications"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors shadow-2xs"
        >
          <Bell className="h-4 w-4" />
        </button>

        {onExportData && (
          <button
            onClick={onExportData}
            className="flex items-center gap-2 cursor-pointer rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Data CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
