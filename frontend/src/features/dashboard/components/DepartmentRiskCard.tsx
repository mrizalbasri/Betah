import { getRiskColorClasses } from "@/lib/utils/getRiskColorClasses";
import { getRiskLevel } from "@/lib/utils/getRiskLevel";
import type { DepartmentRiskAverage } from "@/lib/api/types";

interface DepartmentRiskCardProps {
  departments: DepartmentRiskAverage[];
}

/** Metric card listing average attrition risk score per department (PRD §3.1). */
export function DepartmentRiskCard({ departments }: DepartmentRiskCardProps) {
  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-wide text-ink-soft">
        Avg Risk per Departemen
      </div>
      <div className="flex flex-col gap-1.5">
        {departments.map((dept) => {
          const colors = getRiskColorClasses(
            getRiskLevel(dept.averageRiskScore)
          );
          return (
            <div
              key={dept.department}
              className="flex justify-between text-xs"
            >
              <span className="font-mono text-ink-soft">
                {dept.department}
              </span>
              <span className={`font-mono font-semibold ${colors.text}`}>
                {dept.averageRiskScore}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
