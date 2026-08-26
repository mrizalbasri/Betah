"use client";

import { EmployeeTableHeader } from "@/components/employee/EmployeeTableHeader";
import { EmployeeTableRow } from "@/components/employee/EmployeeTableRow";
import { TableFooter } from "@/components/employee/TableFooter";
import { useSelectedEmployee } from "@/lib/context/SelectedEmployeeContext";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTableProps {
  employees: EmployeeSummary[];
  /** Server-side pagination — all controlled by EmployeeTablePanel */
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function EmployeeTable({
  employees,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: EmployeeTableProps) {
  const { selectedEmployeeId, selectEmployee } = useSelectedEmployee();

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse min-w-[620px]">
          <EmployeeTableHeader />
          <tbody>
            {employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                isSelected={employee.id === selectedEmployeeId}
                onSelect={selectEmployee}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        visibleCount={employees.length}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
