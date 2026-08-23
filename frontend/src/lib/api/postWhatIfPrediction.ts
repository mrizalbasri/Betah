import { apiRequest } from "@/lib/api/client";
import type { WhatIfInput, WhatIfResult } from "@/lib/api/types";

/**
 * POST /api/predict
 * Re-runs the model with hypothetical attribute values for one employee
 * and returns the before/after risk comparison (PRD §3.4, §7).
 */
export async function postWhatIfPrediction(
  input: WhatIfInput
): Promise<WhatIfResult> {
  return apiRequest<WhatIfResult>("/api/predict", {
    method: "POST",
    body: input,
  });
}
