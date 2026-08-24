import { getRiskColorClasses } from "@/lib/utils/getRiskColorClasses";
import type { RiskLevel } from "@/lib/api/types";

interface RiskCellProps {
  score: number;
  level: RiskLevel;
}

/** Table cell rendering a small risk bar and percentage value, colored by risk level. */
export function RiskCell({ score, level }: RiskCellProps) {
  const colors = getRiskColorClasses(level);

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-[5px] w-14 overflow-hidden rounded-full bg-line-soft">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: colors.fill }}
        />
      </div>
      <span className={`w-9 font-mono text-[12.5px] font-semibold ${colors.text}`}>
        {score}%
      </span>
    </div>
  );
}
