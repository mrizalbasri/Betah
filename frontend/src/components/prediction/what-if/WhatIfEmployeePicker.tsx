import { Search } from "lucide-react";
import type { EmployeeSummary } from "@/lib/api/types";

interface WhatIfEmployeePickerProps {
  employees: EmployeeSummary[];
  selectedId: string;
  search: string;
  onSearchChange: (v: string) => void;
  onChange: (id: string) => void;
}

/** Search input + dropdown for choosing which employee the what-if simulation runs against. */
export function WhatIfEmployeePicker({
  employees,
  selectedId,
  search,
  onSearchChange,
  onChange,
}: WhatIfEmployeePickerProps) {
  return (
    <div className="mb-4 flex max-w-[720px] gap-2">
      {/* Search — filters backend results, replaces typing into a 1470-item select */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama, jabatan, atau departemen..."
          className="w-full rounded-lg border border-line bg-panel py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Dropdown — shows filtered top-100 results */}
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-[320px] rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink outline-none"
      >
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            #{emp.id} {emp.name} — {emp.jobRole} ({emp.riskScore}%)
          </option>
        ))}
      </select>
    </div>
  );
}
