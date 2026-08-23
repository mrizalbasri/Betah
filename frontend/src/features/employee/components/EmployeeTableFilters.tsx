"use client";

import { SearchBox } from "@/features/employee/components/SearchBox";
import { SelectFilterChip } from "@/features/employee/components/SelectFilterChip";
import { FilterChip } from "@/features/employee/components/FilterChip";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import type { EmployeeSummary, RiskLevel } from "@/lib/api/types";

const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  high: "Risk: High",
  medium: "Risk: Medium",
  low: "Risk: Low",
};

interface EmployeeTableFiltersProps {
  employees: EmployeeSummary[];
}

/** Filter controls above the employee table: search, department, job role, and risk level. */
export function EmployeeTableFilters({ employees }: EmployeeTableFiltersProps) {
  const { filters, setFilters } = useEmployeeFilters();

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const jobRoles = Array.from(new Set(employees.map((e) => e.jobRole)));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchBox
        value={filters.search}
        onChange={(search) => setFilters({ ...filters, search })}
      />

      {(["high", "medium", "low"] as RiskLevel[]).map((level) => (
        <FilterChip
          key={level}
          label={RISK_LEVEL_LABEL[level]}
          selected={filters.riskLevel === level}
          onClick={() =>
            setFilters({
              ...filters,
              riskLevel: filters.riskLevel === level ? null : level,
            })
          }
        />
      ))}

      <SelectFilterChip
        label="Departemen ▾"
        value={filters.department}
        options={departments}
        onChange={(department) => setFilters({ ...filters, department })}
      />

      <SelectFilterChip
        label="Job Role ▾"
        value={filters.jobRole}
        options={jobRoles}
        onChange={(jobRole) => setFilters({ ...filters, jobRole })}
      />
    </div>
  );
}
