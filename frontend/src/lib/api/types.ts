/**
 * Shared API types. These mirror the backend's response shape
 * (see PRD §7 — Endpoint API) so the frontend and backend stay
 * in sync through one contract instead of ad-hoc shapes per component.
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
  riskScore: number; // 0–100
  riskLevel: RiskLevel;
  topFactors: string[]; // short labels for table display, e.g. ["OverTime", "Low Income"]
}

export interface EmployeeDetail extends EmployeeSummary {
  shapFactors: ShapFactor[];
}

export interface DepartmentRiskAverage {
  department: string;
  averageRiskScore: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  highRiskCount: number;
  highRiskDeltaPct: number;
  averageRiskScore: number;
  departmentAverages: DepartmentRiskAverage[];
}

export interface GlobalFeatureImportance {
  label: string;
  importance: number; // 0–1, relative SHAP magnitude
}

export interface WhatIfInput {
  employeeId: string;
  monthlyIncome: number;
  overTime: "Yes" | "No";
  yearsAtCompany: number;
  jobSatisfaction: number; // 1–4
}

export interface WhatIfResult {
  beforeRiskScore: number;
  afterRiskScore: number;
  note: string;
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
