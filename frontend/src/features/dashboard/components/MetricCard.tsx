import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  flagged?: boolean;
}

/** A single summary metric card (label + large value) for the dashboard header row. */
export function MetricCard({ label, value, flagged = false }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-panel p-4",
        flagged && "border-[#D9BDB1] bg-gradient-to-b from-[#FDF6F3] to-panel"
      )}
    >
      <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-wide text-ink-soft">
        {label}
      </div>
      <div
        className={cn(
          "flex items-baseline gap-1.5 font-serif text-[30px] font-medium leading-none",
          flagged && "text-signal-high"
        )}
      >
        {value}
      </div>
    </div>
  );
}
