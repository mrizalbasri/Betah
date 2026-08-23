"use client";

import { EmployeeTableHeader } from "@/features/employee/components/EmployeeTableHeader";
import { EmployeeTableRow } from "@/features/employee/components/EmployeeTableRow";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import { useSelectedEmployee } from "@/lib/context/SelectedEmployeeContext";
import { filterEmployees, sortEmployees } from "@/lib/utils";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTableProps {
  employees: EmployeeSummary[];
}

/** The employee <table>, applying the shared filter and sort state before rendering rows. */
export function EmployeeTable({ employees }: EmployeeTableProps) {
  const { filters, sort } = useEmployeeFilters();
  const { selectedEmployeeId, selectEmployee } = useSelectedEmployee();

  const visibleEmployees = sortEmployees(
    filterEmployees(employees, filters),
    sort
  );

  return (
    <table className="w-full border-collapse">
      <EmployeeTableHeader />
      <tbody>
        {visibleEmployees.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            employee={employee}
            isSelected={employee.id === selectedEmployeeId}
            onSelect={selectEmployee}
          />
        ))}
      </tbody>
    </table>
  );
}
