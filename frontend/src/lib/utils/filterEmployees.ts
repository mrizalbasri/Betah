import type { EmployeeSummary, EmployeeFilters } from "@/lib/api/types";

/** Returns employees matching the current search text, department, job role, and risk level filters. */
export function filterEmployees(
  employees: EmployeeSummary[],
  filters: EmployeeFilters
): EmployeeSummary[] {
  const searchTerm = filters.search.trim().toLowerCase();

  return employees.filter((employee) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      employee.name.toLowerCase().includes(searchTerm);

    const matchesDepartment =
      !filters.department || employee.department === filters.department;

    const matchesJobRole =
      !filters.jobRole || employee.jobRole === filters.jobRole;

    const matchesRiskLevel =
      !filters.riskLevel || employee.riskLevel === filters.riskLevel;

    return (
      matchesSearch && matchesDepartment && matchesJobRole && matchesRiskLevel
    );
  });
}
