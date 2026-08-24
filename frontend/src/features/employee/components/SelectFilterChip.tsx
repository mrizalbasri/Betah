interface SelectFilterChipProps {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}

/** A native <select> styled to look like the other filter chips, used where options are a fixed list. */
export function SelectFilterChip({
  label,
  value,
  options,
  onChange,
}: SelectFilterChipProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11.5px] text-ink-soft outline-none"
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
