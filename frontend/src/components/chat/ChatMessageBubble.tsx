import type { ChatMessage } from "@/lib/api/types";
import { ChatSourceBadge } from "@/components/chat/ChatSourceBadge";

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[11px] text-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMarkdownText({ content }: { content: string }) {
  if (!content) return null;

  const cleaned = content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\[Target Karyawan ID:\s*\d+\]/gi, "")
    .replace(/[\u4e00-\u9fa5\u3400-\u4dbf]+/g, "")
    .trim();
  const lines = cleaned.split("\n");

  return (
    <div className="space-y-1 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        // Header: # Header, ## Header, ### Header
        if (/^#{1,6}\s+/.test(trimmed)) {
          const headerText = trimmed.replace(/^#{1,6}\s+/, "");
          return (
            <div key={lineIdx} className="font-bold text-slate-900 mt-1.5 mb-0.5 text-[12.5px]">
              {parseInlineMarkdown(headerText)}
            </div>
          );
        }

        // Bullet list: - item, * item, • item
        if (/^[-*•]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 ml-1">
              <span className="text-[#006FEE] font-bold select-none">•</span>
              <span className="flex-1">{parseInlineMarkdown(itemText)}</span>
            </div>
          );
        }

        // Numbered list: 1. item
        if (/^\d+\.\s+/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
          if (match) {
            return (
              <div key={lineIdx} className="flex items-start gap-1.5 ml-1">
                <span className="font-bold text-[#006FEE] text-[11px] shrink-0">{match[1]}</span>
                <span className="flex-1">{parseInlineMarkdown(match[2])}</span>
              </div>
            );
          }
        }

        // Regular line
        return (
          <div key={lineIdx}>
            {parseInlineMarkdown(trimmed)}
          </div>
        );
      })}
    </div>
  );
}

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
        {message.content ? (
          isUser ? (
            message.content.replace(/\[Target Karyawan ID:\s*\d+\]/gi, "").trim()
          ) : (
            <FormattedMarkdownText content={message.content} />
          )
        ) : (
          <span className="text-slate-400 font-mono animate-pulse">Sedang memproses...</span>
        )}
      </div>
    </div>
  );
}
