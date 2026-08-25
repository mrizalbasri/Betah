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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Modal Window */}
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006FEE] text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans text-xs font-bold leading-none text-white">
                  AI HR Assistant
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 font-bold" />
                  LangGraph RAG SSE Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body / Chat Stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-500">
                <Bot className="h-10 w-10 text-[#006FEE] mb-2" />
                <p className="font-sans text-xs font-bold text-slate-900">Halo, Sri Rahayu!</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[260px]">
                  Tanyakan kebijakan retensi HR, analisis faktor SHAP, atau opsi program insentif.
                </p>

                {/* Quick Suggestion Pills */}
                <div className="flex flex-col gap-1.5 w-full mt-4">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="w-full cursor-pointer text-left rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 font-medium hover:border-blue-500 hover:text-[#006FEE] transition-all shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))
            )}

            {error && (
              <p className="text-xs text-rose-600 font-medium font-sans text-center">
                Gagal terhubung ke AI Assistant. Coba lagi.
              </p>
            )}
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-slate-200 bg-white p-3 flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tanya HR AI Assistant..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-sans text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#006FEE] focus:bg-white focus:ring-1 focus:ring-[#006FEE]"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputVal.trim()}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-lime-400 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Tanya HR AI"
        className="flex items-center gap-2.5 cursor-pointer rounded-full bg-lime-400 px-4 py-3 text-slate-950 font-bold text-xs shadow-xl shadow-lime-500/30 hover:bg-lime-300 transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <>
            <X className="h-5 w-5" />
            <span>Tutup Chat</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Tanya HR AI</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          </>
        )}
      </button>
    </div>
  );
}
