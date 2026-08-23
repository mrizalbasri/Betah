interface FactorTagsProps {
  factors: string[];
}

/** Renders a wrapped row of small tag pills summarizing an employee's top attrition factors. */
export function FactorTags({ factors }: FactorTagsProps) {
  return (
    <div className="flex max-w-[220px] flex-wrap gap-1.5">
      {factors.map((factor) => (
        <span
          key={factor}
          className="whitespace-nowrap rounded-[5px] border border-line-soft bg-[#F1EFE9] px-2 py-0.5 text-[11px] text-ink-soft"
        >
          {factor}
        </span>
      ))}
    </div>
  );
}
