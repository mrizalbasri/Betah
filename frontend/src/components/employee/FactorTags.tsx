interface FactorTagsProps {
  factors: string[];
}

export function FactorTags({ factors }: FactorTagsProps) {
  return (
    <div className="flex max-w-[220px] flex-wrap gap-1.5">
      {factors.map((factor) => (
        <span
          key={factor}
          className="whitespace-nowrap rounded-md border border-[#26334D] bg-[#1E293B] px-2 py-0.5 font-mono text-[10.5px] text-slate-300"
        >
          {factor}
        </span>
      ))}
    </div>
  );
}
