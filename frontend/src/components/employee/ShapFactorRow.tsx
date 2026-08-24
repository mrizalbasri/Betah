import type { ShapFactor } from "@/lib/api/types";

interface ShapFactorRowProps {
  factor: ShapFactor;
  maxAbsContribution: number;
}

export function ShapFactorRow({ factor, maxAbsContribution }: ShapFactorRowProps) {
  const isPositive = factor.contribution >= 0;
  const barWidthPct =
    (Math.abs(factor.contribution) / maxAbsContribution) * 50;

  return (
    <div className="mb-2.5 flex items-center gap-2.5 last:mb-0">
      <div className="w-[132px] flex-shrink-0 text-xs font-semibold text-slate-700 truncate" title={factor.label}>
        {factor.label}
      </div>
      <div className="relative flex h-4 flex-1 items-center">
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-200" />
        <div
          className={`h-2 rounded-[3px] transition-all duration-300 ${
            isPositive ? "bg-rose-500" : "bg-emerald-500"
          }`}
          style={{
            width: `${barWidthPct}%`,
            marginLeft: isPositive ? "50%" : `${50 - barWidthPct}%`,
          }}
        />
      </div>
      <div
        className={`w-10 flex-shrink-0 text-right font-mono text-[11px] font-bold ${
          isPositive ? "text-rose-600" : "text-emerald-600"
        }`}
      >
        {isPositive ? "+" : ""}
        {factor.contribution}%
      </div>
    </div>
  );
}
