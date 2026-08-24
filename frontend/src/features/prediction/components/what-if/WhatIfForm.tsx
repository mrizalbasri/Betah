"use client";

import { useState } from "react";
import { WhatIfSliderField } from "@/features/prediction/components/what-if/WhatIfSliderField";
import { WhatIfSelectField } from "@/features/prediction/components/what-if/WhatIfSelectField";
import { formatCurrency } from "@/lib/utils";
import type { WhatIfInput } from "@/lib/api/types";

interface WhatIfFormProps {
  employeeId: string;
  employeeName: string;
  onSubmit: (input: WhatIfInput) => void;
  isSubmitting: boolean;
}

const JOB_SATISFACTION_LABEL: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Very High",
};

/**
 * Form for adjusting one employee's attributes and re-running the
 * prediction (PRD §3.4). Keeps its own input state; only calls back
 * to the parent when the HR manager submits.
 */
export function WhatIfForm({
  employeeId,
  employeeName,
  onSubmit,
  isSubmitting,
}: WhatIfFormProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(6_500_000);
  const [overTime, setOverTime] = useState<"Yes" | "No">("Yes");
  const [yearsAtCompany, setYearsAtCompany] = useState(2);
  const [jobSatisfaction, setJobSatisfaction] = useState(2);

  function handleSubmit() {
    onSubmit({
      employeeId,
      monthlyIncome,
      overTime,
      yearsAtCompany,
      jobSatisfaction,
    });
  }

  return (
    <div className="rounded-card border border-line bg-panel p-[22px]">
      <p className="mb-5 text-[13px] leading-relaxed text-ink-soft">
        Ubah nilai atribut untuk <b>{employeeName}</b> dan lihat perubahan
        risk score — berguna untuk menjustifikasi keputusan retensi sebelum
        diajukan.
      </p>

      <WhatIfSliderField
        label="Monthly Income"
        displayValue={formatCurrency(monthlyIncome)}
        min={2_000_000}
        max={20_000_000}
        value={monthlyIncome}
        onChange={setMonthlyIncome}
      />

      <WhatIfSelectField
        label="OverTime"
        value={overTime}
        options={["Yes", "No"]}
        onChange={(value) => setOverTime(value as "Yes" | "No")}
      />

      <WhatIfSliderField
        label="Years At Company"
        displayValue={String(yearsAtCompany)}
        min={0}
        max={40}
        value={yearsAtCompany}
        onChange={setYearsAtCompany}
      />

      <WhatIfSliderField
        label="Job Satisfaction"
        displayValue={JOB_SATISFACTION_LABEL[jobSatisfaction]}
        min={1}
        max={4}
        value={jobSatisfaction}
        onChange={setJobSatisfaction}
      />

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-1 w-full rounded-lg bg-ink py-2.5 text-[13px] font-semibold text-[#F2F1EC] disabled:opacity-60"
      >
        {isSubmitting ? "Menghitung..." : "Re-predict Risk Score"}
      </button>
    </div>
  );
}
