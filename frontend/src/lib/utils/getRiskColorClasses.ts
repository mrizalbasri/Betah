import type { RiskLevel } from "@/lib/api/types";

interface RiskColorClasses {
  text: string;
  bg: string;
  fill: string; // for progress bars / gauges (raw hex, used in inline style)
}

const RISK_COLOR_MAP: Record<RiskLevel, RiskColorClasses> = {
  high: {
    text: "text-signal-high",
    bg: "bg-signal-high-bg",
    fill: "#B3432D",
  },
  medium: {
    text: "text-signal-med",
    bg: "bg-signal-med-bg",
    fill: "#B08214",
  },
  low: {
    text: "text-signal-low",
    bg: "bg-signal-low-bg",
    fill: "#3A6B52",
  },
};

/** Returns the Tailwind classes and fill color for a given risk level. */
export function getRiskColorClasses(level: RiskLevel): RiskColorClasses {
  return RISK_COLOR_MAP[level];
}
