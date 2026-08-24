/** Renders the Betah wordmark and tagline at the top of the sidebar. */
export function SidebarBrand() {
  return (
    <div className="flex items-baseline gap-2">
      <div className="h-[22px] w-[22px] flex-shrink-0 rounded-[5px] bg-gradient-to-br from-[#6FA98C] to-accent" />
      <div>
        <div className="font-serif text-[19px] font-semibold tracking-tight text-white">
          Betah
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-[#9CA6A0]">
          Attrition Advisor
        </div>
      </div>
    </div>
  );
}
