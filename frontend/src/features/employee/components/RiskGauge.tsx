import { getRiskColorClasses } from "@/lib/utils/getRiskColorClasses";
import type { RiskLevel } from "@/lib/api/types";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Circular gauge visualizing a risk score (0-100) as a colored arc. */
export function RiskGauge({ score, level }: RiskGaugeProps) {
  const colors = getRiskColorClasses(level);
  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="relative h-[72px] w-[72px] flex-shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={RADIUS}
          fill="none"
          stroke="#EAE8E1"
          strokeWidth="7"
        />
        <circle
          cx="36"
          cy="36"
          r={RADIUS}
          fill="none"
          stroke={colors.fill}
          strokeWidth="7"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-base font-bold ${colors.text}`}>
          {score}%
        </span>
        <span className="text-[9px] text-ink-soft">RISK</span>
      </div>
    </div>
  );
}
