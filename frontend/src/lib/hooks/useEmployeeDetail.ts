"use client";

import { useEffect, useState } from "react";
import { getEmployeeById } from "@/lib/api/getEmployeeById";
import type { EmployeeDetail } from "@/lib/api/types";

interface UseEmployeeDetailResult {
  employee: EmployeeDetail | null;
  isLoading: boolean;
  error: Error | null;
}

/** Fetches full detail (including SHAP factors) for a given employee id. */
export function useEmployeeDetail(
  employeeId: string | null
): UseEmployeeDetailResult {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!employeeId) {
      setEmployee(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getEmployeeById(employeeId)
      .then(setEmployee)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [employeeId]);

  return { employee, isLoading, error };
}
