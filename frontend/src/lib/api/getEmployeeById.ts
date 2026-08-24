import { apiRequest } from "@/lib/api/client";
import { generateEmployeeName } from "@/lib/api/getEmployees";
import type {
  EmployeeDetail,
  BackendEmployeeDetailResponse,
  ShapFactor,
  RiskLevel,
} from "@/lib/api/types";

function mapToRiskLevel(pct: number): RiskLevel {
  if (pct >= 50) return "high";
  if (pct >= 30) return "medium";
  return "low";
}

/**
 * GET /api/employees/{id}
 * Returns full risk detail for one employee, including per-individual SHAP factors.
 */
export async function getEmployeeById(id: string): Promise<EmployeeDetail> {
  const numericId = parseInt(id, 10);
  const endpoint = `/api/employees/${isNaN(numericId) ? id : numericId}`;
  
  const res = await apiRequest<BackendEmployeeDetailResponse>(endpoint);

  const profile = res.profile || {};
  const pred = res.prediction || {};
  const explanation = res.explanation || {};

  const pct = pred.attrition_risk_percentage ?? 0;
  const empId = res.employee_id || numericId || 1;
  const name = generateEmployeeName(empId);

  const shapFactors: ShapFactor[] = (explanation.top_factors || []).map((tf) => {
    const isIncreasing = (tf.effect || "").toLowerCase().includes("meningkatkan");
    const valStr = tf.value !== undefined ? ` = ${tf.value}` : "";
    return {
      label: `${tf.feature_name || tf.feature}${valStr}`,
      contribution: Math.round(tf.impact_percentage * (isIncreasing ? 1 : -1)),
    };
  });

  const topFactorsList = (explanation.top_factors || []).slice(0, 3).map(
    (tf) => tf.feature_name || tf.feature
  );

  return {
    id: String(empId),
    name,
    department: String(profile.Department || "N/A"),
    jobRole: String(profile.JobRole || "N/A"),
    tenureYears: Number(profile.YearsAtCompany || 0),
    monthlyIncome: Number(profile.MonthlyIncome || 0),
    overTime: String(profile.OverTime || "No"),
    jobSatisfaction: Number(profile.JobSatisfaction || 3),
    workLifeBalance: Number(profile.WorkLifeBalance || 3),
    riskScore: Math.round(pct * 10) / 10,
    riskLevel: mapToRiskLevel(pct),
    topFactors: topFactorsList.length > 0 ? topFactorsList : ["OverTime"],
    shapFactors,
    profileRaw: profile,
  };
}
