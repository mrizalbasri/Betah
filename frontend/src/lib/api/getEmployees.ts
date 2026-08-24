import { apiRequest } from "@/lib/api/client";
import type { EmployeeSummary } from "@/lib/api/types";

/**
 * GET /api/employees
 * Returns every employee with their latest risk score for the dashboard table.
 * (PRD §7)
 */
export async function getEmployees(): Promise<EmployeeSummary[]> {
  return apiRequest<EmployeeSummary[]>("/api/employees");
}
