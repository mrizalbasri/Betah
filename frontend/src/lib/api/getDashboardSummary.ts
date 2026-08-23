import { apiRequest } from "@/lib/api/client";
import type { DashboardSummary } from "@/lib/api/types";

/**
 * GET /api/dashboard/summary
 * Returns aggregate metrics for the overview page: total employees,
 * high-risk count, and average risk score per department (PRD §3.1).
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>("/api/dashboard/summary");
}
