import type { ChatRequest, ChatSource } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface ChatStreamCallbacks {
  /** Called once, as soon as the agent reports which tool it used (if any). */
  onSource?: (source: ChatSource) => void;
  /** Called for each incremental text chunk of the assistant's reply. */
  onTextChunk: (chunk: string) => void;
  onError?: (error: Error) => void;
}

/**
 * POST /api/chat
 * Streams the agent's reply for one employee via Server-Sent Events.
 *
 * NOTE: this is a minimal fetch-based SSE reader, not the Vercel AI SDK
 * (`ai` / `@ai-sdk/react`) referenced in the PRD — that dependency isn't
 * installed yet and the exact wire format needs to be agreed with the
 * backend team first (see API contract §7 open questions). Swap this
 * implementation for `@ai-sdk/react`'s `useChat` once that's settled;
 * callers only depend on `ChatStreamCallbacks`, so the swap stays local
 * to this file.
 *
 * Expected event stream shape (one JSON object per SSE `data:` line):
 *   { "type": "source", "tool": "...", "detail"?: "..." }
 *   { "type": "text", "value": "...chunk..." }
 */
export async function postChatMessage(
  request: ChatRequest,
  callbacks: ChatStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { onSource, onTextChunk, onError } = callbacks;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(request),
      signal,
    });
  } catch (err) {
    onError?.(err as Error);
    return;
  }

  if (!response.ok || !response.body) {
    const error = new ApiError(
      `Request to /api/chat failed with status ${response.status}`,
      response.status,
      "/api/chat"
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

        const payload = trimmed.slice("data:".length).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload) as
            | { type: "source"; tool: ChatSource["tool"]; detail?: string }
            | { type: "text"; value: string };

          if (parsed.type === "source") {
            onSource?.({ tool: parsed.tool, detail: parsed.detail });
          } else if (parsed.type === "text") {
            onTextChunk(parsed.value);
          }
        } catch {
          // Skip malformed SSE frames rather than aborting the whole stream.
        }
      }
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      onError?.(err as Error);
    }
  }
}
