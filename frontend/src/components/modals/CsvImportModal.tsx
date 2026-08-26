"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye
} from "lucide-react";
import { uploadCsvEmployees, getCsvTemplateUrl, CsvUploadSummary } from "@/lib/api";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CsvImportModal({ isOpen, onClose, onSuccess }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<CsvUploadSummary | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseCsvPreview = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== "");
        if (lines.length > 0) {
          const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
          setPreviewHeaders(headers);

          const sampleRows: Record<string, string>[] = [];
          for (let i = 1; i < Math.min(6, lines.length); i++) {
            const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
            const rowObj: Record<string, string> = {};
            headers.forEach((h, idx) => {
              rowObj[h] = values[idx] ?? "";
            });
            sampleRows.push(rowObj);
          }
          setPreviewRows(sampleRows);
        }
      } catch {
        setError("Gagal membaca pratinjau file CSV. Pastikan format CSV valid.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Format file tidak didukung. Harap pilih file berformat .csv");
      return;
    }
    setError(null);
    setResultSummary(null);
    setFile(selectedFile);
    parseCsvPreview(selectedFile);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadCsvEmployees(file);
      setResultSummary(res.summary);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah dan menganalisis CSV.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreviewHeaders([]);
    setPreviewRows([]);
    setError(null);
    setResultSummary(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8">
        {/* Header Modal (Sticky Top) */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center font-bold shadow-xs border border-lime-200">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                Import Data CSV Karyawan
                <span className="text-[10px] font-mono uppercase bg-lime-300 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  XGBoost AI
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Unggah file CSV data HR perusahaan Anda untuk langsung mendapatkan analisis risiko turnover.
              </p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Success Summary */}
          {resultSummary ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-lime-50/50 to-white border border-emerald-200 space-y-5 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans text-xl font-bold text-slate-900">Analisis Data CSV Selesai!</h4>
                <p className="text-xs text-slate-600">
                  Model AI XGBoost berhasil memprediksi risiko turnover untuk seluruh karyawan.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="font-mono text-xl font-bold text-slate-900">{resultSummary.total_employees}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Total Karyawan</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="font-mono text-xl font-bold text-rose-600">{resultSummary.high_risk_count}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Risiko Tinggi</div>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="font-mono text-xl font-bold text-lime-600">{resultSummary.avg_risk_percentage}%</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Rata-rata Risiko</div>
                </div>
              </div>

              <button
                onClick={() => {
                  resetModal();
                  window.location.reload();
                }}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Hasil di Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {/* File Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                    : file
                    ? "border-lime-400 bg-lime-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-xs">
                    <UploadCloud className="h-6 w-6 text-slate-700" />
                  </div>

                  {file ? (
                    <div className="space-y-1">
                      <div className="font-sans text-sm font-bold text-slate-900 flex items-center gap-2 justify-center">
                        <FileSpreadsheet className="h-4 w-4 text-lime-600" />
                        <span>{file.name}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <p className="text-xs text-lime-700 font-semibold">
                        File siap diproses oleh model XGBoost.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-sans text-sm font-bold text-slate-800">
                        Tarik &amp; lepas file CSV di sini, atau <span className="text-blue-600 underline">pilih file</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Format didukung: File standar <code>.csv</code> (IBM HR Attrition schema)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Template Download Option */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-lime-600 shrink-0" />
                  <span className="text-xs text-slate-600 font-medium">
                    Belum punya format CSV yang sesuai? Unduh contoh templat resmi Betah.
                  </span>
                </div>
                <a
                  href={getCsvTemplateUrl()}
                  download="betah_employee_sample_template.csv"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:border-slate-400 shadow-2xs transition-colors shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Templat</span>
                </a>
              </div>

              {/* Live Preview Table */}
              {previewRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-blue-600" />
                      Pratinjau Data CSV ({previewRows.length} Baris Pertama)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Terdeteksi {previewHeaders.length} Kolom
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs max-h-48">
                    <table className="w-full text-left text-[11px] font-sans">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                          {previewHeaders.slice(0, 7).map((header, i) => (
                            <th key={i} className="px-3 py-2 border-b border-slate-200 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {previewRows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50">
                            {previewHeaders.slice(0, 7).map((header, colIdx) => (
                              <td key={colIdx} className="px-3 py-2 whitespace-nowrap font-mono">
                                {row[header] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!resultSummary && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={resetModal}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={!file || isUploading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-lime-400" />
                  <span>Memproses Analisis AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-lime-400" />
                  <span>Proses &amp; Analisis Data CSV</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
