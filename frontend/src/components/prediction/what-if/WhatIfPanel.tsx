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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Debounce 400ms — don't hit the backend on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch top-100 by risk, or filter by search — never load all 1470 up front
  const { employees, isLoading, error } = useEmployees({
    search: debouncedSearch || undefined,
    sortBy: "risk_score_percentage",
    order: "desc",
    limit: 100,
  });

  const { result, isLoading: isSimulating, runSimulation } =
    useWhatIfSimulation();

  // Auto-select first employee when list loads/changes
  const effectiveId =
    employees.some((e) => e.id === selectedEmployeeId)
      ? selectedEmployeeId
      : employees[0]?.id ?? "";

  if (isLoading) {
    return <LoadingState message="Memuat daftar karyawan..." />;
  }

  if (error) {
    return <ErrorState message="Gagal memuat daftar karyawan dari server." />;
  }

  const selectedEmployee = employees.find((e) => e.id === effectiveId);

  if (!selectedEmployee) {
    return null;
  }

  return (
    <div>
      <WhatIfEmployeePicker
        employees={employees}
        selectedId={effectiveId}
        search={search}
        onSearchChange={setSearch}
        onChange={(id) => setSelectedEmployeeId(id)}
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

