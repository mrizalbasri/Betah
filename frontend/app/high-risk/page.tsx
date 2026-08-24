"use client";

import { useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { EmployeeFilterProvider, useEmployeeFilters } from "@/lib/context/EmployeeFilterContext";
import { SelectedEmployeeProvider } from "@/lib/context/SelectedEmployeeContext";
import { EmployeeTablePanel } from "@/components/employee/EmployeeTablePanel";
import { EmployeeDetailPanel } from "@/components/employee/EmployeeDetailPanel";
import { AlertCircle, ShieldAlert, UserCheck } from "lucide-react";
import { Card, CardContent } from "@heroui/react";

export function HighRiskContent() {
  const { filters, setFilters } = useEmployeeFilters();

  useEffect(() => {
    setFilters({ ...filters, riskLevel: "high" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="High Risk Tracker" />
      <div className="p-8 flex flex-col gap-6">
        {/* Urgency Alert Banner */}
        <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-sans text-sm font-bold text-rose-900">
              Intervensi HR Diperlukan (285 Karyawan Berisiko Tinggi)
            </h3>
            <p className="text-xs text-rose-700 font-medium mt-0.5">
              Model XGBoost mendeteksi 19.39% karyawan aktif memiliki probabilitas resign di atas 50%. Direkomendasikan melakukan review opsi retensi dalam 2 minggu.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Target Intervensi</p>
                <p className="text-3xl font-bold text-rose-600 tracking-tight mt-1">285</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">19.39% dari Total Karyawan</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Departemen Paling Kritis</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight mt-1">Sales (24.89%)</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Diikuti HR (23.81%) & R&D (16.55%)</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                <AlertCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Penyebab Utama Resign</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight mt-1">Kerja Lembur (OverTime)</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Faktor pendorong SHAP #1</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#006FEE] font-bold">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-[1fr_400px] gap-6 items-start">
          <EmployeeTablePanel />
          <EmployeeDetailPanel />
        </div>
      </div>
    </div>
  );
}

export default function HighRiskPage() {
  return (
    <EmployeeFilterProvider>
      <SelectedEmployeeProvider>
        <HighRiskContent />
      </SelectedEmployeeProvider>
    </EmployeeFilterProvider>
  );
}
