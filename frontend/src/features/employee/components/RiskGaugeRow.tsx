import { RiskGauge } from "@/features/employee/components/RiskGauge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { RiskLevel } from "@/lib/api/types";

interface RiskGaugeRowProps {
  score: number;
  level: RiskLevel;
  description: string;
}

/** Combines the gauge, risk badge, and a short contextual description in the detail panel. */
export function RiskGaugeRow({ score, level, description }: RiskGaugeRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-line-soft px-5 py-4">
      <RiskGauge score={score} level={level} />
      <div>
        <RiskBadge level={level} />
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </div>
  );
}
