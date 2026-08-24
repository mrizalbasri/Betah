"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { EmployeeFilters, EmployeeSort } from "@/lib/api/types";

interface EmployeeFilterContextValue {
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
  sort: EmployeeSort;
  setSort: (sort: EmployeeSort) => void;
}

const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  department: null,
  jobRole: null,
  riskLevel: null,
};

const DEFAULT_SORT: EmployeeSort = {
  field: "riskScore",
  direction: "desc",
};

const EmployeeFilterContext = createContext<
  EmployeeFilterContextValue | undefined
>(undefined);

export function EmployeeFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<EmployeeFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<EmployeeSort>(DEFAULT_SORT);

  return (
    <EmployeeFilterContext.Provider
      value={{ filters, setFilters, sort, setSort }}
    >
      {children}
    </EmployeeFilterContext.Provider>
  );
}

/** Access the shared employee table filter and sort state. Must be used within EmployeeFilterProvider. */
export function useEmployeeFilters(): EmployeeFilterContextValue {
  const context = useContext(EmployeeFilterContext);
  if (!context) {
    throw new Error(
      "useEmployeeFilters must be used within an EmployeeFilterProvider"
    );
  }
  return context;
}
