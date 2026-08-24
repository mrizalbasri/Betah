"use client";

import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative flex items-center min-w-[240px]">
      <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search employee or role..."
        className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-8 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 text-slate-400 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
