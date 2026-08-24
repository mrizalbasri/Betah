interface ImportanceBarRowProps {
  label: string;
  importance: number; // 0–1
}

/** A single labeled horizontal bar showing one factor's relative SHAP importance (0-1). */
export function ImportanceBarRow({ label, importance }: ImportanceBarRowProps) {
  return (
    <div className="mb-3.5 flex items-center gap-3.5 last:mb-0">
      <div className="w-[170px] flex-shrink-0 text-[13px] text-ink">
        {label}
      </div>
      <div className="h-[18px] flex-1 overflow-hidden rounded bg-line-soft">
        <div
          className="h-full rounded bg-accent"
          style={{ width: `${importance * 100}%` }}
        />
      </div>
      <div className="w-11 flex-shrink-0 text-right font-mono text-xs font-semibold text-ink-soft">
        {importance.toFixed(2)}
      </div>
    </div>
  );
}
