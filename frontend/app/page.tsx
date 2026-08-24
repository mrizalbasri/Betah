"use client";

import { Topbar } from "@/components/layout/Topbar";
import { MetricsRow } from "@/features/dashboard/components/MetricsRow";
import { EmployeeTablePanel } from "@/features/employee/components/EmployeeTablePanel";
import { EmployeeDetailPanel } from "@/features/employee/components/EmployeeDetailPanel";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmployeeFilterProvider } from "@/lib/context/EmployeeFilterContext";
import { SelectedEmployeeProvider } from "@/lib/context/SelectedEmployeeContext";
import { useDashboardSummary } from "@/lib/hooks/useDashboardSummary";

/**
 * Employee Risk Overview page (PRD §3.1–3.2): summary metrics, the
 * filterable/sortable employee table, and the detail panel for
 * whichever employee is selected.
 */
export default function OverviewPage() {
  const { summary, isLoading, error } = useDashboardSummary();

  return (
    <EmployeeFilterProvider>
      <SelectedEmployeeProvider>
        <Topbar
          title="Employee Risk Overview"
          subtitle={
            <>
              Prediksi attrition dari{" "}
              <span className="font-mono">
                {summary?.totalEmployees.toLocaleString("id-ID") ?? "..."}
              </span>{" "}
              karyawan aktif &middot; model{" "}
              <span className="font-mono">xgboost-v4-tuned</span>
            </>
          }
        />

        <div className="grid grid-cols-[1fr_340px] items-start gap-[22px] px-9 py-[26px]">
          {isLoading && (
            <div className="col-span-full">
              <LoadingState message="Memuat ringkasan dashboard..." />
            </div>
          )}

          {error && (
            <div className="col-span-full">
              <ErrorState message="Gagal memuat ringkasan dashboard." />
            </div>
          )}

          {summary && <MetricsRow summary={summary} />}

          <EmployeeTablePanel />
          <EmployeeDetailPanel />
        </div>
      </SelectedEmployeeProvider>
    </EmployeeFilterProvider>
  );
}
