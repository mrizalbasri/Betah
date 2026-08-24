import { ShapFactorRow } from "@/components/employee/ShapFactorRow";
import type { ShapFactor } from "@/lib/api/types";

interface ShapFactorsListProps {
  factors: ShapFactor[];
}

export function ShapFactorsList({ factors }: ShapFactorsListProps) {
  const maxAbsContribution = Math.max(
    ...factors.map((f) => Math.abs(f.contribution)),
    1
  );

  return (
    <div className="px-5 py-4 border-b border-slate-200 bg-white">
      <h3 className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
        Faktor Pendorong (SHAP Explanation)
      </h3>
      {factors.map((factor) => (
        <ShapFactorRow
          key={factor.label}
          factor={factor}
          maxAbsContribution={maxAbsContribution}
        />
      ))}
    </div>
  );
}
