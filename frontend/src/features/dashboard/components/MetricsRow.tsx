import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { DepartmentRiskCard } from "@/features/dashboard/components/DepartmentRiskCard";
import type { DashboardSummary } from "@/lib/api/types";

interface MetricsRowProps {
  summary: DashboardSummary;
}

/** Renders the four summary metric cards (total, high-risk, avg score, per-department) above the table. */
export function MetricsRow({ summary }: MetricsRowProps) {
  return (
    <div className="col-span-full grid grid-cols-4 gap-3.5">
      <MetricCard
        label="Total Karyawan"
        value={summary.totalEmployees.toLocaleString("id-ID")}
      />
      <MetricCard
        label="High Risk"
        flagged
        value={
          <>
            {summary.highRiskCount}
            <span className="font-mono text-xs font-medium text-signal-high">
              ↑ {summary.highRiskDeltaPct}%
            </span>
          </>
        }
      />
      <MetricCard
        label="Avg Risk Score"
        value={
          <>
            {summary.averageRiskScore}
            <span className="text-base font-normal">%</span>
          </>
        }
      />
      <DepartmentRiskCard departments={summary.departmentAverages} />
    </div>
  );
}
