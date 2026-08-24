import type { EmployeeSummary, EmployeeSort } from "@/lib/api/types";

/** Returns a new array of employees sorted by the given field and direction. */
export function sortEmployees(
  employees: EmployeeSummary[],
  sort: EmployeeSort
): EmployeeSummary[] {
  const { field, direction } = sort;
  const multiplier = direction === "asc" ? 1 : -1;

  return [...employees].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * multiplier;
    }

    return String(aValue).localeCompare(String(bValue)) * multiplier;
  });
}
