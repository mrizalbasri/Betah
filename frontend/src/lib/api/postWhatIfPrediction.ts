import { apiRequest } from "@/lib/api/client";
import type { WhatIfInput, WhatIfResult } from "@/lib/api/types";

/**
 * POST /api/predict/what-if
 * Re-runs the model with hypothetical attribute values for one employee
 * and returns the before/after risk comparison (PRD §3.4, §7).
 *
 * Distinct from the internal `/api/predict` endpoint (initial/batch
 * scoring), which the frontend never calls directly — see API contract.
 */
export async function postWhatIfPrediction(
  input: WhatIfInput
): Promise<WhatIfResult> {
  return apiRequest<WhatIfResult>("/api/predict/what-if", {
    method: "POST",
    body: input,
  });
}
