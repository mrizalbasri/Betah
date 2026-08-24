"use client";

import { useEffect, useState } from "react";
import { getEmployees, type GetEmployeesOptions } from "@/lib/api/getEmployees";
import type { EmployeeSummary } from "@/lib/api/types";

interface UseEmployeesResult {
  employees: EmployeeSummary[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/** Fetches employees list from backend with search and filter parameters. */
export function useEmployees(options: GetEmployeesOptions = {}): UseEmployeesResult {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { department, search, sortBy, order, page, limit } = options;

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    getEmployees({ department, search, sortBy, order, page, limit })
      .then((res) => {
        if (!isCancelled) {
          setEmployees(res.employees);
          setTotal(res.total);
        }
      })
      .catch((err: Error) => {
        if (!isCancelled) setError(err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [department, search, sortBy, order, page, limit, reloadKey]);

  return {
    employees,
    total,
    isLoading,
    error,
    refetch: () => setReloadKey((k) => k + 1),
  };
}
