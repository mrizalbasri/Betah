import { cn } from "@/lib/utils/cn";

interface SortableHeaderCellProps {
  label: string;
  isActive: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}

/** A table header cell that toggles sort direction on click and shows an arrow when active. */
export function SortableHeaderCell({
  label,
  isActive,
  direction,
  onClick,
}: SortableHeaderCellProps) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "cursor-pointer whitespace-nowrap px-5 py-2.5 text-left font-mono text-[10.5px] font-medium uppercase tracking-wide text-ink-soft",
        isActive && "text-ink"
      )}
    >
      {label}{" "}
      <span className={cn("ml-0.5 opacity-40", isActive && "text-accent opacity-100")}>
        {direction === "desc" ? "↓" : "↑"}
      </span>
    </th>
  );
}
