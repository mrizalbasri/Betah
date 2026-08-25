"use client";

import { useState } from "react";
import { Card, CardContent, Button, Chip } from "@heroui/react";
import { formatCurrency } from "@/lib/utils";
import type { WhatIfInput } from "@/lib/api/types";
import { Zap } from "lucide-react";

interface WhatIfFormProps {
  employeeId: string;
  employeeName: string;
  onSubmit: (input: WhatIfInput) => void;
  isSubmitting: boolean;
}

const JOB_SATISFACTION_LABEL: Record<number, string> = {
  1: "1 - Low",
  2: "2 - Medium",
  3: "3 - High",
  4: "4 - Very High",
};

export function WhatIfForm({
  employeeId,
  employeeName,
  onSubmit,
  isSubmitting,
}: WhatIfFormProps) {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6000);
  const [overTime, setOverTime] = useState<"Yes" | "No">("No");
  const [yearsAtCompany, setYearsAtCompany] = useState<number>(5);
  const [jobSatisfaction, setJobSatisfaction] = useState<number>(3);

  function handleSubmit() {
    onSubmit({
      employeeId,
      monthlyIncome,
      overTime,
      yearsAtCompany,
      jobSatisfaction,
    });
  }

  function applyPreset(type: "salary" | "noOvertime" | "optimal") {
    if (type === "salary") {
      setMonthlyIncome((prev) => Math.round(prev * 1.15));
    } else if (type === "noOvertime") {
      setOverTime("No");
    } else if (type === "optimal") {
      setMonthlyIncome((prev) => Math.round(prev * 1.2));
      setOverTime("No");
      setJobSatisfaction(4);
    }
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      <CardContent className="p-6 flex flex-col gap-6">
        <div>
          <h3 className="font-sans text-lg font-bold text-slate-900">
            Parameter Simulasi — {employeeName}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Ubah variabel di bawah ini atau gunakan 1-Click Preset untuk mensimulasikan dampak ke skor risiko.
          </p>
        </div>

        {/* 1-Click Quick Presets */}
        <div className="flex flex-col gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50">
          <span className="text-[11px] font-bold text-[#006FEE] flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> 1-Click Quick Presets
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <button
              onClick={() => applyPreset("salary")}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-[#006FEE] transition-colors"
            >
              +15% Salary Raise
            </button>
            <button
              onClick={() => applyPreset("noOvertime")}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-[#006FEE] transition-colors"
            >
              Hapus OverTime
            </button>
            <button
              onClick={() => applyPreset("optimal")}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#006FEE] text-white shadow-2xs hover:bg-blue-600 transition-colors"
            >
              Paket Retensi Optimal
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Gaji Bulanan (Monthly Income)
              </label>
              <span className="text-xs font-bold text-[#006FEE]">
                {formatCurrency(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full accent-[#006FEE] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Status Kerja Lembur (OverTime)</span>
              <span className="text-[11px] font-medium text-slate-500">Apakah karyawan sering bekerja di luar jam normal</span>
            </div>
            <button
              type="button"
              onClick={() => setOverTime((prev) => (prev === "Yes" ? "No" : "Yes"))}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                overTime === "Yes"
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-slate-200 text-slate-700 border border-slate-300"
              }`}
            >
              {overTime === "Yes" ? "Ya (OverTime)" : "Tidak (No)"}
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Masa Kerja di Perusahaan (Years At Company)
              </label>
              <span className="text-xs font-bold text-[#006FEE]">
                {yearsAtCompany} Tahun
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={yearsAtCompany}
              onChange={(e) => setYearsAtCompany(Number(e.target.value))}
              className="w-full accent-[#006FEE] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Tingkat Kepuasan Kerja (Job Satisfaction)
            </label>
            <select
              value={jobSatisfaction}
              onChange={(e) => setJobSatisfaction(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#006FEE]"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {JOB_SATISFACTION_LABEL[num]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full font-bold font-sans mt-2 bg-lime-400 text-slate-950 hover:bg-lime-300 py-3.5 rounded-full text-xs transition-colors shadow-md shadow-lime-500/20 cursor-pointer"
        >
          {isSubmitting ? "Menghitung Prediksi Ulang..." : "Jalankan Simulasi Prediksi Model"}
        </Button>
      </CardContent>
    </Card>
  );
}
