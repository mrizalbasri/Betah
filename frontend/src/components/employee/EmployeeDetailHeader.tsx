"use client";

import { EmployeeAvatar } from "@/components/employee/EmployeeAvatar";
import { Chip } from "@heroui/react";
import { formatCurrency } from "@/lib/utils";
import type { EmployeeDetail } from "@/lib/api/types";

interface EmployeeDetailHeaderProps {
  employee: EmployeeDetail;
}

export function EmployeeDetailHeader({ employee }: EmployeeDetailHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-5 pb-4 pt-5">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
        <span>Detail Karyawan</span>
        <span className="font-mono text-slate-500">ID: {employee.id}</span>
      </div>
      <div className="flex items-center gap-3">
        <EmployeeAvatar name={employee.name} size="md" />
        <div>
          <div className="font-sans text-lg font-bold text-slate-900">
            {employee.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">
            {employee.jobRole} | {employee.department}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
        <Chip variant="soft" color="default" className="font-sans text-xs font-semibold bg-slate-100 text-slate-700">
          Masa Kerja: {employee.tenureYears} Tahun
        </Chip>
        {employee.monthlyIncome !== undefined && (
          <Chip variant="soft" color="success" className="font-sans text-xs font-semibold">
            Gaji: {formatCurrency(employee.monthlyIncome)}
          </Chip>
        )}
        {employee.overTime && (
          <Chip
            variant="soft"
            color={employee.overTime === "Yes" ? "danger" : "default"}
            className="font-sans text-xs font-semibold"
          >
            Lembur: {employee.overTime}
          </Chip>
        )}
      </div>
    </div>
  );
}
