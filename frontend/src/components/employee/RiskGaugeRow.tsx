import { RiskGauge } from "@/components/employee/RiskGauge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { RiskLevel } from "@/lib/api/types";

interface RiskGaugeRowProps {
  score: number;
  level: RiskLevel;
  description: string;
}

export function RiskGaugeRow({ score, level, description }: RiskGaugeRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-4">
      <RiskGauge score={score} level={level} />
      <div>
        <RiskBadge level={level} />
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
