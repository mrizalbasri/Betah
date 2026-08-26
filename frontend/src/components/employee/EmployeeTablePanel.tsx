"use client";

import { Card, CardContent } from "@heroui/react";
import { EmployeeTablePanelHeader } from "@/components/employee/EmployeeTablePanelHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";

export function EmployeeTablePanel() {
  const { filters } = useEmployeeFilters();
  const { employees, isLoading, error } = useEmployees({
    department: filters.department,
    search: filters.search,
  });

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <EmployeeTablePanelHeader employees={employees} />

      {error ? (
        <CardContent className="p-6">
          <ErrorState
            message="Gagal terhubung ke server FastAPI. Silakan periksa koneksi."
            onRetry={() => window.location.reload()}
          />
        </CardContent>
      ) : (
        <div className="relative min-h-[300px]">
          {isLoading && employees.length === 0 && (
            <div className="p-8">
              <LoadingState message="Mencari data karyawan..." />
            </div>
          )}
          <EmployeeTable employees={employees} />
        </div>
      )}
    </Card>
  );
}
