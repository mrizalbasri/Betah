"use client";

import { Topbar } from "@/components/layout/Topbar";
import { DepartmentRiskCard } from "@/components/dashboard/DepartmentRiskCard";
import { EmployeeTablePanel } from "@/components/employee/EmployeeTablePanel";
import { EmployeeDetailPanel } from "@/components/employee/EmployeeDetailPanel";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useDashboardSummary } from "@/lib/hooks/useDashboardSummary";
import { EmployeeFilterProvider } from "@/lib/context/EmployeeFilterContext";
import { SelectedEmployeeProvider } from "@/lib/context/SelectedEmployeeContext";
import { Card, CardContent, Chip } from "@heroui/react";
import { Building2, Users, TrendingUp, ShieldAlert, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function DepartmentRiskContent() {
  const { summary, isLoading, error } = useDashboardSummary();

  const depts = summary?.departmentAverages || [];
  const salesDept = depts.find((d) => d.department.toLowerCase().includes("sales")) || {
    averageRiskScore: 24.89,
    highRiskCount: 111,
    totalEmployees: 446,
    avgMonthlyIncome: 6959,
  };
  const hrDept = depts.find((d) => d.department.toLowerCase().includes("human")) || {
    averageRiskScore: 23.81,
    highRiskCount: 15,
    totalEmployees: 63,
    avgMonthlyIncome: 6654,
  };
  const rdDept = depts.find((d) => d.department.toLowerCase().includes("research")) || {
    averageRiskScore: 16.55,
    highRiskCount: 159,
    totalEmployees: 961,
    avgMonthlyIncome: 6281,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Topbar
        title="Department Risk Analytics"
        subtitle="Analisis perbandingan tingkat risiko attrition dan faktor pendorong per divisi perusahaan"
      />
      <div className="p-8 flex flex-col gap-6">
        {isLoading && <LoadingState message="Memuat analitik risiko departemen dari FastAPI..." />}

        {error && (
          <ErrorState
            message="Gagal memuat analitik risiko departemen dari server FastAPI."
            onRetry={() => window.location.reload()}
          />
        )}

        {summary && (
          <>
            {/* Department Metric Overview Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <CardContent className="p-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Departemen Sales</p>
                    <p className="text-3xl font-bold text-rose-600 tracking-tight mt-1">
                      {salesDept.averageRiskScore}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {salesDept.highRiskCount} dari {salesDept.totalEmployees} Karyawan High Risk
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <CardContent className="p-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Human Resources</p>
                    <p className="text-3xl font-bold text-amber-600 tracking-tight mt-1">
                      {hrDept.averageRiskScore}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {hrDept.highRiskCount} dari {hrDept.totalEmployees} Karyawan High Risk
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                    <Building2 className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <CardContent className="p-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Research & Development</p>
                    <p className="text-3xl font-bold text-emerald-600 tracking-tight mt-1">
                      {rdDept.averageRiskScore}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {rdDept.highRiskCount} dari {rdDept.totalEmployees} Karyawan High Risk
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                    <Users className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Breakdown Matrix & Visual Card */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <DepartmentRiskCard departments={summary.departmentAverages} />
              </div>
              <div className="col-span-2 text-xs text-slate-600 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-[#006FEE]" />
                    Analisis Risiko Per Departemen (Macro Overview)
                  </h3>
                  <p className="leading-relaxed font-medium text-slate-600">
                    Departemen <b>Sales</b> ({salesDept.averageRiskScore}%) dan <b>Human Resources</b> ({hrDept.averageRiskScore}%) mencatatkan persentase risiko tertinggi di perusahaan. Faktor pendorong utama di divisi Sales adalah <b>Jam Lembur Tinggi</b> dan target performa bulanan, sementara di HR dipengaruhi oleh <b>Lingkungan Kerja & Kepuasan Kerja</b>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mb-1">
                      <Target className="h-3.5 w-3.5" /> Rekomendasi Sales
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Kurangi kuota lembur bulanan & evaluasi ulang kompensasi komisi penjualan.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-[#006FEE] flex items-center gap-1 mb-1">
                      <Target className="h-3.5 w-3.5" /> Rekomendasi R&D
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Sediakan jalur karir spesialis & program recognisi tenure kerja di atas 3 tahun.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Comparison Table */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-sans text-base font-bold text-slate-900 mb-4">
                  Matriks Perbandingan Risiko Departemen
                </h3>
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                        <th className="px-4 py-3">Departemen</th>
                        <th className="px-4 py-3">Total Staff</th>
                        <th className="px-4 py-3">Staff High Risk</th>
                        <th className="px-4 py-3">Skor Risiko Rata-rata</th>
                        <th className="px-4 py-3">Rata-rata Gaji Bulanan</th>
                        <th className="px-4 py-3">Status Risiko</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depts.map((d) => {
                        const isHigh = d.averageRiskScore >= 20;
                        return (
                          <tr key={d.department} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{d.department}</td>
                            <td className="px-4 py-3.5 text-slate-600 font-medium">{d.totalEmployees} Orang</td>
                            <td className="px-4 py-3.5 font-bold text-rose-600">{d.highRiskCount} Orang</td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">{d.averageRiskScore}%</td>
                            <td className="px-4 py-3.5 text-slate-700 font-semibold">{formatCurrency(d.avgMonthlyIncome)}</td>
                            <td className="px-4 py-3.5">
                              <Chip
                                color={isHigh ? "danger" : "success"}
                                variant="soft"
                                className="font-sans font-bold text-[11px] rounded-full"
                              >
                                {isHigh ? "Perhatian Tinggi" : "Stabil"}
                              </Chip>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Employee List Table & Detail Panel Section */}
            <div className="grid grid-cols-[1fr_420px] gap-6 items-start">
              <EmployeeTablePanel />
              <EmployeeDetailPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DepartmentRiskPage() {
  return (
    <EmployeeFilterProvider>
      <SelectedEmployeeProvider>
        <DepartmentRiskContent />
      </SelectedEmployeeProvider>
    </EmployeeFilterProvider>
  );
}
