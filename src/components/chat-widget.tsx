"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string; sources?: { title: string; slug: string }[] };

const QUICK = [
  "هزینه اقامت کاری چقدر است؟",
  "گلدن ویزا چیست؟",
  "شرایط پذیرش پزشکی؟",
  "چه مدارکی لازم است؟",
  "زمان صدور ویزا چند ماه؟",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text:
        "سلام 👋 من «دستیار هوشمند مجارنشین» هستم و ۲۴ ساعته پاسخ‌گو هستم.\nدرباره اقامت کاری، تحصیل، گلدن ویزا، ثبت شرکت، املاک و گمرک هر سوالی دارید بپرسید.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send(text: string) {
    const query = text.trim();
    if (!query || loading) return;
    setMsgs((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as { reply?: string; sources?: Msg["sources"]; error?: string };
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply ?? data.error ?? "خطا در پردازش، دوباره تلاش کنید.",
          sources: data.sources,
        },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "ارتباط با سرور برقرار نشد." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 px-4 py-3 text-sm font-extrabold text-[#04120d] shadow-2xl shadow-emerald-500/40 pulse-ring"
      >
        <span className="text-lg">{open ? "✕" : "🤖"}</span>
        <span className="hidden sm:inline">دستیار هوشمند</span>
      </button>

      {open && (
        <div className="fixed bottom-24 left-3 z-[60] flex h-[520px] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#080c16]/95 shadow-2xl backdrop-blur-xl rise">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-lg">🤖</span>
              <div>
                <p className="text-sm font-bold">دستیار هوشمند مجارنشین</p>
                <p className="flex items-center gap-1 text-[10px] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> آنلاین — فارسی / English / Magyar
                </p>
              </div>
            </div>
            <Link href="/assess" className="text-[10px] text-white/50 hover:text-white">
              ارزیابی پرونده ↗
            </Link>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-start" : "flex justify-end"}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-6 ${
                    m.role === "user"
                      ? "bg-emerald-400/15 text-emerald-50"
                      : "border border-white/10 bg-white/[0.04] text-white/85"
                  }`}
                >
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
                      {m.sources.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="badge !text-[10px] hover:border-emerald-400/50"
                        >
                          {s.title} ↗
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="badge shrink-0 !text-[10px] hover:border-emerald-400/50 hover:text-emerald-200"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="سوال خود را بنویسید…"
                className="field !py-2.5 !text-[13px]"
              />
              <button type="submit" className="btn btn-primary !px-4 !py-2.5 !text-xs">
                ارسال
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
