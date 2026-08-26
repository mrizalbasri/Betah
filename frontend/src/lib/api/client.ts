/**
 * Centralized HTTP client.
 *
 * This is the ONLY place that knows how to reach the FastAPI backend
 * (base URL, headers, error shape). Every function in lib/api/*.ts calls
 * `apiRequest` instead of `fetch` directly — so if auth headers, retries,
 * or the base URL change, this is the single file to edit.
 */

const rawUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

// Ensure API_BASE_URL has no trailing slash or trailing /api
export const API_BASE_URL = rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("betah_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 401 && typeof window !== "undefined") {
    // Clear stale session on auth failure
    localStorage.removeItem("betah_token");
    localStorage.removeItem("betah_user");
  }

  if (!response.ok) {
    throw new ApiError(
      `Request to ${endpoint} failed with status ${response.status}`,
      response.status,
      endpoint
    );
  }

  return response.json() as Promise<TResponse>;
}
