import type { ChatMessage } from "@/lib/api/types";
import { ChatSourceBadge } from "@/components/chat/ChatSourceBadge";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      {message.source && <ChatSourceBadge source={message.source} />}
      <div
        className={`max-w-[88%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
          isUser
            ? "bg-[#006FEE] text-white font-semibold shadow-xs"
            : "border border-slate-200 bg-slate-50 text-slate-800 font-medium"
        }`}
      >
        {message.content || (
          <span className="text-slate-400 font-mono animate-pulse">Sedang memproses...</span>
        )}
      </div>
    </div>
  );
}
