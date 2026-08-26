import { apiRequest } from "@/lib/api/client";
import type {
  GlobalFeatureImportance,
  BackendAnalyticsSummaryResponse,
} from "@/lib/api/types";

/**
 * GET /api/analytics/summary
 * Extracts top organization-wide attrition factors from backend analytics summary.
 */
import { getDashboardSummary } from "@/lib/api/getDashboardSummary";

/**
 * GET /api/analytics/summary
 * Extracts top organization-wide attrition factors from backend analytics summary.
 */
export async function getGlobalFeatureImportance(): Promise<
  GlobalFeatureImportance[]
> {
  const summary = await getDashboardSummary();
  const topFactors = summary.topCompanyFactors || [];

  return topFactors.map((f) => ({
    label: f.factor,
    importance: Math.round(((f.percentage || 0) / 100) * 100) / 100,
    count: f.count || 0,
    percentage: f.percentage || 0,
  }));
}
