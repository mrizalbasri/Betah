import type { EmployeeSummary } from "@/lib/api/types";

export function exportEmployeesToCsv(employees: EmployeeSummary[], filename = "betah_employee_attrition_risk.csv") {
  if (!employees || employees.length === 0) return;

  const headers = ["Worker ID", "Name", "Department", "Job Role", "Tenure (Years)", "Monthly Income", "OverTime", "Risk Score (%)", "Risk Tier", "Top Factors"];

  const rows = employees.map((emp) => [
    `#${emp.id}`,
    `"${emp.name.replace(/"/g, '""')}"`,
    `"${emp.department.replace(/"/g, '""')}"`,
    `"${emp.jobRole.replace(/"/g, '""')}"`,
    emp.tenureYears,
    emp.monthlyIncome ?? 0,
    emp.overTime ?? "No",
    `${emp.riskScore}%`,
    emp.riskLevel.toUpperCase(),
    `"${emp.topFactors.join("; ").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
