import { apiRequest } from "@/lib/api/client";
import type { GlobalFeatureImportance } from "@/lib/api/types";

/**
 * GET /api/model/global-importance
 * Returns the organization-wide SHAP summary — which factors most
 * often drive attrition risk across all employees (PRD §3.3).
 */
export async function getGlobalFeatureImportance(): Promise<
  GlobalFeatureImportance[]
> {
  return apiRequest<GlobalFeatureImportance[]>(
    "/api/model/global-importance"
  );
}
