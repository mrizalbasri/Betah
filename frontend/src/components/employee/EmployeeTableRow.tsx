"use client";

import { EmployeeAvatar } from "@/components/employee/EmployeeAvatar";
import { RiskCell } from "@/components/employee/RiskCell";
import { cn } from "@/lib/utils/cn";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTableRowProps {
  employee: EmployeeSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function EmployeeTableRow({
  employee,
  isSelected,
  onSelect,
}: EmployeeTableRowProps) {
  const emailName = employee.name.toLowerCase().replace(/\s+/g, ".");
  const email = `${emailName}@company.com`;

  return (
    <tr
      onClick={() => onSelect(employee.id)}
      className={cn(
        "cursor-pointer border-b border-slate-200 transition-colors hover:bg-slate-50",
        isSelected && "bg-blue-50/70 font-medium"
      )}
    >
      <td className="px-3.5 py-3">
        <span className="font-mono text-xs font-semibold text-slate-500">
          #{employee.id}
        </span>
      </td>
      <td className="px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <EmployeeAvatar name={employee.name} />
          <div className="max-w-[140px] truncate">
            <span className="font-sans text-xs font-bold text-slate-900 block truncate" title={employee.name}>
              {employee.name}
            </span>
            <span className="text-[11px] text-slate-500 font-medium truncate block" title={email}>
              {email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3.5 py-3">
        <span className="font-sans text-xs text-slate-700 font-semibold block max-w-[130px] truncate" title={employee.jobRole}>
          {employee.jobRole}
        </span>
      </td>
      <td className="px-3.5 py-3">
        <span className="font-sans text-xs text-slate-600 font-medium block max-w-[130px] truncate" title={employee.department}>
          {employee.department}
        </span>
      </td>
      <td className="px-3.5 py-3">
        <RiskCell score={employee.riskScore} level={employee.riskLevel} />
      </td>
    </tr>
  );
}
