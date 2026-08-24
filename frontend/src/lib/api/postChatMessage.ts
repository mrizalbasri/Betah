import type { ChatRequest, ChatSource } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface ChatStreamCallbacks {
  /** Called once, as soon as the agent reports tool execution metadata. */
  onSource?: (source: ChatSource) => void;
  /** Called for each incremental text chunk of the assistant's reply. */
  onTextChunk: (chunk: string) => void;
  onError?: (error: Error) => void;
}

/**
 * POST /api/chat/stream
 * Streams the AI agent reply via Server-Sent Events (SSE).
 */
export async function postChatMessage(
  request: ChatRequest,
  callbacks: ChatStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onSource, onTextChunk, onError } = callbacks;

  const numericEmpId = request.employeeId ? parseInt(request.employeeId, 10) : undefined;
  const payload = {
    message: request.message,
    employee_id: isNaN(numericEmpId as number) ? undefined : numericEmpId,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      onError?.(err as Error);
    }
    return;
  }

  if (!response.ok || !response.body) {
    const error = new ApiError(
      `Request to /api/chat/stream failed with status ${response.status}`,
      response.status,
      "/api/chat/stream"
    );
    onError?.(error);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payloadStr = trimmed.slice("data:".length).trim();
        if (!payloadStr || payloadStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payloadStr) as
            | { type: "meta"; tools_called?: string[]; employee_id?: number }
            | { type: "chunk"; content?: string }
            | { type: "error"; message?: string };

          if (parsed.type === "meta") {
            const tools = parsed.tools_called || [];
            let toolName: ChatSource["tool"] = "unknown";
            if (tools.includes("retrieve_hr_policy")) {
              toolName = "retrieve_hr_policy";
            } else if (tools.includes("query_model_output")) {
              toolName = "query_model_output";
            } else if (tools.length > 0) {
              toolName = tools[0] as ChatSource["tool"];
            }

            onSource?.({
              tool: toolName,
              detail: tools.join(", ") || "FastAPI LangGraph Agent",
            });
          } else if (parsed.type === "chunk" && parsed.content) {
            onTextChunk(parsed.content);
          } else if (parsed.type === "error") {
            onError?.(new Error(parsed.message || "Error pada SSE stream"));
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      onError?.(err as Error);
    }
  }
}
