import { getRiskColorClasses } from "@/lib/utils/getRiskColorClasses";
import type { RiskLevel } from "@/lib/api/types";

const RISK_LABEL: Record<RiskLevel, string> = {
  high: "HIGH RISK",
  medium: "MEDIUM RISK",
  low: "LOW RISK",
};

/** Renders a colored pill labeling an employee's risk level. */
export function RiskBadge({ level }: { level: RiskLevel }) {
  const colors = getRiskColorClasses(level);

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-wide ${colors.text} ${colors.bg}`}
    >
      {RISK_LABEL[level]}
    </span>
  );
}
