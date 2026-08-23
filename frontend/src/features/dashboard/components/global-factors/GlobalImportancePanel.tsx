"use client";

import { ImportanceBarRow } from "@/features/dashboard/components/global-factors/ImportanceBarRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useGlobalFeatureImportance } from "@/lib/hooks/useGlobalFeatureImportance";

/**
 * Full Global Feature Importance panel (PRD §3.3): fetches the org-wide
 * SHAP ranking and renders it as horizontal bars, sorted by the backend.
 */
export function GlobalImportancePanel() {
  const { factors, isLoading, error } = useGlobalFeatureImportance();

  if (isLoading) {
    return (
      <div className="max-w-[720px] rounded-card border border-line bg-panel p-6">
        <LoadingState message="Memuat feature importance..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[720px] rounded-card border border-line bg-panel p-6">
        <ErrorState message="Gagal memuat feature importance dari server." />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] rounded-card border border-line bg-panel p-6">
      <p className="mb-5 text-[13px] leading-relaxed text-ink-soft">
        SHAP summary di seluruh karyawan — menunjukkan faktor apa yang paling
        sering mendorong risiko attrition secara organisasi, bukan
        per-individu.
      </p>
      {factors.map((factor) => (
        <ImportanceBarRow
          key={factor.label}
          label={factor.label}
          importance={factor.importance}
        />
      ))}
    </div>
  );
}
