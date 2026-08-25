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

  const rawFactors = explanation.top_increase_factors || explanation.all_contributions || explanation.top_factors || [];
  const shapFactors: ShapFactor[] = rawFactors.map((tf: any) => {
    const isIncreasing = tf.impact === "increase" || (tf.shap_value && tf.shap_value > 0) || (tf.effect || "").toLowerCase().includes("meningkatkan");
    const val = tf.feature_value !== undefined ? tf.feature_value : tf.value;
    const valStr = val !== undefined ? ` (${val})` : "";
    const displayName = tf.display_name || tf.feature_name || tf.feature;
    const shapVal = tf.shap_value !== undefined ? Math.round(tf.shap_value * 100) : Math.round((tf.impact_percentage || 0) * (isIncreasing ? 1 : -1));
    return {
      label: `${displayName}${valStr}`,
      contribution: shapVal,
    };
  });

  const topFactorsList = rawFactors.slice(0, 3).map(
    (tf: any) => tf.display_name || tf.feature_name || tf.feature
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
