import { EmployeeTableFilters } from "@/features/employee/components/EmployeeTableFilters";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTablePanelHeaderProps {
  employees: EmployeeSummary[];
}

/** Panel header row: "Semua Karyawan" title plus the filter controls. */
export function EmployeeTablePanelHeader({
  employees,
}: EmployeeTablePanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
      <h2 className="font-serif text-[16.5px] font-medium text-ink">
        Semua Karyawan
      </h2>
      <EmployeeTableFilters employees={employees} />
    </div>
  );
}
