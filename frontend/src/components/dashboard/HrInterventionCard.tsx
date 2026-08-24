"use client";

import { Card, CardContent, Chip } from "@heroui/react";
import { CheckCircle2, Clock, DollarSign, HeartHandshake } from "lucide-react";

export function HrInterventionCard() {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <CardContent className="p-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500">
            Rekomendasi Program Retensi HR (ML Insight)
          </h3>
          <Chip color="accent" variant="soft" className="font-sans text-[11px] font-bold rounded-full">
            Top Priority
          </Chip>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 font-bold shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Evaluasi Kebijakan Jam Lembur (OverTime)</p>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                OverTime merupakan faktor pendorong SHAP #1. Pengurangan jam lembur rutin dapat menurunkan risiko attrition hingga 18.5%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-[#006FEE] font-bold shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Penyesuaian Gaji Sales & R&D</p>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Karyawan dengan MonthlyIncome di bawah rerata departemen memiliki probabilitas resign 2.4x lebih tinggi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 font-bold shrink-0">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Program Work-Life Balance & Stay Interview</p>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Jadwalkan sesi 1-on-1 dengan karyawan berisiko di atas 70% untuk menyusun rencana karir & fleksibilitas kerja.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
