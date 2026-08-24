import { HelpCircle, LogOut } from "lucide-react";

export function SidebarFooter() {
  return (
    <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs font-medium text-slate-600">
      <button className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900">
        <HelpCircle className="h-4 w-4 text-slate-400" />
        <span>Help & Information</span>
      </button>
      <button className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-rose-50 hover:text-rose-600">
        <LogOut className="h-4 w-4 text-slate-400" />
        <span>Log out</span>
      </button>
    </div>
  );
}
