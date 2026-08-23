"use client";

import { useRef, useEffect } from "react";
import { ChatMessageBubble } from "@/features/chat/components/ChatMessageBubble";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { useChat } from "@/lib/hooks/useChat";

interface ChatPanelProps {
  employeeId: string;
}

/**
 * Small AI assistant panel embedded in the employee detail view (PRD §3).
 * The agent decides per-question whether to answer from model output or
 * retrieve HR policy — ChatSourceBadge in each reply makes that visible.
 */
export function ChatPanel({ employeeId }: ChatPanelProps) {
  const { messages, isStreaming, error, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Tanya HR Assistant
      </h3>

      {messages.length > 0 && (
        <div ref={scrollRef} className="flex max-h-72 flex-col gap-3 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-signal-high">
          Gagal menghubungi HR Assistant. Coba lagi.
        </p>
      )}

      <ChatInput
        isDisabled={isStreaming}
        onSubmit={(message) => sendMessage(employeeId, message)}
      />
    </div>
  );
}
