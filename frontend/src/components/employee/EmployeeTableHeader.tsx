"use client";

import { SortableHeaderCell } from "@/components/employee/SortableHeaderCell";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";

export function EmployeeTableHeader() {
  const { sort, setSort } = useEmployeeFilters();

  function toggleRiskScoreSort() {
    setSort({
      field: "riskScore",
      direction: sort.direction === "desc" ? "asc" : "desc",
    });
  }

  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50/80">
        <th className="px-3.5 py-3 text-left font-sans text-xs font-semibold text-slate-500">
          Worker ID
        </th>
        <th className="px-3.5 py-3 text-left font-sans text-xs font-semibold text-slate-500">
          Member
        </th>
        <th className="px-3.5 py-3 text-left font-sans text-xs font-semibold text-slate-500">
          Role
        </th>
        <th className="px-3.5 py-3 text-left font-sans text-xs font-semibold text-slate-500">
          Department
        </th>
        <SortableHeaderCell
          label="Risk Score"
          isActive={sort.field === "riskScore"}
          direction={sort.direction}
          onClick={toggleRiskScoreSort}
        />
        <th className="px-3.5 py-3 text-right font-sans text-xs font-semibold text-slate-500">
          Actions
        </th>
      </tr>
    </thead>
  );
}
