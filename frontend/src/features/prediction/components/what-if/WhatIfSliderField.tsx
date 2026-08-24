interface WhatIfSliderFieldProps {
  label: string;
  displayValue: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

/** A labeled range slider with the current value shown next to the label. */
export function WhatIfSliderField({
  label,
  displayValue,
  min,
  max,
  value,
  onChange,
}: WhatIfSliderFieldProps) {
  return (
    <div className="mb-[18px]">
      <label className="mb-2 flex justify-between text-[12.5px] font-medium">
        {label}
        <span className="font-mono text-accent">{displayValue}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}
