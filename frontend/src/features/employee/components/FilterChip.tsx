import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  onClear?: () => void;
}

/** A single filter toggle chip. Shows a clear icon when a value is actively selected. */
export function FilterChip({ label, selected, onClick, onClear }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11.5px]",
        selected
          ? "border-accent bg-accent text-white"
          : "border-line bg-paper text-ink-soft"
      )}
    >
      {label}
      {selected && onClear && (
        <X
          className="h-2.5 w-2.5"
          onClick={(event) => {
            event.stopPropagation();
            onClear();
          }}
        />
      )}
    </button>
  );
}
