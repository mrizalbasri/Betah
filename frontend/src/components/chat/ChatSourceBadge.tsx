"use client";

import { Chip } from "@heroui/react";
import type { ChatSource } from "@/lib/api/types";

export function ChatSourceBadge({ source }: { source: ChatSource }) {
  const isHR = source.tool === "retrieve_hr_policy";
  const label = isHR ? "Dokumen Kebijakan HR (RAG)" : "Model Prediksi (ML/SHAP)";
  const color = isHR ? "accent" : "default";

  return (
    <Chip
      color={color}
      variant="soft"
      className="font-mono text-[10px] font-semibold"
    >
      {label}
    </Chip>
  );
}
