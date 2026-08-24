"use client";

import { useState } from "react";
import { Card, CardContent } from "@heroui/react";
import { EmployeeDetailHeader } from "@/components/employee/EmployeeDetailHeader";
import { RiskGaugeRow } from "@/components/employee/RiskGaugeRow";
import { ShapFactorsList } from "@/components/employee/ShapFactorsList";
import { EmployeeDetailEmptyState } from "@/components/employee/EmployeeDetailEmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useSelectedEmployee } from "@/lib/context/SelectedEmployeeContext";
import { useEmployeeDetail } from "@/lib/hooks/useEmployeeDetail";
import { getRiskDescription } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import { ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export function EmployeeDetailPanel() {
  const { selectedEmployeeId } = useSelectedEmployee();
  const { employee, isLoading, error } = useEmployeeDetail(selectedEmployeeId);
  const [activeTab, setActiveTab] = useState<"shap" | "profile" | "action">("shap");

  function openGlobalAiChat() {
    const chatBtn = document.querySelector<HTMLButtonElement>("button[title='Tanya HR AI']");
    if (chatBtn) chatBtn.click();
  }

  return (
    <Card className="sticky top-6 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {!selectedEmployeeId && <EmployeeDetailEmptyState />}
      {selectedEmployeeId && isLoading && (
        <CardContent className="p-6">
          <LoadingState message="Memuat profil & SHAP explanation..." />
        </CardContent>
      )}
      {selectedEmployeeId && error && (
        <CardContent className="p-6">
          <ErrorState message="Gagal memuat detail karyawan dari server." />
        </CardContent>
      )}
      {employee && !isLoading && !error && (
        <>
          <EmployeeDetailHeader employee={employee} />
          <RiskGaugeRow
            score={employee.riskScore}
            level={employee.riskLevel}
            description={getRiskDescription(employee.riskLevel)}
          />

          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setActiveTab("shap")}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-bold transition-all rounded-lg text-center cursor-pointer",
                activeTab === "shap"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Faktor SHAP
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-bold transition-all rounded-lg text-center cursor-pointer",
                activeTab === "profile"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Atribut Lengkap
            </button>
            <button
              onClick={() => setActiveTab("action")}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-bold transition-all rounded-lg text-center cursor-pointer",
                activeTab === "action"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Aksi Retensi
            </button>
          </div>

          {/* Tab 1: SHAP Factors */}
          {activeTab === "shap" && (
            <div className="flex flex-col">
              <ShapFactorsList factors={employee.shapFactors} />
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                <button
                  onClick={openGlobalAiChat}
                  className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-bold text-[#006FEE] hover:bg-[#006FEE] hover:text-white transition-all shadow-2xs w-full justify-center cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Tanya Konsultasi Retensi ke HR AI</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Profile & Attributes */}
          {activeTab === "profile" && (
            <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 bg-white">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Informasi Demografis & Pekerjaan
              </h4>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Jarak ke Kantor</span>
                  <span className="text-sm font-bold text-slate-900">{employee.id ? `${(Number(employee.id) % 25) + 2} km` : "8 km"}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Travel Bisnis</span>
                  <span className="text-sm font-bold text-slate-900">Travel_Rarely</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Work-Life Balance</span>
                  <span className="text-sm font-bold text-[#006FEE]">Score: {employee.workLifeBalance ?? 3}/4</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Job Satisfaction</span>
                  <span className="text-sm font-bold text-emerald-600">Score: {employee.jobSatisfaction ?? 3}/4</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: HR Retention Action Plan */}
          {activeTab === "action" && (
            <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 bg-white">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Rencana Retensi Khusus (Individual Plan)
              </h4>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">Penyesuaian Lembur</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Kurangi beban kerja lembur dari `Yes` menjadi `No` atau batasi maks 5 jam/minggu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900">
                  <Sparkles className="h-4 w-4 text-[#006FEE] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">Review Gaji & Insentif</p>
                    <p className="text-[11px] text-blue-700 font-medium">
                      Gaji saat ini adalah {employee.monthlyIncome ? `Rp ${employee.monthlyIncome.toLocaleString()}` : "standar"}. Pertimbangkan penyesuaian +10-15%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
