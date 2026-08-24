import type { RiskLevel } from "@/lib/api/types";

const RISK_DESCRIPTION: Record<RiskLevel, string> = {
  high: "Termasuk kelompok risiko tinggi. Direkomendasikan untuk intervensi dalam 2 minggu.",
  medium: "Risiko sedang. Pantau perkembangan dan pertimbangkan langkah retensi ringan.",
  low: "Risiko rendah. Tidak memerlukan tindakan segera.",
};

/** Returns a short contextual sentence describing what a risk level implies for HR action. */
export function getRiskDescription(level: RiskLevel): string {
  return RISK_DESCRIPTION[level];
}
