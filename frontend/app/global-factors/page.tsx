import { Topbar } from "@/components/layout/Topbar";
import { GlobalImportancePanel } from "@/features/dashboard/components/global-factors/GlobalImportancePanel";

/** Global Feature Importance page (PRD §3.3): org-wide SHAP ranking. */
export default function GlobalFactorsPage() {
  return (
    <>
      <Topbar
        title="Global Feature Importance"
        subtitle="Pola umum faktor attrition di seluruh organisasi"
      />
      <div className="px-9 py-[26px]">
        <GlobalImportancePanel />
      </div>
    </>
  );
}
