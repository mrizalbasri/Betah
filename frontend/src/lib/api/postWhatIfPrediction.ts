import { apiRequest } from "@/lib/api/client";
import { getEmployeeById } from "@/lib/api/getEmployeeById";
import type { WhatIfInput, WhatIfResult } from "@/lib/api/types";

interface BackendPredictResponse {
  prediction: {
    attrition_prediction: number;
    attrition_probability: number;
    attrition_risk_percentage: number;
    prediction: string;
  };
  explanation?: unknown;
}

/**
 * POST /api/predict
 * Simulates model re-prediction for custom employee parameters.
 */
export async function postWhatIfPrediction(
  input: WhatIfInput
): Promise<WhatIfResult> {
  let beforeRiskScore = 50;
  let rawProfile: Record<string, unknown> = {};

  if (input.employeeId) {
    try {
      const orig = await getEmployeeById(input.employeeId);
      beforeRiskScore = orig.riskScore;
      rawProfile = orig.profileRaw || {};
    } catch {
      // Fallback if employee is hypothetical or not found in DB
    }
  }

  // Merge hypothetical input overrides with original raw profile / default fallback
  const payload = {
    Age: Number(rawProfile.Age || 35),
    BusinessTravel: String(rawProfile.BusinessTravel || "Travel_Rarely"),
    DailyRate: Number(rawProfile.DailyRate || 800),
    Department: input.department || String(rawProfile.Department || "Sales"),
    DistanceFromHome: Number(rawProfile.DistanceFromHome || 10),
    Education: Number(rawProfile.Education || 3),
    EducationField: String(rawProfile.EducationField || "Life Sciences"),
    EnvironmentSatisfaction: Number(rawProfile.EnvironmentSatisfaction || 3),
    Gender: String(rawProfile.Gender || "Male"),
    HourlyRate: Number(rawProfile.HourlyRate || 60),
    JobInvolvement: Number(rawProfile.JobInvolvement || 3),
    JobLevel: Number(rawProfile.JobLevel || 2),
    JobRole: input.jobRole || String(rawProfile.JobRole || "Sales Executive"),
    JobSatisfaction: input.jobSatisfaction,
    MaritalStatus: String(rawProfile.MaritalStatus || "Single"),
    MonthlyIncome: input.monthlyIncome,
    MonthlyRate: Number(rawProfile.MonthlyRate || 15000),
    NumCompaniesWorked: Number(rawProfile.NumCompaniesWorked || 2),
    OverTime: input.overTime,
    PercentSalaryHike: Number(rawProfile.PercentSalaryHike || 12),
    PerformanceRating: Number(rawProfile.PerformanceRating || 3),
    RelationshipSatisfaction: Number(rawProfile.RelationshipSatisfaction || 3),
    StockOptionLevel: Number(rawProfile.StockOptionLevel || 1),
    TotalWorkingYears: Number(rawProfile.TotalWorkingYears || 10),
    TrainingTimesLastYear: Number(rawProfile.TrainingTimesLastYear || 2),
    WorkLifeBalance: input.workLifeBalance || Number(rawProfile.WorkLifeBalance || 3),
    YearsAtCompany: input.yearsAtCompany,
    YearsInCurrentRole: Number(rawProfile.YearsInCurrentRole || 3),
    YearsSinceLastPromotion: Number(rawProfile.YearsSinceLastPromotion || 1),
    YearsWithCurrManager: Number(rawProfile.YearsWithCurrManager || 3),
  };

  const res = await apiRequest<BackendPredictResponse>("/api/predict", {
    method: "POST",
    body: payload,
  });

  const afterRiskScore = Math.round((res.prediction?.attrition_risk_percentage ?? 0) * 10) / 10;
  const delta = Math.round((afterRiskScore - beforeRiskScore) * 10) / 10;

  let note = `Skor risiko berubah dari ${beforeRiskScore}% menjadi ${afterRiskScore}%.`;
  if (delta < 0) {
    note = `Penyesuaian atribut berhasil menurunkan risiko attrition sebesar ${Math.abs(delta)}%.`;
  } else if (delta > 0) {
    note = `Penyesuaian atribut meningkatkan risiko attrition sebesar ${delta}%.`;
  } else {
    note = `Atribut yang disimulasikan tidak mengubah skor risiko.`;
  }

  return {
    beforeRiskScore,
    afterRiskScore,
    note,
    predictionBefore: beforeRiskScore >= 50 ? "High Risk" : "Low Risk",
    predictionAfter: res.prediction?.prediction || (afterRiskScore >= 50 ? "High Risk" : "Low Risk"),
  };
}
