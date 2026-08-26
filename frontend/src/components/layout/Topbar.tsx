"use client";

import type { ReactNode } from "react";
import { Download, Upload, FileText } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: ReactNode;
  onExportData?: () => void;
  onImportData?: () => void;
  onExportReportPdf?: () => void;
}

export function Topbar({
  title,
  subtitle,
  onExportData,
  onImportData,
  onExportReportPdf
}: TopbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-[#F8FAFC] px-8 py-5">
      <div>
        <h1 className="font-sans text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onExportReportPdf && (
          <button
            onClick={onExportReportPdf}
            className="flex items-center gap-2 cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Export Laporan PDF</span>
          </button>
        )}

        {onImportData && (
          <button
            onClick={onImportData}
            className="flex items-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
          >
            <Upload className="h-3.5 w-3.5 text-lime-400" />
            <span>Import Data CSV</span>
          </button>
        )}


        {onExportData && (
          <button
            onClick={onExportData}
            className="flex items-center gap-2 cursor-pointer rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-lime-500/20 hover:bg-lime-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Data CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
