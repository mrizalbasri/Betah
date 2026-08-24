"use client";

import { Card, CardContent } from "@heroui/react";
import { getRiskLevel } from "@/lib/utils/getRiskLevel";
import type { DepartmentRiskAverage } from "@/lib/api/types";

interface DepartmentRiskCardProps {
  departments: DepartmentRiskAverage[];
}

export function DepartmentRiskCard({ departments }: DepartmentRiskCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-slate-500">
          Avg Risk per Departemen
        </div>
        <div className="flex flex-col gap-2.5">
          {departments.map((dept) => {
            const riskLevel = getRiskLevel(dept.averageRiskScore);
            const barColor =
              riskLevel === "high"
                ? "bg-rose-500"
                : riskLevel === "medium"
                ? "bg-amber-500"
                : "bg-emerald-500";

            return (
              <div key={dept.department} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-slate-600 text-xs font-semibold">
                    {dept.department}
                  </span>
                  <span className="font-sans font-bold text-slate-900 text-xs">
                    {dept.averageRiskScore}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(100, Math.max(0, dept.averageRiskScore))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
