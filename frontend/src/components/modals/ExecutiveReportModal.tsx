"use client";

import { useRef, useState, useEffect } from "react";
import {
  Printer,
  X,
  FileText,
  ShieldAlert,
  TrendingDown,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Calendar,
  Lock
} from "lucide-react";
import type { DashboardSummary, EmployeeSummary, DepartmentRiskAverage } from "@/lib/api/types";
import { getEmployees } from "@/lib/api/getEmployees";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DashboardSummary | null;
  employees?: EmployeeSummary[];
}

export function ExecutiveReportModal({
  isOpen,
  onClose,
  summary,
  employees: initialEmployees = []
}: ExecutiveReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [reportEmployees, setReportEmployees] = useState<EmployeeSummary[]>(initialEmployees);

  useEffect(() => {
    if (isOpen && initialEmployees.length === 0) {
      getEmployees({ sortBy: "risk_score_percentage", order: "desc", limit: 50 })
        .then((res) => setReportEmployees(res.employees))
        .catch(() => {});
    } else if (initialEmployees.length > 0) {
      setReportEmployees(initialEmployees);
    }
  }, [isOpen, initialEmployees]);

  if (!isOpen || !summary) return null;

  const highRiskEmployees = reportEmployees
    .filter((emp) => emp.riskLevel === "high")
    .sort((a, b) => (b.monthlyIncome ?? 0) - (a.monthlyIncome ?? 0))
    .slice(0, 5);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 print:shadow-none print:border-none print:rounded-none print:my-0 print:max-w-none">
        {/* Modal Action Bar (Sticky Top - Hidden during Print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-slate-900 flex items-center gap-2">
                Pratinjau Laporan Eksekutif HR
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  C-Level Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pratinjau dokumen laporan resmi sebelum diunduh sebagai PDF atau dicetak.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4 text-lime-400" />
              <span>Simpan sebagai PDF / Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 font-sans print:p-8">
          {/* Header Laporan Resmi */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>CONFIDENTIAL &bull; INTERNAL C-LEVEL REPORT</span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                LAPORAN EKSEKUTIF ANALISIS RISIKO TURNOVER KARYAWAN
              </h1>
              <p className="text-xs font-medium text-slate-600">
                Platform Betah AI Advisor &bull; Model Preskriptif XGBoost + SHAP Explainability v4
              </p>
            </div>

            <div className="text-right space-y-1 shrink-0 ml-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-slate-950 text-xs font-extrabold font-mono">
                <Sparkles className="h-3.5 w-3.5 text-lime-700" />
                <span>Betah AI</span>
              </div>
              <div className="text-xs font-mono text-slate-500 flex items-center gap-1 justify-end pt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{currentDate}</span>
              </div>
            </div>
          </div>

          {/* Key Executive KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Total Karyawan
              </div>
              <div className="font-mono text-2xl font-extrabold text-slate-900 mt-1">
                {summary.totalEmployees.toLocaleString("id-ID")}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Status Aktif</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider font-mono">
                Risiko Tinggi (High Risk)
              </div>
              <div className="font-mono text-2xl font-extrabold text-rose-700 mt-1">
                {summary.highRiskCount} Karyawan
              </div>
              <div className="text-[10px] text-rose-600 font-semibold mt-1">
                {summary.highRiskDeltaPct}% dari Total Staff
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                Rata-rata Risiko Organisasi
              </div>
              <div className="font-mono text-2xl font-extrabold text-amber-800 mt-1">
                {summary.averageRiskScore}%
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">Kategori Menengah</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider font-mono">
                Divisi Risiko Tertinggi
              </div>
              <div className="font-mono text-lg font-extrabold text-blue-900 mt-1 truncate">
                {summary.departmentAverages[0]?.department || "Sales"}
              </div>
              <div className="text-[10px] text-blue-700 font-semibold mt-1">
                Rata-rata {summary.departmentAverages[0]?.averageRiskScore || 45}% Risk
              </div>
            </div>
          </div>

          {/* High Risk Watchlist Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Daftar Prioritas Intervensi Karyawan (High Risk Watchlist)
              </h3>
              <span className="text-xs text-rose-600 font-bold font-mono">
                Membutuhkan Tindakan Segera
              </span>
            </div>

            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">ID &amp; Karyawan</th>
                  <th className="py-2.5 px-3">Departemen</th>
                  <th className="py-2.5 px-3">Jabatan</th>
                  <th className="py-2.5 px-3">Penghasilan / Bln</th>
                  <th className="py-2.5 px-3 text-center">Skor Risiko</th>
                  <th className="py-2.5 px-3">Faktor Pemicu Utama (SHAP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {highRiskEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                      #{emp.id} - {emp.name}
                    </td>
                    <td className="py-2.5 px-3 font-medium">{emp.department}</td>
                    <td className="py-2.5 px-3">{emp.jobRole}</td>
                    <td className="py-2.5 px-3 font-mono">
                      Rp {(emp.monthlyIncome ?? 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600 font-mono">
                      {emp.riskScore}%
                    </td>
                    <td className="py-2.5 px-3 text-[11px] font-medium text-slate-600">
                      {emp.topFactors?.[0] || "Kerja Lembur (OverTime)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Department Breakdown & Top Factors Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Department Breakdown */}
            <div className="space-y-3">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Distribusi Risiko per Departemen
              </h3>
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2 px-3">Departemen</th>
                    <th className="py-2 px-3 text-center">Total Staff</th>
                    <th className="py-2 px-3 text-center">High Risk</th>
                    <th className="py-2 px-3 text-right">Rata-rata Risiko</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {summary.departmentAverages.map((dept: DepartmentRiskAverage, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-semibold">{dept.department}</td>
                      <td className="py-2 px-3 text-center font-mono">{dept.totalEmployees}</td>
                      <td className="py-2 px-3 text-center font-mono text-rose-600 font-bold">
                        {dept.highRiskCount}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold">
                        {dept.averageRiskScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Company Attrition Factors */}
            <div className="space-y-3">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                5 Penggerak Utama Attrition (SHAP Global)
              </h3>
              <div className="space-y-2 pt-1">
                {(summary.topCompanyFactors || []).slice(0, 5).map((f: { factor: string; percentage?: number }, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800">{i + 1}. {f.factor}</span>
                    <span className="font-mono text-xs font-extrabold text-rose-600">
                      Impact +{(f.percentage ?? 15).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic HR Intervention Recommendations */}
          <div className="p-5 rounded-2xl bg-lime-50 border border-lime-300 space-y-3">
            <h3 className="font-sans text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-700" />
              Rekomendasi Preskriptif Intervensi HR (Prescriptive Action Plan)
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside font-medium leading-relaxed">
              <li>
                <strong>Penyesuaian Beban Kerja &amp; Lembur:</strong> Lakukan evaluasi mendalam pada divisi Sales &amp; R&amp;D yang memiliki frekuensi OverTime tinggi.
              </li>
              <li>
                <strong>Review Kompensasi Berkala:</strong> Berikan penyesuaian gaji komparatif bagi talent kunci berpenghasilan di bawah rata-rata industri.
              </li>
              <li>
                <strong>Sesi 1-on-1 Mentoring:</strong> Jadwalkan dialog karier dan perencanaan jalur promosi untuk karyawan dengan masa kerja &gt;3 tahun tanpa kenaikan peran.
              </li>
            </ul>
          </div>

          {/* Sign-off & Approval Section */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-12">
              <p className="font-bold text-slate-700">Dibuat Oleh (HR Analytics Lead):</p>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 border-b border-slate-400 inline-block px-8 pb-1">
                  M. Rizal Basri
                </div>
                <p className="text-[11px] text-slate-500 font-mono">Senior People Analytics &amp; AI Specialist</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="font-bold text-slate-700">Disetujui Oleh (Chief People Officer):</p>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 border-b border-slate-400 inline-block px-8 pb-1">
                  Sri Rahayu, M.Psi
                </div>
                <p className="text-[11px] text-slate-500 font-mono">HR Director &amp; People Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

