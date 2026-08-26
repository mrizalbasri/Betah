"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { useChat } from "@/lib/hooks/useChat";

const QUICK_PROMPTS = [
  "Bagaimana kebijakan lembur HR?",
  "Opsi retensi untuk tim Sales?",
  "Faktor utama risiko resign?",
];

export function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { messages, isStreaming, error, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleSend = (text?: string) => {
    const query = (text || inputVal).trim();
    if (!query || isStreaming) return;
    sendMessage("all", query);
    setInputVal("");
  };

  return (
    <div className="fixed bottom-5 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Modal Window */}
      {isOpen && (
        <div className="mb-3 flex h-[480px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FEE] text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="font-sans text-xs font-bold leading-none text-white">
                  AI HR Assistant
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-1">
                  LangGraph RAG SSE Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="border-b border-slate-100 bg-slate-50 p-2 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
                Saran:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:border-[#006FEE] hover:text-[#006FEE] transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-slate-200 bg-white p-2.5 flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tanya HR AI Assistant..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-sans text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#006FEE] focus:bg-white focus:ring-1 focus:ring-[#006FEE]"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputVal.trim()}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-lime-400 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Tanya HR AI"
        className="flex items-center gap-2 cursor-pointer rounded-full bg-slate-900 px-3.5 py-2 text-white font-bold text-xs shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 border border-slate-800"
      >
        {isOpen ? (
          <>
            <X className="h-3.5 w-3.5" />
            <span>Tutup Chat</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5 text-lime-400" />
            <span>Tanya HR AI</span>
          </>
        )}
      </button>
    </div>
  );
}
