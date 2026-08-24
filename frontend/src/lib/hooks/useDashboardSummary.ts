"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/lib/api/getDashboardSummary";
import type { DashboardSummary } from "@/lib/api/types";

interface UseDashboardSummaryResult {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: Error | null;
}

/** Fetches aggregate metrics (totals, high-risk count, per-department averages) for the overview page. */
export function useDashboardSummary(): UseDashboardSummaryResult {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  return { summary, isLoading, error };
}
