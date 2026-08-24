import { EmployeeAvatar } from "@/features/employee/components/EmployeeAvatar";
import type { EmployeeDetail } from "@/lib/api/types";

interface EmployeeDetailHeaderProps {
  employee: EmployeeDetail;
}

/** Detail panel header: employee avatar, name, and a role/department/tenure summary line. */
export function EmployeeDetailHeader({ employee }: EmployeeDetailHeaderProps) {
  return (
    <div className="border-b border-line-soft bg-gradient-to-b from-[#FBFAF7] to-panel px-5 pb-4 pt-[18px]">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        Detail Karyawan
      </div>
      <div className="flex items-center gap-3">
        <EmployeeAvatar name={employee.name} size="md" />
        <div>
          <div className="font-serif text-lg font-medium text-ink">
            {employee.name}
          </div>
          <div className="text-xs text-ink-soft">
            {employee.jobRole} &middot; {employee.department} &middot;{" "}
            {employee.tenureYears} tahun
          </div>
        </div>
      </div>
    </div>
  );
}
