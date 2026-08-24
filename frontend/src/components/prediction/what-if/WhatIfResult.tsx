"use client";

import { Card, CardContent, Chip } from "@heroui/react";
import type { WhatIfResult as WhatIfResultData } from "@/lib/api/types";

interface WhatIfResultProps {
  beforeScore: number;
  result: WhatIfResultData | null;
}

export function WhatIfResult({ beforeScore, result }: WhatIfResultProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      <CardContent className="p-6 text-center flex flex-col items-center justify-center">
        <div className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-slate-500">
          Hasil Simulasi Risiko
        </div>

        {!result ? (
          <div className="py-8 text-xs text-slate-500 font-medium">
            <p>Atur parameter variabel di sebelah kiri lalu klik <b>Jalankan Simulasi</b>.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-center gap-3">
              <span className="font-sans text-xl text-slate-400 font-bold line-through">
                {beforeScore}%
              </span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="font-sans text-3xl font-bold text-[#006FEE]">
                {result.afterRiskScore}%
              </span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.afterRiskScore >= 50
                    ? "bg-rose-500"
                    : result.afterRiskScore >= 30
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, result.afterRiskScore))}%` }}
              />
            </div>

            <Chip
              color={result.afterRiskScore >= 50 ? "danger" : "success"}
              variant="soft"
              className="font-sans font-bold text-xs rounded-full"
            >
              Prediksi Baru: {result.predictionAfter || (result.afterRiskScore >= 50 ? "High Risk" : "Low Risk")}
            </Chip>

            <p className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 border border-slate-200 text-left w-full mt-2 font-medium">
              {result.note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
