"use client";

import { useState } from "react";
import { faNum } from "@/lib/format";

const TABS = [
  { key: "home", label: "خانه", icon: "🏠" },
  { key: "docs", label: "مدارک", icon: "📄" },
  { key: "chat", label: "چت", icon: "💬" },
  { key: "pay", label: "پرداخت", icon: "💳" },
  { key: "ai", label: "دستیار", icon: "🤖" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AppPreview() {
  const [tab, setTab] = useState<TabKey>("home");

  return (
    <div className="phone-shell mx-auto h-[640px] w-[320px] bg-[#070b14] p-4">
      <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-white/20" />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-[10px] font-black text-[#04120d]">
            MH
          </span>
          <div>
            <p className="text-[11px] text-white/45">سلام سارا 👋</p>
            <p className="text-[12px] font-bold">پرونده MH-2026-1042</p>
          </div>
        </div>
        <span className="relative grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-sm">
          🔔
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-400" />
        </span>
      </div>

      <div className="mt-4 h-[470px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        {tab === "home" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-400/10 p-4">
              <p className="text-[10px] text-emerald-300">مرحله ۴ از ۷</p>
              <p className="mt-1 text-[13px] font-bold">اپلای و ارسال به مجارستان</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-l from-emerald-400 to-sky-400" />
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-white/45">
                <span>۶۲٪ تکمیل</span>
                <span>شانس موفقیت {faNum(84)}٪</span>
              </div>
            </div>

            {[
              { t: "مصاحبه کاری دوشنبه ۱۰:۰۰", i: "📅", s: "یادآوری ۲ روز مانده" },
              { t: "مدرک «پرینت حساب» نیاز به اصلاح", i: "⚠️", s: "کارشناس: رضا کریمی" },
              { t: "فاکتور قسط دوم صادر شد", i: "💳", s: "۲,۱۰۰ یورو" },
            ].map((n) => (
              <div key={n.t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[12px]">
                  {n.i} {n.t}
                </p>
                <p className="mt-1 text-[9px] text-white/40">{n.s}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/45">چک‌لیست هوشمند مدارک</p>
              <div className="mt-2 space-y-1.5">
                {[
                  ["پاسپورت", true],
                  ["مدارک تحصیلی", true],
                  ["رزومه انگلیسی", false],
                  ["پرینت حساب", false],
                ].map(([label, done]) => (
                  <div key={String(label)} className="flex items-center justify-between text-[11px]">
                    <span className={done ? "text-emerald-300" : "text-white/55"}>
                      {done ? "✓" : "○"} {label}
                    </span>
                    <span className="text-[9px] text-white/30">{done ? "تأیید شده" : "در انتظار"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "docs" && (
          <div className="space-y-2">
            <button className="w-full rounded-2xl border border-dashed border-emerald-400/40 bg-emerald-400/5 p-4 text-[11px] text-emerald-300">
              📷 بارگذاری با دوربین / آپلود فایل
            </button>
            {[
              ["پاسپورت (صفحه اول)", "approved"],
              ["مدارک تحصیلی + ترجمه", "approved"],
              ["رزومه انگلیسی", "pending"],
              ["پرینت حساب بانکی", "rejected"],
            ].map(([name, status]) => (
              <div key={String(name)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px]">{name}</p>
                <p
                  className={`mt-1 text-[9px] ${
                    status === "approved"
                      ? "text-emerald-300"
                      : status === "rejected"
                        ? "text-rose-300"
                        : "text-amber-300"
                  }`}
                >
                  {status === "approved" ? "تأیید شده ✓" : status === "rejected" ? "نیاز به اصلاح ✕" : "در بررسی ⏳"}
                </p>
              </div>
            ))}
            <p className="pt-1 text-center text-[9px] text-white/30">OCR و ترجمه خودکار فعال است</p>
          </div>
        )}

        {tab === "chat" && (
          <div className="space-y-2">
            <div className="ms-auto max-w-[85%] rounded-2xl bg-emerald-400/15 p-2.5 text-[11px] leading-6">
              سلام، مصاحبه دوشنبه ساعت ۱۰ تنظیم شد.
            </div>
            <div className="me-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 text-[11px] leading-6">
              ممنون! چه مدارکی آماده کنم؟
            </div>
            <div className="ms-auto max-w-[85%] rounded-2xl bg-emerald-400/15 p-2.5 text-[11px] leading-6">
              پاسپورت، پرینت حساب و نسخه چاپی قرارداد کاری.
            </div>
            <div className="mt-3 flex gap-1.5">
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-[10px] text-white/30">
                پیام…
              </div>
              <div className="grid w-9 place-items-center rounded-xl bg-emerald-400 text-[#04120d]">➤</div>
            </div>
            <p className="pt-1 text-center text-[9px] text-white/30">ترجمه خودکار پیام: فعال 🇭🇺</p>
          </div>
        )}

        {tab === "pay" && (
          <div className="space-y-2">
            {[
              ["پرداخت اولیه اقامت کاری", "2,100 €", "پرداخت شده"],
              ["قسط دوم پس از مجوز کار", "2,100 €", "در انتظار"],
            ].map(([t, amount, status]) => (
              <div key={String(t)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[11px]">{t}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-amber-300">{amount}</span>
                  <span className="text-[9px] text-white/40">{status}</span>
                </div>
              </div>
            ))}
            <button className="w-full rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 py-2.5 text-[11px] font-bold text-[#04120d]">
              پرداخت آنلاین (زرین‌پال / Stripe)
            </button>
            <p className="pt-1 text-center text-[9px] text-white/30">امضای دیجیتال قرارداد: فعال ✍️</p>
          </div>
        )}

        {tab === "ai" && (
          <div className="space-y-2">
            <div className="me-auto max-w-[90%] rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 text-[11px] leading-6">
              شانس پرونده من چقدر است؟
            </div>
            <div className="ms-auto max-w-[90%] rounded-2xl bg-emerald-400/15 p-2.5 text-[11px] leading-6">
              امتیاز فعلی {faNum(84)} از ۱۰۰. با رسیدن زبان به B2، به {faNum(91)} می‌رسد. 🚀
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {["هزینه‌ها", "زمان ویزا", "مدارک", "بورسیه"].map((q) => (
                <div key={q} className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-center text-[10px] text-white/60">
                  {q}
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px] text-white/45">دستیار صوتی فارسی</p>
              <p className="mt-2 text-center text-2xl">🎙️</p>
              <p className="mt-1 text-center text-[9px] text-white/30">برای پرسش نگه دارید</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[9px] transition ${
              tab === t.key ? "bg-emerald-400/15 text-emerald-300" : "text-white/40"
            }`}
          >
            <span className="text-sm">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
