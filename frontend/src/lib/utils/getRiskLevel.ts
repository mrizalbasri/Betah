import type { RiskLevel } from "@/lib/api/types";

/**
 * Converts a numeric risk score (0–100) into a discrete risk level.
 * Thresholds: >=70 high, >=40 medium, otherwise low.
 */
export function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 70) return "high";
  if (riskScore >= 40) return "medium";
  return "low";
}
