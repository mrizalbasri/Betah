"use client";

import { useCallback, useRef, useState } from "react";
import { postChatMessage } from "@/lib/api/postChatMessage";
import type { ChatMessage } from "@/lib/api/types";

interface UseChatResult {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: Error | null;
  sendMessage: (employeeId: string, message: string) => Promise<void>;
}

/**
 * Drives the Ask HR Assistant panel (PRD §3, §9): sends a question for a
 * given employee and streams the agent's reply, including which tool
 * (query_model_output vs retrieve_hr_policy) it decided to use.
 *
 * Resets when the panel switches employees — callers should re-mount or
 * clear `messages` externally on employeeId change if needed.
 */
export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (employeeId: string, message: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      };
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setError(null);
      setIsStreaming(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      await postChatMessage(
        { employeeId, message },
        {
          onSource: (source) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, source } : m
              )
            );
          },
          onTextChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m
              )
            );
          },
          onError: (err) => setError(err),
        },
        controller.signal
      );

      setIsStreaming(false);
    },
    []
  );

  return { messages, isStreaming, error, sendMessage };
}
