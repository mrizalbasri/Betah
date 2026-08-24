"use client";

import { useRef, useEffect } from "react";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/lib/hooks/useChat";

interface ChatPanelProps {
  employeeId: string;
}

export function ChatPanel({ employeeId }: ChatPanelProps) {
  const { messages, isStreaming, error, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4">
      <h3 className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
        Tanya HR AI Assistant
      </h3>

      {messages.length > 0 && (
        <div ref={scrollRef} className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 font-medium">
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
