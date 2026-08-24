"use client";

import { EmployeeAvatar } from "@/features/employee/components/EmployeeAvatar";
import { RiskCell } from "@/features/employee/components/RiskCell";
import { FactorTags } from "@/features/employee/components/FactorTags";
import { cn } from "@/lib/utils/cn";
import type { EmployeeSummary } from "@/lib/api/types";

interface EmployeeTableRowProps {
  employee: EmployeeSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/** One row of the employee table. Clicking it selects the employee for the detail panel. */
export function EmployeeTableRow({
  employee,
  isSelected,
  onSelect,
}: EmployeeTableRowProps) {
  return (
    <tr
      onClick={() => onSelect(employee.id)}
      className={cn(
        "cursor-pointer border-b border-line-soft last:border-b-0 hover:bg-[#FAF9F5]",
        isSelected && "bg-accent-soft"
      )}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <EmployeeAvatar name={employee.name} />
          <span className="font-medium text-ink">{employee.name}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="font-mono text-[11px] text-ink-soft">
          {employee.department}
        </span>
      </td>
      <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">
        {employee.jobRole}
      </td>
      <td className="px-5 py-3.5">
        <RiskCell score={employee.riskScore} level={employee.riskLevel} />
      </td>
      <td className="px-5 py-3.5">
        <FactorTags factors={employee.topFactors} />
      </td>
    </tr>
  );
}
