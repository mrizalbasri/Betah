"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  visibleCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function TableFooter({
  currentPage,
  totalPages,
  visibleCount,
  totalCount,
  onPageChange,
}: TableFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3.5 text-xs text-slate-500 font-medium">
      <span>
        Menampilkan <strong className="text-slate-900">{visibleCount}</strong> dari <strong className="text-slate-900">{totalCount}</strong> karyawan
      </span>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500 mr-2 font-mono">
          Halaman {currentPage} dari {totalPages}
        </span>

        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
