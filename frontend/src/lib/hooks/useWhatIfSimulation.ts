"use client";

import { useState, useCallback } from "react";
import { postWhatIfPrediction } from "@/lib/api/postWhatIfPrediction";
import type { WhatIfInput, WhatIfResult } from "@/lib/api/types";

interface UseWhatIfSimulationResult {
  result: WhatIfResult | null;
  isLoading: boolean;
  error: Error | null;
  runSimulation: (input: WhatIfInput) => Promise<void>;
}

/** Exposes a function to trigger the what-if re-prediction and tracks its async state. */
export function useWhatIfSimulation(): UseWhatIfSimulationResult {
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runSimulation = useCallback(async (input: WhatIfInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextResult = await postWhatIfPrediction(input);
      setResult(nextResult);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, runSimulation };
}
