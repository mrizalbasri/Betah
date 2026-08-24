"use client";

import { Chip } from "@heroui/react";
import type { RiskLevel } from "@/lib/api/types";

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; color: "danger" | "warning" | "success" }
> = {
  high: { label: "HIGH RISK", color: "danger" },
  medium: { label: "MEDIUM RISK", color: "warning" },
  low: { label: "LOW RISK", color: "success" },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = RISK_CONFIG[level] || RISK_CONFIG.low;

  return (
    <Chip
      color={config.color}
      variant="soft"
      className="font-mono text-[10px] font-semibold tracking-wide"
    >
      {config.label}
    </Chip>
  );
}
