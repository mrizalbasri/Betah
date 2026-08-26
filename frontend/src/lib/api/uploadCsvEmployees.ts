import { ApiError, API_BASE_URL } from "@/lib/api/client";

export interface CsvUploadSummary {
  total_employees: number;
  high_risk_count: number;
  avg_risk_percentage: number;
}

export interface CsvUploadResponse {
  status: string;
  message: string;
  summary: CsvUploadSummary;
}

export async function uploadCsvEmployees(file: File): Promise<CsvUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("betah_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const endpoint = "/api/v1/employees/upload-csv";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Gagal mengunggah CSV (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (json.detail) message = json.detail;
    } catch {
      // fallback
    }
    throw new ApiError(message, response.status, endpoint);
  }

  return response.json();
}

export function getCsvTemplateUrl(): string {
  return `${API_BASE_URL}/api/v1/employees/template-csv`;
}
