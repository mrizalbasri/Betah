import { ShapFactorRow } from "@/features/employee/components/ShapFactorRow";
import type { ShapFactor } from "@/lib/api/types";

interface ShapFactorsListProps {
  factors: ShapFactor[];
}

/** Renders the "Faktor Pendorong (SHAP)" section: a heading plus one row per contributing factor. */
export function ShapFactorsList({ factors }: ShapFactorsListProps) {
  const maxAbsContribution = Math.max(
    ...factors.map((f) => Math.abs(f.contribution)),
    1 // avoid divide-by-zero when all contributions are 0
  );

  return (
    <div className="px-5 py-4">
      <h3 className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft">
        Faktor Pendorong (SHAP)
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
