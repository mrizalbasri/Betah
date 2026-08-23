import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

/** Text input for searching employees by name, updating the shared filter state. */
export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label className="flex min-w-[190px] items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[13px] text-ink-soft">
      <Search className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari nama..."
        className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
      />
    </label>
  );
}
