"use client";

import { useState } from "react";
import { EmployeeTableHeader } from "@/components/employee/EmployeeTableHeader";
import { EmployeeTableRow } from "@/components/employee/EmployeeTableRow";
import { TableFooter } from "@/components/employee/TableFooter";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import { useSelectedEmployee } from "@/lib/context/SelectedEmployeeContext";
import { filterEmployees, sortEmployees } from "@/lib/utils";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTableProps {
  employees: EmployeeSummary[];
}

const PAGE_SIZE = 10;

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const { filters, sort } = useEmployeeFilters();
  const { selectedEmployeeId, selectEmployee } = useSelectedEmployee();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSorted = sortEmployees(
    filterEmployees(employees, filters),
    sort
  );

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedEmployees = filteredAndSorted.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse min-w-[620px]">
          <EmployeeTableHeader />
          <tbody>
            {paginatedEmployees.map((employee) => (
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
        currentPage={safePage}
        totalPages={totalPages}
        visibleCount={paginatedEmployees.length}
        totalCount={totalItems}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
}
