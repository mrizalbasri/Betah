import { MetricCard } from "@/components/dashboard/MetricCard";
import type { DashboardSummary } from "@/lib/api/types";

interface MetricsRowProps {
  summary: DashboardSummary;
}

export function MetricsRow({ summary }: MetricsRowProps) {
  const topDept = summary.departmentAverages.reduce(
    (max, d) => (d.averageRiskScore > max.averageRiskScore ? d : max),
    summary.departmentAverages[0] || { department: "Sales", averageRiskScore: 24.89 }
  );

  return (
    <div className="col-span-full grid grid-cols-4 gap-4">
      <MetricCard
        label="Total Karyawan"
        value={summary.totalEmployees.toLocaleString("id-ID")}
        subtext="1.470 karyawan aktif di memori"
        trend="3.3%"
        trendDirection="up"
      />
      <MetricCard
        label="High Risk (Atensi HR)"
        flagged
        value={summary.highRiskCount}
        subtext="Karyawan dengan probabilitas >= 50%"
        trend={`${summary.highRiskDeltaPct}%`}
        trendDirection="up"
      />
      <MetricCard
        label="Rata-rata Risk Score"
        value={`${summary.averageRiskScore}%`}
        subtext="Tingkat probabilitas agregat organisasi"
        trend="1.2%"
        trendDirection="down"
      />
      <MetricCard
        label="Divisi Paling Kritis"
        value={`${topDept.department} (${topDept.averageRiskScore}%)`}
        subtext="Departemen risiko tertinggi saat ini"
        trend="Top Divisi"
        trendDirection="up"
      />
    </div>
  );
}
