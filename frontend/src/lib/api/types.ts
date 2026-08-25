/**
 * Shared API types. These mirror the backend's response shape
 * so the frontend and backend stay in sync.
 */

export type RiskLevel = "high" | "medium" | "low";

export interface ShapFactor {
  /** Human-readable factor label, e.g. "OverTime = Yes" */
  label: string;
  /** Signed contribution to risk, e.g. +15 or -8 (percentage points) */
  contribution: number;
}

export interface EmployeeSummary {
  id: string;
  name: string;
  department: string;
  jobRole: string;
  tenureYears: number;
  monthlyIncome?: number;
  overTime?: string;
  jobSatisfaction?: number;
  workLifeBalance?: number;
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  topFactors: string[]; // short labels for table display, e.g. ["OverTime", "Masa Kerja: 6 Tahun"]
}

export interface EmployeeDetail extends EmployeeSummary {
  shapFactors: ShapFactor[];
  profileRaw?: Record<string, unknown>;
}

export interface DepartmentRiskAverage {
  department: string;
  averageRiskScore: number;
  totalEmployees: number;
  highRiskCount: number;
  avgMonthlyIncome: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  highRiskCount: number;
  lowRiskCount: number;
  highRiskDeltaPct: number;
  averageRiskScore: number;
  avgMonthlyIncomeHighRisk: number;
  avgMonthlyIncomeLowRisk: number;
  departmentAverages: DepartmentRiskAverage[];
  topCompanyFactors?: Array<{
    factor: string;
    count: number;
    percentage: number;
  }>;
}

export interface GlobalFeatureImportance {
  label: string;
  importance: number; // 0–1 or count/percentage
  count?: number;
  percentage?: number;
}

export interface WhatIfInput {
  employeeId: string;
  monthlyIncome: number;
  overTime: "Yes" | "No";
  yearsAtCompany: number;
  jobSatisfaction: number; // 1–4
  workLifeBalance?: number;
  jobRole?: string;
  department?: string;
}

export interface WhatIfResult {
  beforeRiskScore: number;
  afterRiskScore: number;
  note: string;
  predictionBefore?: string;
  predictionAfter?: string;
}

export type ChatSourceTool = "query_model_output" | "retrieve_hr_policy" | "unknown";

export interface ChatSource {
  tool: ChatSourceTool;
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
}

export interface ChatRequest {
  employeeId?: string;
  message: string;
}

export interface EmployeeFilters {
  search: string;
  department: string | null;
  jobRole: string | null;
  riskLevel: RiskLevel | null;
}

export type SortDirection = "asc" | "desc";

export interface EmployeeSort {
  field: keyof Pick<EmployeeSummary, "riskScore" | "name" | "department">;
  direction: SortDirection;
}

// Raw Backend API Response Interfaces
export interface BackendEmployeeItem {
  employee_id: number;
  EmployeeNumber: number;
  Age: number;
  Gender: string;
  Department: string;
  JobRole: string;
  MonthlyIncome: number;
  OverTime: string;
  YearsAtCompany: number;
  YearsInCurrentRole: number;
  JobSatisfaction: number;
  WorkLifeBalance: number;
  risk_score_percentage: number;
  prediction: string;
  top_factor: string;
}

export interface BackendEmployeesResponse {
  data: BackendEmployeeItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface BackendAnalyticsSummaryResponse {
  overview: {
    total_employees: number;
    high_risk_count: number;
    low_risk_count: number;
    high_risk_percentage: number;
    avg_monthly_income_high_risk: number;
    avg_monthly_income_low_risk: number;
  };
  department_breakdown: Array<{
    department: string;
    total_employees: number;
    high_risk_count: number;
    high_risk_percentage: number;
    avg_monthly_income: number;
  }>;
  top_company_factors: Array<{
    factor: string;
    count: number;
    percentage: number;
  }>;
}

export interface BackendEmployeeDetailResponse {
  employee_id: number;
  profile: Record<string, unknown>;
  prediction: {
    employee_id: number;
    attrition_prediction: number;
    attrition_probability: number;
    attrition_risk_percentage: number;
    prediction: string;
  };
  explanation: {
    employee_id?: number;
    base_value?: number;
    top_increase_factors?: Array<Record<string, any>>;
    top_decrease_factors?: Array<Record<string, any>>;
    all_contributions?: Array<Record<string, any>>;
    top_factors?: Array<{
      feature?: string;
      feature_name?: string;
      value?: number | string;
      shap_value?: number;
      impact_percentage?: number;
      effect?: string;
    }>;
  };
}
