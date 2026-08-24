"use client";

import { SortableHeaderCell } from "@/features/employee/components/SortableHeaderCell";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";

/** Table <thead> for the employee table. Only Risk Score is sortable, per the mockup. */
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
      <tr className="border-b border-line bg-[#FBFAF7]">
        <th className="px-5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft">
          Karyawan
        </th>
        <th className="px-5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft">
          Departemen
        </th>
        <th className="px-5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft">
          Job Role
        </th>
        <SortableHeaderCell
          label="Risk Score"
          isActive={sort.field === "riskScore"}
          direction={sort.direction}
          onClick={toggleRiskScoreSort}
        />
        <th className="px-5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft">
          Top Factors
        </th>
      </tr>
    </thead>
  );
}
