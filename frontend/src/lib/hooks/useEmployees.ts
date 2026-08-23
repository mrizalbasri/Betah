"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/lib/api/getEmployees";
import type { EmployeeSummary } from "@/lib/api/types";

interface UseEmployeesResult {
  employees: EmployeeSummary[];
  isLoading: boolean;
  error: Error | null;
}

/** Fetches the full employee list for the dashboard table on mount. */
export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getEmployees()
      .then(setEmployees)
      .catch((err: Error) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  return { employees, isLoading, error };
}
