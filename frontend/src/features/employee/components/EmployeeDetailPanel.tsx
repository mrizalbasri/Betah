"use client";

import { EmployeeDetailHeader } from "@/features/employee/components/EmployeeDetailHeader";
import { RiskGaugeRow } from "@/features/employee/components/RiskGaugeRow";
import { ShapFactorsList } from "@/features/employee/components/ShapFactorsList";
import { EmployeeDetailEmptyState } from "@/features/employee/components/EmployeeDetailEmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useSelectedEmployee } from "@/lib/context/SelectedEmployeeContext";
import { useEmployeeDetail } from "@/lib/hooks/useEmployeeDetail";
import { getRiskDescription } from "@/lib/utils";

/**
 * The full employee detail panel: reads the selected employee id from
 * context, fetches its detail, and composes header, gauge, and SHAP list.
 * This is the single component the overview page needs for the right column.
 */
export function EmployeeDetailPanel() {
  const { selectedEmployeeId } = useSelectedEmployee();
  const { employee, isLoading, error } = useEmployeeDetail(selectedEmployeeId);

  return (
    <div className="sticky top-[26px] rounded-card border border-line bg-panel">
      {!selectedEmployeeId && <EmployeeDetailEmptyState />}
      {selectedEmployeeId && isLoading && (
        <LoadingState message="Memuat detail karyawan..." />
      )}
      {selectedEmployeeId && error && (
        <ErrorState message="Gagal memuat detail karyawan." />
      )}
      {employee && !isLoading && !error && (
        <>
          <EmployeeDetailHeader employee={employee} />
          <RiskGaugeRow
            score={employee.riskScore}
            level={employee.riskLevel}
            description={getRiskDescription(employee.riskLevel)}
          />
          <ShapFactorsList factors={employee.shapFactors} />
        </>
      )}
    </div>
  );
}
