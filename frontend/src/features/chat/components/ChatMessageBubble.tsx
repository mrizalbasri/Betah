import type { ChatMessage } from "@/lib/api/types";
import { ChatSourceBadge } from "@/features/chat/components/ChatSourceBadge";

/** Renders one turn of the conversation, aligned by role. */
export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      {message.source && <ChatSourceBadge source={message.source} />}
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-ink text-paper"
            : "border border-line bg-panel text-ink"
        }`}
      >
        {message.content || (
          <span className="text-ink-soft">…</span>
        )}
      </div>
    </div>
  );
}
