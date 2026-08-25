import { apiRequest } from "@/lib/api/client";
import type { DashboardSummary, BackendAnalyticsSummaryResponse } from "@/lib/api/types";

/**
 * GET /api/analytics/summary
 * Returns aggregate metrics for overview page: total employees,
 * high-risk count, and average risk score per department.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await apiRequest<BackendAnalyticsSummaryResponse>("/api/analytics/summary");

  const overview = res.overview || {
    total_employees: 0,
    high_risk_count: 0,
    low_risk_count: 0,
    high_risk_percentage: 0,
    avg_monthly_income_high_risk: 0,
    avg_monthly_income_low_risk: 0,
  };

  const departmentAverages = (res.department_breakdown || []).map((dept) => ({
    department: dept.department,
    averageRiskScore: dept.high_risk_percentage,
    totalEmployees: dept.total_employees,
    highRiskCount: dept.high_risk_count,
    avgMonthlyIncome: dept.avg_monthly_income,
  }));

  // Calculate overall weighted average risk score across departments
  const avgRiskScore = overview.high_risk_percentage;

  return {
    totalEmployees: overview.total_employees,
    highRiskCount: overview.high_risk_count,
    lowRiskCount: overview.low_risk_count,
    highRiskDeltaPct: overview.high_risk_percentage,
    averageRiskScore: avgRiskScore,
    avgMonthlyIncomeHighRisk: overview.avg_monthly_income_high_risk,
    avgMonthlyIncomeLowRisk: overview.avg_monthly_income_low_risk,
    departmentAverages,
    topCompanyFactors: res.top_company_factors || [],
  };
}
