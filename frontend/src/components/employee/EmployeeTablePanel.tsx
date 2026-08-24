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

  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <CardContent className="p-6">
          <LoadingState message="Memuat 1.470 data karyawan dari FastAPI backend..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <CardContent className="p-6">
          <ErrorState
            message="Gagal terhubung ke FastAPI server (http://localhost:8000). Pastikan uvicorn sudah dinyalakan di terminal."
            onRetry={() => window.location.reload()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <EmployeeTablePanelHeader employees={employees} />
      <EmployeeTable employees={employees} />
    </Card>
  );
}
