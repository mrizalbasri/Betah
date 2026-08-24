"use client";

import { Card, CardContent, Chip } from "@heroui/react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useGlobalFeatureImportance } from "@/lib/hooks/useGlobalFeatureImportance";
import { Lightbulb, Target } from "lucide-react";

export function GlobalImportancePanel() {
  const { factors, isLoading, error } = useGlobalFeatureImportance();

  if (isLoading) {
    return (
      <Card className="max-w-[800px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <LoadingState message="Memuat feature importance..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-[800px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <ErrorState message="Gagal memuat feature importance dari server." />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[850px]">
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900">
                Top Organization-Wide Attrition Drivers
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Analisis agregat SHAP di seluruh karyawan aktif yang mengidentifikasi penyebab utama risiko resign.
              </p>
            </div>
            <Chip color="accent" variant="soft" className="font-sans text-xs font-bold rounded-full">
              SHAP Global
            </Chip>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {factors.map((factor, idx) => {
              const pct = Math.round((factor.percentage ?? factor.importance * 100) * 10) / 10;
              return (
                <div key={factor.label} className="flex flex-col gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-sans text-xs font-bold border border-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {factor.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {factor.count !== undefined && (
                        <span className="text-xs font-medium text-slate-500">
                          {factor.count} Karyawan
                        </span>
                      )}
                      <Chip color="danger" variant="soft" className="font-sans font-bold text-xs rounded-full">
                        {pct}%
                      </Chip>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Executive Insights & Actionable Takeaways */}
      <Card className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-xs">
        <CardContent className="p-0 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#006FEE]">
            <Lightbulb className="h-5 w-5 font-bold" />
            <h3 className="font-sans text-sm font-bold text-slate-900">
              Executive HR Insights & Strategic Action Plan
            </h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Berdasarkan kontribusi SHAP agregat di atas, <b>Kerja Lembur (OverTime)</b> dan <b>Gaji Bulanan (Monthly Income)</b> adalah 2 pendorong terbesar yang menyumbang lebih dari 65% risiko kepindahan karyawan.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs">
              <span className="text-[11px] font-bold text-[#006FEE] flex items-center gap-1 mb-1">
                <Target className="h-3.5 w-3.5" /> Inisiatif Jangka Pendek
              </span>
              <p className="text-xs text-slate-600 font-medium">
                Standardisasi batas jam lembur maksimal 5 jam/minggu untuk karyawan Sales dan R&D.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs">
              <span className="text-[11px] font-bold text-[#006FEE] flex items-center gap-1 mb-1">
                <Target className="h-3.5 w-3.5" /> Inisiatif Jangka Panjang
              </span>
              <p className="text-xs text-slate-600 font-medium">
                Pembaruan struktur skala gaji acuan industri untuk posisi kunci dengan tenure {">"} 3 tahun.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
