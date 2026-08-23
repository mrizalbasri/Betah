interface UpdatedPillProps {
  label: string;
}

/** Displays a small status pill indicating when the underlying data was last refreshed. */
export function UpdatedPill({ label }: UpdatedPillProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[11px] text-ink-soft">
      <span className="h-1.5 w-1.5 rounded-full bg-signal-low" />
      {label}
    </div>
  );
}
