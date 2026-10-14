"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { faNum } from "@/lib/format";

type SessionLite = { id: number; fullName: string; role: string } | null;

type NavItem = { href: string; label: string; children?: { href: string; label: string; desc?: string }[] };

const NAV: NavItem[] = [
  { href: "/", label: "خانه" },
  {
    href: "/services", label: "خدمات",
    children: [
      { href: "/services/work-permit", label: "💼 مهاجرت کاری", desc: "جاب‌آفر، Blue Card" },
      { href: "/services/study-admission", label: "🎓 مهاجرت تحصیلی", desc: "پذیرش و بورسیه" },
      { href: "/services/golden-visa", label: "🏆 گلدن ویزا", desc: "اقامت ۱۰ ساله" },
      { href: "/services/company-registration", label: "🏢 ثبت شرکت", desc: "Kft با مالیات ۹٪" },
      { href: "/services/realestate", label: "🏠 خرید ملک", desc: "بوداپست و شهرستان" },
      { href: "/services", label: "همه خدمات ←", desc: "۲۴ خدمت تخصصی" },
    ],
  },
  {
    href: "/hungary", label: "مجارستان",
    children: [
      { href: "/hungary/why", label: "⭐ چرا مجارستان؟", desc: "مقایسه با آلمان و کانادا" },
      { href: "/hungary/cities", label: "🏙️ شهرها", desc: "بوداپست، دبرسن، سگد..." },
      { href: "/hungary/cost-of-living", label: "🧾 هزینه زندگی", desc: "جدول دقیق ماهانه" },
      { href: "/hungary/study", label: "🎓 تحصیل", desc: "دانشگاه‌ها و بورسیه" },
      { href: "/hungary/work", label: "💼 کار", desc: "حقوق و قوانین ۲۰۲۶" },
      { href: "/hungary", label: "همه راهنماها ←", desc: "۱۳ راهنمای موضوعی" },
    ],
  },
  {
    href: "/process", label: "فرآیند",
    children: [
      { href: "/process/steps", label: "👣 مراحل کلی", desc: "۷ گام تا استقرار" },
      { href: "/process/documents", label: "📄 مدارک", desc: "لیست هر ویزا" },
      { href: "/process/costs", label: "💰 هزینه‌ها", desc: "جدول شفاف" },
      { href: "/process/timeline", label: "⏱️ زمان‌بندی", desc: "تخمین هر مسیر" },
      { href: "/process/faq", label: "❓ سوالات متداول", desc: "۲۴ پاسخ" },
    ],
  },
  {
    href: "/tools", label: "ابزارها",
    children: [
      { href: "/assess", label: "🎯 ارزیاب شانس", desc: "۲ دقیقه‌ای رایگان" },
      { href: "/tools/calculator", label: "🧮 محاسبه‌گر هزینه", desc: "یورو + تومان" },
      { href: "/tools/checklist", label: "✅ چک‌لیست مدارک", desc: "با ذخیره پیشرفت" },
      { href: "/tools/comparison", label: "⚖️ مقایسه مسیرها", desc: "۵ مسیر" },
      { href: "/tools/calendar", label: "📅 تقویم مهاجرتی", desc: "مهلت‌ها + یادآور" },
      { href: "/track", label: "🔍 پیگیری پرونده", desc: "با کد رهگیری" },
    ],
  },
  { href: "/news", label: "وبلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
];

export function SiteHeader({ user }: { user: SessionLite }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const panelHref = user?.role === "admin" ? "/admin" : user?.role === "expert" ? "/expert" : "/dashboard";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070d]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-black text-[#04120d] shadow-lg shadow-emerald-500/30">
            MH
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold">مجارنشین</span>
            <span className="block text-[10px] text-white/45">Iran–Hungary Smart Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <div key={item.href + item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] transition ${
                    active ? "bg-emerald-400/10 text-emerald-300" : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.children && <span className="text-[9px] text-white/35">▾</span>}
                </Link>
                {item.children && (
                  <div className="invisible absolute right-0 top-full z-50 w-64 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0b111f]/95 p-2 shadow-2xl backdrop-blur-xl">
                      {item.children.map((c) => (
                        <Link key={c.href + c.label} href={c.href} className="block rounded-xl px-3 py-2.5 transition hover:bg-white/5">
                          <span className="block text-[13px] font-bold text-white/85">{c.label}</span>
                          {c.desc && <span className="block text-[11px] text-white/40">{c.desc}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {user ? (
            <>
              <Link href={panelHref} className="btn btn-ghost !py-2 !text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-300">
                  {user.fullName.slice(0, 2)}
                </span>
                {faNum(user.fullName.split(" ")[0])}
              </Link>
              <button onClick={logout} className="btn btn-ghost !py-2 !text-xs">خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost !py-2 !text-xs">ورود</Link>
              <Link href="/assess" className="btn btn-primary !py-2 !text-xs">🎯 مشاوره رایگان</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="منو" className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 xl:hidden">
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-white/10 bg-[#080c16] px-4 py-3 xl:hidden">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <div key={item.href + item.label}>
                <div className="flex items-center gap-1">
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex-1 rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button onClick={() => setExpanded(expanded === item.label ? null : item.label)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-xs" aria-label="زیرمنو">
                      {expanded === item.label ? "▴" : "▾"}
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <div className="mb-1 mr-4 space-y-0.5 border-r border-white/10 pr-2">
                    {item.children.map((c) => (
                      <Link key={c.href + c.label} href={c.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-[13px] text-white/60 hover:bg-white/5">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
              {user ? (
                <>
                  <Link href={panelHref} onClick={() => setOpen(false)} className="btn btn-primary flex-1 !py-2 !text-xs">پنل من</Link>
                  <button onClick={logout} className="btn btn-ghost flex-1 !py-2 !text-xs">خروج</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost flex-1 !py-2 !text-xs">ورود</Link>
                  <Link href="/assess" onClick={() => setOpen(false)} className="btn btn-primary flex-1 !py-2 !text-xs">🎯 مشاوره رایگان</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
