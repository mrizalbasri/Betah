interface TableFooterProps {
  visibleCount: number;
  totalCount: number;
}

/**
 * Footer showing how many employees are visible out of the total.
 * Full pagination controls are deferred until the backend exposes
 * page/limit params on GET /api/employees — this keeps the UI honest
 * about what it can currently do.
 */
export function TableFooter({ visibleCount, totalCount }: TableFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-line-soft px-5 py-3 text-xs text-ink-soft">
      <span>
        Menampilkan {visibleCount} dari {totalCount} karyawan
      </span>
    </div>
  );
}
