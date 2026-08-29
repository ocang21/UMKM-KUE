'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  "Rekomendasi kue untuk arisan 🥐",
  "Kue tradisional khas Bugis 🍌",
  "Pilihan kue di bawah Rp 5.000 💰",
  "Bagaimana cara memesan & ambil? 📅",
  "Alamat & jam buka toko 📍",
];

export default function AIChatBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Halo! Saya **Chef Pastry AI** 🧁✨\nAda yang bisa saya bantu terkait pilihan kue, rekomendasi acara, atau cara pemesanan hari ini?",
      time: "Baru saja",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          currentPath: pathname || window.location.pathname,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.reply || "Maaf, terjadi kendala saat memuat jawaban.",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "Maaf, jaringan sedang sibuk. Silakan hubungi kami langsung via WhatsApp untuk bantuan cepat ya! 📱✨",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk format teks tebal **bold** dan list
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Parse **bold**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={line.trim() === "" ? "h-2" : "mb-1 last:mb-0 leading-relaxed"}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx} className="font-bold text-primary-950">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] md:w-[410px] h-[480px] sm:h-[540px] max-h-[78vh] bg-white rounded-2xl shadow-warm-xl border border-cream-300 flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-cream-50 p-3 sm:p-4 flex items-center justify-between border-b border-primary-700/50">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream-100 flex items-center justify-center text-lg sm:text-xl border-2 border-accent-gold shadow-sm">
                  🧁
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-primary-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-cream-50 flex items-center gap-1.5">
                  Chef Pastry AI
                  <span className="text-[9px] sm:text-[10px] bg-accent-gold text-primary-950 px-1.5 py-0.2 rounded font-sans font-bold uppercase">
                    AI
                  </span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-cream-200/80">Asisten Rekomendasi Toko Kue</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-cream-100 flex items-center justify-center text-xs sm:text-sm font-bold transition"
              aria-label="Tutup Chat"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-cream-100/90 border-b border-cream-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-accent-amber flex-shrink-0">Tanya Cepat:</span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-cream-50 text-[11px] font-medium text-primary-900 border border-cream-300 shadow-2xs transition hover:scale-[1.02] flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-cream-50/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-warm-sm ${
                    msg.sender === "user"
                      ? "bg-primary-800 text-cream-50 rounded-tr-none font-medium"
                      : "bg-white text-neutral-800 border border-cream-200 rounded-tl-none font-normal"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-cream-300 rounded-2xl rounded-tl-none px-4 py-3 shadow-warm-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-gold animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-accent-gold animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-accent-gold animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Action / Direct Order Shortcut */}
          <div className="bg-cream-100 px-3 py-1.5 flex justify-between items-center text-[11px] border-t border-cream-200">
            <span className="text-neutral-500">Siap memesan kue?</span>
            <Link
              href="/order"
              onClick={() => setIsOpen(false)}
              className="text-primary-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Formulir Pesanan</span>
              <span>→</span>
            </Link>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-cream-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan kue, harga, rekomendasi..."
              className="flex-1 px-3.5 py-2 text-xs rounded-full border border-cream-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none bg-cream-50/60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-primary-800 hover:bg-primary-900 active:scale-95 text-cream-50 flex items-center justify-center transition disabled:opacity-40 flex-shrink-0 shadow-warm-sm"
              aria-label="Kirim Pesan"
            >
              <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Gelembung Icon Utama (Floating Action Bubble) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-primary-900 to-primary-800 text-cream-50 p-3 sm:px-4 sm:py-3 rounded-full shadow-warm-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-accent-gold cursor-pointer"
        aria-label="Buka Chat AI Toko Kue"
      >
        {/* Animated Glow Halo */}
        <span className="absolute -inset-1 rounded-full bg-accent-gold/30 blur-sm group-hover:bg-accent-gold/50 transition duration-500 animate-pulse"></span>

        {/* Icon Avatar */}
        <div className="relative w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-lg border border-accent-gold flex-shrink-0 shadow-inner">
          {isOpen ? "✕" : "🧁"}
        </div>

        {/* Label Teks (Responsive) */}
        <div className="relative hidden sm:flex flex-col text-left pr-1">
          <span className="text-xs font-display font-bold leading-none text-cream-50 flex items-center gap-1">
            Tanya Chef AI
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          </span>
          <span className="text-[10px] text-accent-goldLight font-sans mt-0.5">Rekomendasi & Menu</span>
        </div>
      </button>
    </div>
  );
}
