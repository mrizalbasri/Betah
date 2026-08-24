/**
 * Centralized HTTP client.
 *
 * This is the ONLY place that knows how to reach the FastAPI backend
 * (base URL, headers, error shape). Every function in lib/api/*.ts calls
 * `apiRequest` instead of `fetch` directly — so if auth headers, retries,
 * or the base URL change, this is the single file to edit.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${endpoint} failed with status ${response.status}`,
      response.status,
      endpoint
    );
  }

  return response.json() as Promise<TResponse>;
}
