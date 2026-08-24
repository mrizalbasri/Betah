import type { WhatIfResult as WhatIfResultData } from "@/lib/api/types";

interface WhatIfResultProps {
  beforeScore: number;
  result: WhatIfResultData | null;
}

/** Displays the before/after risk score comparison once a what-if simulation has run. */
export function WhatIfResult({ beforeScore, result }: WhatIfResultProps) {
  return (
    <div className="rounded-card border border-line bg-panel p-[22px] text-center">
      <div className="mb-3.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        Hasil Simulasi
      </div>

      {!result ? (
        <p className="py-6 text-sm text-ink-soft">
          Atur nilai di sebelah kiri lalu jalankan simulasi.
        </p>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-center gap-3.5">
            <span className="font-mono text-xl text-ink-soft line-through">
              {beforeScore}%
            </span>
            <span className="text-ink-soft">→</span>
            <span className="font-serif text-[30px] font-semibold text-signal-low">
              {result.afterRiskScore}%
            </span>
          </div>
          <p className="rounded-lg bg-signal-low-bg p-2.5 text-xs leading-relaxed text-ink-soft">
            {result.note}
          </p>
        </>
      )}
    </div>
  );
}
