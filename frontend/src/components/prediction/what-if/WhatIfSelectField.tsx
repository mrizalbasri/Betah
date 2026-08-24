interface WhatIfSelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

/** A labeled dropdown field for categorical what-if inputs (e.g. OverTime). */
export function WhatIfSelectField({
  label,
  value,
  options,
  onChange,
}: WhatIfSelectFieldProps) {
  return (
    <div className="mb-[18px]">
      <label className="mb-2 block text-[12.5px] font-medium">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[7px] border border-line bg-paper px-2.5 py-2 text-[13px] text-ink outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
