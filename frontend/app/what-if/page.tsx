import { Topbar } from "@/components/layout/Topbar";
import { WhatIfPanel } from "@/features/prediction/components/what-if/WhatIfPanel";

/** What-If Simulator page (PRD §3.4): re-predict risk score after hypothetical attribute changes. */
export default function WhatIfPage() {
  return (
    <>
      <Topbar
        title="What-If Simulator"
        subtitle="Simulasikan perubahan atribut karyawan dan lihat dampaknya ke risk score"
      />
      <div className="px-9 py-[26px]">
        <WhatIfPanel />
      </div>
    </>
  );
}
