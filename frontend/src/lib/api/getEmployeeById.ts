import { apiRequest } from "@/lib/api/client";
import type { EmployeeDetail } from "@/lib/api/types";

/**
 * GET /api/employees/{id}
 * Returns one employee's full risk detail, including per-individual
 * SHAP contributing factors. (PRD §7)
 */
export async function getEmployeeById(id: string): Promise<EmployeeDetail> {
  return apiRequest<EmployeeDetail>(`/api/employees/${id}`);
}
