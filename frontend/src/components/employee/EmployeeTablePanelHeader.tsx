"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { SearchBox } from "@/components/employee/SearchBox";
import { useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import { filterEmployees } from "@/lib/utils/filterEmployees";
import type { EmployeeSummary, RiskLevel } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

interface EmployeeTablePanelHeaderProps {
  employees: EmployeeSummary[];
}

export function EmployeeTablePanelHeader({
  employees,
}: EmployeeTablePanelHeaderProps) {
  const { filters, setFilters, sort, setSort } = useEmployeeFilters();
  const [showFilters, setShowFilters] = useState(false);

  const filteredEmployees = filterEmployees(employees, filters);

  let displayTitle = "All Employees";
  if (filters.department && filters.riskLevel) {
    displayTitle = `${filters.department} (${filters.riskLevel.toUpperCase()} Risk)`;
  } else if (filters.department) {
    displayTitle = `${filters.department} Department`;
  } else if (filters.riskLevel) {
    displayTitle = `${filters.riskLevel.toUpperCase()} Risk Employees`;
  }

  function toggleRiskLevel(level: RiskLevel) {
    setFilters({
      ...filters,
      riskLevel: filters.riskLevel === level ? null : level,
    });
  }

  function toggleSortDirection() {
    setSort({
      field: "riskScore",
      direction: sort.direction === "desc" ? "asc" : "desc",
    });
  }

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900">
            {displayTitle}
          </h2>
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-100 px-2 font-sans text-xs font-bold text-slate-700 border border-slate-200">
            {filteredEmployees.length}
          </span>
        </div>

        <SearchBox
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={cn(
            "flex items-center gap-2 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs",
            showFilters || filters.riskLevel || filters.department
              ? "border-blue-200 bg-blue-50 text-[#006FEE]"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter {filters.riskLevel ? `(${filters.riskLevel.toUpperCase()})` : ""}</span>
        </button>

        <button
          onClick={toggleSortDirection}
          className="flex items-center gap-2 cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span>Sort: {sort.direction === "desc" ? "Risiko Tinggi → Rendah (↓)" : "Risiko Rendah → Tinggi (↑)"}</span>
        </button>

        <div className="text-xs font-medium text-slate-500 ml-auto">
          Menampilkan: {filters.riskLevel ? `Hanya ${filters.riskLevel.toUpperCase()} Risk` : "Semua Tier Risiko"}
        </div>
      </div>

      {/* Expandable Filter Toolbar */}
      {showFilters && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-slate-500">Tier Risiko:</span>
          {(["high", "medium", "low"] as RiskLevel[]).map((level) => {
            const isSelected = filters.riskLevel === level;
            return (
              <button
                key={level}
                onClick={() => toggleRiskLevel(level)}
                className={cn(
                  "flex items-center gap-1.5 cursor-pointer px-3 py-1 rounded-full text-xs font-bold transition-all border",
                  level === "high" && (isSelected ? "bg-rose-500 text-white border-rose-600" : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"),
                  level === "medium" && (isSelected ? "bg-amber-500 text-white border-amber-600" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"),
                  level === "low" && (isSelected ? "bg-emerald-500 text-white border-emerald-600" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100")
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                <span>{level.toUpperCase()} Risk</span>
              </button>
            );
          })}
          {filters.riskLevel && (
            <button
              onClick={() => setFilters({ ...filters, riskLevel: null })}
              className="text-xs text-slate-500 underline font-medium hover:text-slate-900 ml-2 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
