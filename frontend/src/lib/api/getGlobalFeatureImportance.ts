import { apiRequest } from "@/lib/api/client";
import type {
  GlobalFeatureImportance,
  BackendAnalyticsSummaryResponse,
} from "@/lib/api/types";

/**
 * GET /api/analytics/summary
 * Extracts top organization-wide attrition factors from backend analytics summary.
 */
export async function getGlobalFeatureImportance(): Promise<
  GlobalFeatureImportance[]
> {
  const res = await apiRequest<BackendAnalyticsSummaryResponse>("/api/analytics/summary");

  const topFactors = res.top_company_factors || [];

  return topFactors.map((f) => ({
    label: f.factor,
    importance: Math.round((f.percentage / 100) * 100) / 100,
    count: f.count,
    percentage: f.percentage,
  }));
}
