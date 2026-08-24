"use client";

import { EmployeeTablePanelHeader } from "@/features/employee/components/EmployeeTablePanelHeader";
import { EmployeeTable } from "@/features/employee/components/EmployeeTable";
import { TableFooter } from "@/features/employee/components/TableFooter";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import { filterEmployees } from "@/lib/utils";

/**
 * The full employee table panel: fetches employee data, and composes
 * the filter header, table, and footer. This is the single component
 * the overview page needs to render the left column.
 */
export function EmployeeTablePanel() {
  const { employees, isLoading, error } = useEmployees();
  const { filters } = useEmployeeFilters();

  if (isLoading) {
    return (
      <div className="rounded-card border border-line bg-panel">
        <LoadingState message="Memuat data karyawan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border border-line bg-panel">
        <ErrorState message="Gagal memuat data karyawan dari server." />
      </div>
    );
  }

  const visibleCount = filterEmployees(employees, filters).length;

  return (
    <div className="rounded-card border border-line bg-panel">
      <EmployeeTablePanelHeader employees={employees} />
      <EmployeeTable employees={employees} />
      <TableFooter visibleCount={visibleCount} totalCount={employees.length} />
    </div>
  );
}
