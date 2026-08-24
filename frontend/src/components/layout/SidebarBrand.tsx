export function SidebarBrand() {
  return (
    <div className="flex flex-col gap-4">
      {/* App Brand Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-[#006FEE] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
          B
        </div>
        <div>
          <div className="font-sans text-base font-bold tracking-tight text-slate-900">
            Betah
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Attrition Advisor
          </div>
        </div>
      </div>

      {/* User Profile Badge */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-xs">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-sm" />
        <div className="min-w-0 flex-1">
          <div className="font-sans text-xs font-bold text-slate-900 truncate">
            Sri Rahayu
          </div>
          <div className="text-[11px] font-medium text-slate-500 truncate">
            HR Manager &middot; Admin
          </div>
        </div>
      </div>
    </div>
  );
}
