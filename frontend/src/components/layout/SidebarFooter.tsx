/**
 * Sidebar footer showing the current user. Static for now since auth is
 * out of scope for this scaffold — swap in real session data later
 * without touching any other layout file.
 */
export function SidebarFooter() {
  return (
    <div className="mt-auto flex items-center gap-2 border-t border-white/[0.08] pt-4 text-xs text-[#8B958E]">
      <div className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-[#3E5B52] font-mono text-[11px] font-semibold text-[#D8E8DF]">
        SR
      </div>
      <div>
        <div className="font-medium text-[#D8DAD3]">Sri Rahayu</div>
        <div className="font-mono text-[10.5px]">HR Manager</div>
      </div>
    </div>
  );
}
