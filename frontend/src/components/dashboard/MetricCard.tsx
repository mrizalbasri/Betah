"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@heroui/react";
import { cn } from "@/lib/utils/cn";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  flagged?: boolean;
  subtext?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export function MetricCard({
  label,
  value,
  flagged = false,
  subtext,
  trend,
  trendDirection = "up",
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-md",
        flagged && "border-rose-200 bg-rose-50/30"
      )}
    >
      <CardContent className="p-5">
        <div className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>{label}</span>
          {flagged && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div
            className={cn(
              "font-sans text-3xl font-bold tracking-tight text-slate-900",
              flagged && "text-rose-600"
            )}
          >
            {value}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border",
                trendDirection === "up" && flagged
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              )}
            >
              {trendDirection === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {subtext && (
          <p className="mt-2 font-sans text-xs text-slate-500 font-normal">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
