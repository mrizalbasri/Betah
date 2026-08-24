import type { EmployeeSummary } from "@/lib/api/types";

interface WhatIfEmployeePickerProps {
  employees: EmployeeSummary[];
  selectedId: string;
  onChange: (id: string) => void;
}

/** Dropdown for choosing which employee the what-if simulation runs against. */
export function WhatIfEmployeePicker({
  employees,
  selectedId,
  onChange,
}: WhatIfEmployeePickerProps) {
  return (
    <select
      value={selectedId}
      onChange={(event) => onChange(event.target.value)}
      className="mb-4 w-full max-w-[720px] rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none"
    >
      {employees.map((employee) => (
        <option key={employee.id} value={employee.id}>
          {employee.name} — {employee.jobRole} ({employee.riskScore}% risk)
        </option>
      ))}
    </select>
  );
}
