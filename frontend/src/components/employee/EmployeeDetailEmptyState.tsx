import { MousePointerClick } from "lucide-react";

export function EmployeeDetailEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center text-slate-400">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1C2333] border border-[#1F2636]">
        <MousePointerClick className="h-5 w-5 text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Select an Employee</p>
        <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
          Click any row in the table to view their risk score, SHAP drivers, and ask HR AI.
        </p>
      </div>
    </div>
  );
}
