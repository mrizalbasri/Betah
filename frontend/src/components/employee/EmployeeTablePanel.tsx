"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@heroui/react";
import { EmployeeTablePanelHeader } from "@/components/employee/EmployeeTablePanelHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";

const PAGE_SIZE = 20;

export function EmployeeTablePanel() {
  const { filters, sort } = useEmployeeFilters();
  const [page, setPage] = useState(1);

  // Reset ke halaman 1 setiap kali filter atau sort berubah
  useEffect(() => {
    setPage(1);
  }, [filters.department, filters.search, filters.riskLevel, sort.field, sort.direction]);

  // Server-side pagination: fetch only PAGE_SIZE rows, backend handles filter+sort
  const { employees, total, totalPages, isLoading, error } = useEmployees({
    department: filters.department,
    search: filters.search,
    sortBy: sort.field === "riskScore" ? "risk_score_percentage" : sort.field,
    order: sort.direction,
    page,
    limit: PAGE_SIZE,
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
          <EmployeeTable
            employees={employees}
            currentPage={page}
            totalPages={totalPages}
            totalCount={total}
            onPageChange={(p) => { setPage(p); }}
          />
        </div>
      )}
    </Card>
  );
}
