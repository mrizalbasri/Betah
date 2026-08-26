import { apiRequest } from "@/lib/api/client";
import type {
  EmployeeSummary,
  BackendEmployeesResponse,
  BackendEmployeeItem,
  RiskLevel,
} from "@/lib/api/types";

export interface GetEmployeesOptions {
  department?: string | null;
  search?: string | null;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface GetEmployeesResult {
  employees: EmployeeSummary[];
  total: number;
  page: number;
  totalPages: number;
}

const FIRST_NAMES = [
  "Aditya", "Budi", "Citra", "Dewi", "Eko", "Fikri", "Gita", "Hendra", "Indah", "Joko",
  "Kiki", "Lestari", "Mega", "Nugroho", "Oki", "Putri", "Rian", "Siti", "Taufik", "Utami",
  "Vina", "Wawan", "Yulia", "Zainal", "Ahmad", "Bambang", "Diah", "Farhan", "Hasan", "Rina"
];

const LAST_NAMES = [
  "Pratama", "Santoso", "Wijaya", "Kusuma", "Hidayat", "Saputra", "Wibowo", "Suryono",
  "Utomo", "Siregar", "Nasution", "Firmansyah", "Gunawan", "Setiawan", "Suharto", "Lestari"
];

export function generateEmployeeName(id: number): string {
  const firstName = FIRST_NAMES[id % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(id * 3) % LAST_NAMES.length];
  return `${firstName} ${lastName}`;
}

function mapToRiskLevel(pct: number): RiskLevel {
  if (pct >= 50) return "high";
  if (pct >= 30) return "medium";
  return "low";
}

function mapBackendItemToSummary(item: BackendEmployeeItem): EmployeeSummary {
  const pct = item.risk_score_percentage ?? 0;
  const idNum = Number(item.employee_id);
  const name = item.name || generateEmployeeName(idNum);

  return {
    id: String(item.employee_id),
    name,
    department: item.Department || "N/A",
    jobRole: item.JobRole || "N/A",
    tenureYears: item.YearsAtCompany ?? 0,
    monthlyIncome: item.MonthlyIncome,
    overTime: item.OverTime,
    jobSatisfaction: item.JobSatisfaction,
    workLifeBalance: item.WorkLifeBalance,
    riskScore: Math.round(pct * 10) / 10,
    riskLevel: mapToRiskLevel(pct),
    topFactors: item.top_factor ? [item.top_factor] : ["OverTime"],
  };
}

const employeesCache = new Map<string, { data: GetEmployeesResult; timestamp: number }>();

/**
 * GET /api/employees
 * Returns all employees with risk scores for full client-side filtering & sorting.
 */
export async function getEmployees(
  options: GetEmployeesOptions = {}
): Promise<GetEmployeesResult> {
  const {
    department,
    search,
    sortBy = "risk_score_percentage",
    order = "desc",
    page = 1,
    limit = 1500,
  } = options;

  const queryParams = new URLSearchParams();
  if (department) queryParams.set("department", department);
  if (search) queryParams.set("search", search);
  queryParams.set("sort_by", sortBy);
  queryParams.set("order", order);
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));

  const url = `/api/employees?${queryParams.toString()}`;
  const now = Date.now();

  if (employeesCache.has(url)) {
    const cached = employeesCache.get(url)!;
    if (now - cached.timestamp < 300000) {
      return cached.data;
    }
  }

  const res = await apiRequest<BackendEmployeesResponse>(url);

  const items = (res.data || []).map(mapBackendItemToSummary);

  const result: GetEmployeesResult = {
    employees: items,
    total: res.meta?.total ?? items.length,
    page: res.meta?.page ?? 1,
    totalPages: res.meta?.total_pages ?? 1,
  };

  employeesCache.set(url, { data: result, timestamp: now });
  return result;
}
