"use client";

import { Card, CardContent } from "@heroui/react";

interface RiskDistributionCardProps {
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  totalCount?: number;
}

export function RiskDistributionCard({
  highCount = 285,
  mediumCount = 300,
  lowCount = 885,
  totalCount = 1470,
}: RiskDistributionCardProps) {
  const highPct = Math.round((highCount / totalCount) * 1000) / 10;
  const medPct = Math.round((mediumCount / totalCount) * 1000) / 10;
  const lowPct = Math.round((lowCount / totalCount) * 1000) / 10;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <CardContent className="p-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500">
            Distribusi Tier Risiko Attrition
          </h3>
          <span className="font-mono text-xs font-bold text-slate-700">
            {totalCount.toLocaleString("id-ID")} Karyawan
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${highPct}%` }}
            title={`High Risk: ${highCount} (${highPct}%)`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${medPct}%` }}
            title={`Medium Risk: ${mediumCount} (${medPct}%)`}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${lowPct}%` }}
            title={`Low Risk: ${lowCount} (${lowPct}%)`}
          />
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="flex flex-col rounded-xl bg-rose-50 p-2.5 border border-rose-200">
            <span className="text-[11px] font-bold text-rose-700">High Risk</span>
            <span className="text-sm font-bold text-rose-900 mt-0.5">{highCount} ({highPct}%)</span>
          </div>

          <div className="flex flex-col rounded-xl bg-amber-50 p-2.5 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700">Medium Risk</span>
            <span className="text-sm font-bold text-amber-900 mt-0.5">{mediumCount} ({medPct}%)</span>
          </div>

          <div className="flex flex-col rounded-xl bg-emerald-50 p-2.5 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700">Low Risk</span>
            <span className="text-sm font-bold text-emerald-900 mt-0.5">{lowCount} ({lowPct}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
