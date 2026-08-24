"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@heroui/react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ onSubmit, isDisabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isDisabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tanya opsi retensi atau kebijakan HR..."
        disabled={isDisabled}
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-sans text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#006FEE] focus:bg-white focus:ring-1 focus:ring-[#006FEE] disabled:opacity-60"
      />
      <Button
        type="submit"
        isDisabled={isDisabled || !value.trim()}
        className="flex items-center justify-center rounded-xl bg-[#006FEE] px-3.5 py-2 text-white font-semibold disabled:opacity-40 hover:bg-blue-600 transition-colors shadow-2xs"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
