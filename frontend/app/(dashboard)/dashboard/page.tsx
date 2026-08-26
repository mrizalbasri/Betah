"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { EmployeeTablePanel } from "@/components/employee/EmployeeTablePanel";
import { EmployeeDetailPanel } from "@/components/employee/EmployeeDetailPanel";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmployeeFilterProvider } from "@/lib/context/EmployeeFilterContext";
import { SelectedEmployeeProvider } from "@/lib/context/SelectedEmployeeContext";
import { useDashboardSummary } from "@/lib/hooks/useDashboardSummary";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { exportEmployeesToCsv } from "@/lib/utils";
import { CsvImportModal } from "@/components/modals/CsvImportModal";
import { ExecutiveReportModal } from "@/components/modals/ExecutiveReportModal";

function OverviewContent() {
  const { summary, isLoading, error } = useDashboardSummary();
  const { employees } = useEmployees();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  function handleExportCsv() {
    exportEmployeesToCsv(employees);
  }

  return (
    <>
      <Topbar
        title="Employee Risk Overview"
        subtitle={
          <>
            Prediksi attrition dari{" "}
            <span className="font-bold text-slate-900">
              {summary ? summary.totalEmployees.toLocaleString("id-ID") : "..."}
            </span>{" "}
            karyawan aktif | model{" "}
            <span className="font-mono font-bold text-[#006FEE]">xgboost-v4-tuned</span>
          </>
        }
        onExportData={handleExportCsv}
        onImportData={() => setIsImportModalOpen(true)}
        onExportReportPdf={() => setIsReportModalOpen(true)}
      />

      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        summary={summary}
        employees={employees}
      />

      <div className="flex flex-col gap-6 p-8">
        {isLoading && <LoadingState message="Memuat ringkasan dashboard dari FastAPI..." />}

        {error && (
          <ErrorState
            message="Gagal memuat ringkasan dashboard dari FastAPI (http://localhost:8000). Pastikan uvicorn sudah dinyalakan di terminal."
            onRetry={() => window.location.reload()}
          />
        )}

        {summary && !error && <MetricsRow summary={summary} />}

        {/* Main Section: Employee Table & Detail Drawer */}
        <div className="grid grid-cols-[1fr_420px] items-start gap-6">
          <EmployeeTablePanel />
          <EmployeeDetailPanel />
        </div>
      </div>
    </>
  );
}

export default function OverviewPage() {
  return (
    <EmployeeFilterProvider>
      <SelectedEmployeeProvider>
        <OverviewContent />
      </SelectedEmployeeProvider>
    </EmployeeFilterProvider>
  );
}
