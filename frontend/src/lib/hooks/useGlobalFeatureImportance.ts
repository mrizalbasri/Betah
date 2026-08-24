"use client";

import { useEffect, useState } from "react";
import { getGlobalFeatureImportance } from "@/lib/api/getGlobalFeatureImportance";
import type { GlobalFeatureImportance } from "@/lib/api/types";

interface UseGlobalFeatureImportanceResult {
  factors: GlobalFeatureImportance[];
  isLoading: boolean;
  error: Error | null;
}

/** Fetches the organization-wide SHAP importance ranking for the Global Feature Importance page. */
export function useGlobalFeatureImportance(): UseGlobalFeatureImportanceResult {
  const [factors, setFactors] = useState<GlobalFeatureImportance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getGlobalFeatureImportance()
      .then(setFactors)
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  return { factors, isLoading, error };
}
