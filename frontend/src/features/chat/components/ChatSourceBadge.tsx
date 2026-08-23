import type { ChatSource } from "@/lib/api/types";

const SOURCE_LABEL: Record<ChatSource["tool"], string> = {
  query_model_output: "Sumber: Model Prediksi",
  retrieve_hr_policy: "Sumber: Kebijakan HR",
};

/**
 * Surfaces which tool the agent decided to use for a given answer
 * (PRD §4 rubric item 3 — agent decides, not a fixed chain). Keeps that
 * decision visible to the HR manager instead of hidden in the response text.
 */
export function ChatSourceBadge({ source }: { source: ChatSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-wide text-ink-soft">
      {SOURCE_LABEL[source.tool]}
      {source.detail && (
        <span className="font-normal normal-case tracking-normal text-ink-soft/80">
          · {source.detail}
        </span>
      )}
    </span>
  );
}
