import type { ShapFactor } from "@/lib/api/types";

interface ShapFactorRowProps {
  factor: ShapFactor;
  /** Largest absolute contribution across all factors, used to scale bar widths consistently. */
  maxAbsContribution: number;
}

/** One SHAP factor row: label, a diverging bar centered at zero, and the signed value. */
export function ShapFactorRow({ factor, maxAbsContribution }: ShapFactorRowProps) {
  const isPositive = factor.contribution >= 0;
  const barWidthPct =
    (Math.abs(factor.contribution) / maxAbsContribution) * 50;

  return (
    <div className="mb-2.5 flex items-center gap-2.5 last:mb-0">
      <div className="w-[132px] flex-shrink-0 text-[12.5px] text-ink">
        {factor.label}
      </div>
      <div className="relative flex h-4 flex-1 items-center">
        <div className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <div
          className={`h-2 rounded-[3px] ${
            isPositive ? "bg-signal-high" : "bg-signal-low"
          }`}
          style={{
            width: `${barWidthPct}%`,
            marginLeft: isPositive ? "50%" : `${50 - barWidthPct}%`,
          }}
        />
      </div>
      <div
        className={`w-10 flex-shrink-0 text-right font-mono text-[11px] font-semibold ${
          isPositive ? "text-signal-high" : "text-signal-low"
        }`}
      >
        {isPositive ? "+" : ""}
        {factor.contribution}%
      </div>
    </div>
  );
}
