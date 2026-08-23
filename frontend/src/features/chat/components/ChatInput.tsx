"use client";

import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isDisabled?: boolean;
}

/** Text input for asking the HR assistant a question about the selected employee. */
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
        placeholder="Rekomendasi retensi buat karyawan ini apa?"
        disabled={isDisabled}
        className="flex-1 rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-ink/30 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isDisabled || !value.trim()}
        className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper disabled:opacity-40"
      >
        Kirim
      </button>
    </form>
  );
}
