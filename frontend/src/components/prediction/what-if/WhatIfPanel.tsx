"use client";

import { useState, useEffect } from "react";
import { WhatIfEmployeePicker } from "@/components/prediction/what-if/WhatIfEmployeePicker";
import { WhatIfForm } from "@/components/prediction/what-if/WhatIfForm";
import { WhatIfResult } from "@/components/prediction/what-if/WhatIfResult";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useEmployees } from "@/lib/hooks/useEmployees";
import { useWhatIfSimulation } from "@/lib/hooks/useWhatIfSimulation";

/**
 * Full What-If Simulator panel (PRD §3.4): lets the HR manager pick an
 * employee, adjust hypothetical attributes, and see the re-predicted
 * risk score compared to the current one.
 */
export function WhatIfPanel() {
  const { employees, isLoading, error } = useEmployees();
  const { result, isLoading: isSimulating, runSimulation } =
    useWhatIfSimulation();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  useEffect(() => {
    if (!selectedEmployeeId && employees.length > 0) {
      setSelectedEmployeeId(employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

  if (isLoading) {
    return <LoadingState message="Memuat daftar karyawan..." />;
  }

  if (error) {
    return <ErrorState message="Gagal memuat daftar karyawan dari server." />;
  }

  const selectedEmployee = employees.find(
    (employee) => employee.id === selectedEmployeeId
  );

  if (!selectedEmployee) {
    return null;
  }

  return (
    <div>
      <WhatIfEmployeePicker
        employees={employees}
        selectedId={selectedEmployeeId}
        onChange={setSelectedEmployeeId}
      />
      <div className="grid grid-cols-[1fr_300px] items-start gap-5">
        <WhatIfForm
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          isSubmitting={isSimulating}
          onSubmit={runSimulation}
        />
        <WhatIfResult beforeScore={selectedEmployee.riskScore} result={result} />
      </div>
    </div>
  );
}
