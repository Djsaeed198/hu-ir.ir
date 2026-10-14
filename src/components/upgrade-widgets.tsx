"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { faNum } from "@/lib/format";
import type { Faq, SampleVisa, Testimonial } from "@/lib/upgrade-content";
import { FAQ_CATEGORIES, MIGRATION_CALENDAR } from "@/lib/upgrade-content";
import { MEDIA, TEAM_AVATARS, type MediaItem } from "@/lib/media";
import { AvatarImage, SmartImage } from "@/components/smart-image";

const VISA_IMAGES: { match: string[]; media: MediaItem }[] = [
  { match: ["کاری", "Blue", "آبی"], media: MEDIA.passportStamps },
  { match: ["تحصیلی", "دانشجو"], media: MEDIA.graduationGroup },
  { match: ["گلدن"], media: MEDIA.handshakeEstate },
  { match: ["شرکت", "خوداشتغالی"], media: MEDIA.businessFinance },
  { match: ["همراه", "خانواده"], media: MEDIA.airportWoman },
];

function visaImage(type: string, i: number): MediaItem {
  const found = VISA_IMAGES.find((v) => v.match.some((m) => type.includes(m)));
  if (found) return found.media;
  const pool = [MEDIA.passportSeat, MEDIA.euPassports, MEDIA.airportSuitcase, MEDIA.contractSigning];
  return pool[i % pool.length];
}

const AVATAR_POOL = [TEAM_AVATARS.ceo, TEAM_AVATARS.studyExpert, TEAM_AVATARS.workExpert, TEAM_AVATARS.lawyer, TEAM_AVATARS.support1, TEAM_AVATARS.support2];

/* ---------- آکاردئون FAQ ---------- */
export function FaqAccordion({ items, showFilter = true }: { items: Faq[]; showFilter?: boolean }) {
  const [cat, setCat] = useState<string>("همه");
  const [open, setOpen] = useState<number | null>(0);
  const cats = ["همه", ...FAQ_CATEGORIES.filter((c) => items.some((i) => i.category === c))];
  const filtered = cat === "همه" ? items : items.filter((i) => i.category === cat);

  return (
    <div>
      {showFilter && (
        <div className="mb-5 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setOpen(0); }}
              className={`badge cursor-pointer !py-1.5 ${cat === c ? "!border-emerald-400/50 !text-emerald-300" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {filtered.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`glass !rounded-2xl p-0 transition ${isOpen ? "!border-emerald-400/40" : ""}`}>
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-3 p-4 text-right">
                <span className="text-sm font-bold">{f.q}</span>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 text-xs transition ${isOpen ? "rotate-45 text-emerald-300" : ""}`}>＋</span>
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-4 py-4 text-[13px] leading-7 text-white/65 rise">
                  <span className="badge mb-2 !text-[10px] text-white/45">{f.category}</span>
                  <p>{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- محاسبه‌گر هزینه ---------- */
const BASE_PRICES: Record<string, { label: string; price: number; gov: number }> = {
  work: { label: "مهاجرت کاری", price: 3000, gov: 1010 },
  bluecard: { label: "کارت آبی اروپا", price: 2600, gov: 310 },
  study: { label: "مهاجرت تحصیلی", price: 1500, gov: 510 },
  medicine: { label: "پزشکی و دندانپزشکی", price: 2500, gov: 510 },
  golden: { label: "گلدن ویزا (صندوق)", price: 3000, gov: 5310 },
  company: { label: "ثبت شرکت Kft", price: 2000, gov: 600 },
  property: { label: "خرید ملک", price: 3000, gov: 1000 },
  tourist: { label: "ویزای توریستی", price: 480, gov: 160 },
  selfemp: { label: "خوداشتغالی", price: 3500, gov: 300 },
};

const EXTRAS = [
  { key: "translate", label: "ترجمه رسمی مدارک", price: 200 },
  { key: "insurance", label: "بیمه درمانی سالانه", price: 220 },
  { key: "ticket", label: "بلیط تهران-بوداپست", price: 300 },
  { key: "housing", label: "اسکان ماه اول", price: 600 },
  { key: "airport", label: "پکیج استقبال و استقرار", price: 500 },
  { key: "language", label: "دوره فشرده زبان", price: 690 },
];

export function CostCalculator() {
  const [service, setService] = useState("work");
  const [people, setPeople] = useState(1);
  const [selected, setSelected] = useState<string[]>(["translate", "insurance"]);
  const [tomanRate, setTomanRate] = useState(95000);

  const base = BASE_PRICES[service];
  const extrasTotal = EXTRAS.filter((e) => selected.includes(e.key)).reduce((s, e) => s + e.price, 0);
  const total = (base.price + base.gov) * (service === "golden" ? 1 : 1) + extrasTotal + (people - 1) * 800 + (service === "golden" ? 250000 : 0);

  function toggle(key: string) {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold">۱. انتخاب خدمت</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {Object.entries(BASE_PRICES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setService(k)}
                className={`rounded-xl border p-3 text-right text-[12px] transition ${service === k ? "border-emerald-400/60 bg-emerald-400/10 font-bold" : "border-white/10 bg-white/[0.03] hover:border-white/25"}`}
              >
                {v.label}
                <span className="mt-1 block text-[10px] text-white/40">از {faNum(v.price.toLocaleString("en-US"))} €</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold">۲. تعداد نفرات: {faNum(people)} نفر</p>
          <input type="range" min={1} max={5} value={people} onChange={(e) => setPeople(Number(e.target.value))} className="w-full accent-emerald-400" />
          <p className="mt-1 text-[11px] text-white/40">به ازای هر همراه اضافه حدود ۸۰۰ یورو هزینه ویزا و پرونده افزوده می‌شود.</p>
        </div>
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold">۳. خدمات اضافی</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXTRAS.map((e) => {
              const on = selected.includes(e.key);
              return (
                <button
                  key={e.key}
                  onClick={() => toggle(e.key)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-[12px] transition ${on ? "border-emerald-400/60 bg-emerald-400/10" : "border-white/10 bg-white/[0.03]"}`}
                >
                  <span>{on ? "✓ " : "○ "}{e.label}</span>
                  <span className="text-[11px] text-amber-300">{faNum(e.price)} €</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="glass border-emerald-400/25 p-6">
          <p className="text-sm font-bold text-emerald-300">برآورد هزینه شما</p>
          <p className="mt-1 text-[11px] text-white/45">{base.label} • {faNum(people)} نفر</p>
          <div className="mt-4 space-y-2 text-[12px]">
            <Row label="خدمات مجموعه" value={`${faNum((base.price + (people - 1) * 500).toLocaleString("en-US"))} €`} />
            <Row label="هزینه‌های دولتی" value={`${faNum((base.gov + (people - 1) * 300).toLocaleString("en-US"))} €`} />
            <Row label="خدمات اضافی" value={`${faNum(extrasTotal.toLocaleString("en-US"))} €`} />
            {service === "golden" && <Row label="سرمایه‌گذاری صندوق" value={`${faNum((250000).toLocaleString("en-US"))} €`} />}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-3xl font-black gradient-text">{faNum(total.toLocaleString("en-US"))} €</p>
            <label className="mt-3 block text-[11px] text-white/45">
              نرخ یورو (تومان)
              <input type="number" value={tomanRate} onChange={(e) => setTomanRate(Number(e.target.value) || 0)} className="field mt-1 !py-1.5" />
            </label>
            <p className="mt-2 text-[12px] text-white/60">معادل تقریبی: {faNum(Math.round(total * tomanRate / 1e9))} میلیارد تومان</p>
          </div>
          <Link href="/contact" className="btn btn-primary mt-5 w-full !py-2.5 !text-xs">دریافت پیش‌فاکتور رسمی</Link>
          <p className="mt-2 text-center text-[10px] text-white/35">برآورد تقریبی است؛ پیش‌فاکتور دقیق پس از مشاوره صادر می‌شود.</p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-white/50">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

/* ---------- چک‌لیست تعاملی ---------- */
export function DocsChecklist({ groups, storageKey }: { groups: { title: string; items: string[] }[]; storageKey: string }) {
  const all = useMemo(() => groups.flatMap((g) => g.items.map((i) => `${g.title}:${i}`)), [groups]);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
  }, [storageKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done, storageKey]);

  const pct = all.length ? Math.round((done.length / all.length) * 100) : 0;

  function toggle(key: string) {
    setDone((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]));
  }

  return (
    <div>
      <div className="glass mb-5 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">پیشرفت تکمیل مدارک</span>
          <span className="font-black text-emerald-300">{faNum(pct)}٪ ({faNum(done.length)} از {faNum(all.length)})</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-sky-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => window.print()} className="btn btn-ghost !py-1.5 !text-[11px]">🖨️ چاپ / PDF</button>
          <button onClick={() => setDone([])} className="btn btn-ghost !py-1.5 !text-[11px]">شروع مجدد</button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title} className="glass p-5">
            <p className="mb-3 text-sm font-bold text-emerald-300">{g.title}</p>
            <div className="space-y-2">
              {g.items.map((item) => {
                const key = `${g.title}:${item}`;
                const on = done.includes(key);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(key)}
                    className={`flex w-full items-center gap-2.5 rounded-xl border p-3 text-right text-[12px] transition ${on ? "border-emerald-400/50 bg-emerald-400/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] ${on ? "border-emerald-400 bg-emerald-400 text-[#04120d]" : "border-white/25"}`}>{on ? "✓" : ""}</span>
                    <span className={on ? "text-white/80 line-through decoration-emerald-400/60" : ""}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- گالری نمونه ویزاها ---------- */
export function VisaGallery({ items }: { items: SampleVisa[] }) {
  const [filter, setFilter] = useState("همه");
  const [active, setActive] = useState<SampleVisa | null>(null);
  const types = ["همه", ...new Set(items.map((i) => i.type))];
  const filtered = filter === "همه" ? items : items.filter((i) => i.type === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`badge cursor-pointer !py-1.5 ${filter === t ? "!border-emerald-400/50 !text-emerald-300" : ""}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v, i) => {
          const media: MediaItem = {
            ...visaImage(v.type, i),
            alt: `نمونه ${v.type} مجارستان صادرشده در ${v.year} — ${v.holder}`,
            title: `نمونه ${v.type} مجارستان | ایران-مجارستان`,
          };
          return (
            <button key={i} onClick={() => setActive(v)} className="glass glass-hover overflow-hidden p-0 text-right">
              <div className="relative">
                <SmartImage media={media} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                <span className="absolute left-3 top-3 badge !bg-black/60 !text-[10px] text-emerald-300 backdrop-blur">{v.status}</span>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur">HU •••• {faNum(v.year)}</span>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold">{v.type}</p>
                <p className="mt-1 text-[11px] text-white/45">{v.holder} • مدت پرونده: {faNum(v.duration)}</p>
              </div>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setActive(null)}>
          <div className="glass w-full max-w-md p-6 rise" onClick={(e) => e.stopPropagation()}>
            <p className="text-5xl">🪪</p>
            <h3 className="mt-3 text-lg font-black">{active.type}</h3>
            <div className="mt-4 space-y-2 text-[13px]">
              <Row label="پرونده" value={active.holder} />
              <Row label="سال صدور" value={faNum(active.year)} />
              <Row label="مدت پرونده" value={faNum(active.duration)} />
              <Row label="وضعیت" value={active.status} />
            </div>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-white/45">مشخصات هویتی به دلیل حریم خصوصی مشتریان نمایش داده نمی‌شود. اصل مدارک در جلسه حضوری قابل رؤیت است.</p>
            <button onClick={() => setActive(null)} className="btn btn-primary mt-4 w-full !py-2 !text-xs">بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- اسلایدر نظرات ---------- */
export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const visible = [0, 1, 2].map((o) => items[(idx + o) % items.length]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-4 md:grid-cols-3">
        {visible.map((t, i) => {
          const avatar = AVATAR_POOL[(idx + i) % AVATAR_POOL.length];
          return (
            <div key={`${t.name}-${i}`} className={`glass h-full p-5 ${i === 0 ? "!border-emerald-400/30" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-amber-300" aria-label={`امتیاز ${t.stars} از ۵`}>{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</p>
                <AvatarImage media={{ ...avatar, alt: `نظر مشتری ${t.name} — ${t.service}`, title: `رضایت مشتری ${t.service}` }} size={44} />
              </div>
              <p className="mt-3 min-h-[84px] text-[13px] leading-7 text-white/65">«{t.text}»</p>
              <p className="mt-4 text-sm font-bold">{t.name}</p>
              <p className="text-[11px] text-white/40">{t.role} • {t.service}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <button onClick={() => setIdx((idx - 1 + items.length) % items.length)} className="btn btn-ghost !px-4 !py-2 !text-xs">→ قبلی</button>
        <span className="text-[11px] text-white/40">{faNum(idx + 1)} از {faNum(items.length)}</span>
        <button onClick={() => setIdx((idx + 1) % items.length)} className="btn btn-ghost !px-4 !py-2 !text-xs">بعدی ←</button>
      </div>
    </div>
  );
}

/* ---------- تقویم مهاجرتی ---------- */
export function MigrationCalendar() {
  const [month, setMonth] = useState(0);
  const [reminders, setReminders] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mh-reminders");
      if (raw) setReminders(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
  }, []);

  function addReminder(title: string) {
    const next = reminders.includes(title) ? reminders.filter((r) => r !== title) : [...reminders, title];
    setReminders(next);
    try { localStorage.setItem("mh-reminders", JSON.stringify(next)); } catch { /* ignore */ }
  }

  const m = MIGRATION_CALENDAR[month];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="glass grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto p-4 lg:grid-cols-2">
        {MIGRATION_CALENDAR.map((mm, i) => (
          <button
            key={mm.month}
            onClick={() => setMonth(i)}
            className={`rounded-xl border p-3 text-[12px] transition ${i === month ? "border-emerald-400/60 bg-emerald-400/10 font-bold" : "border-white/10 bg-white/[0.03]"}`}
          >
            {mm.month}
            <span className="block text-[10px] text-white/35">{mm.season}</span>
          </button>
        ))}
      </div>
      <div className="glass p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">{m.month} <span className="text-xs font-normal text-white/40">({m.season})</span></h3>
          <span className="badge !text-[10px]">🔔 {faNum(reminders.length)} یادآور فعال</span>
        </div>
        <div className="mt-5 space-y-3">
          {m.events.map((e) => {
            const on = reminders.includes(e.title);
            return (
              <div key={e.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold">{e.title}</p>
                  <span className="badge !text-[10px] text-emerald-300">{faNum(e.day)}</span>
                </div>
                <p className="mt-2 text-[12px] leading-6 text-white/55">{e.desc}</p>
                <button onClick={() => addReminder(e.title)} className={`btn mt-3 !py-1.5 !text-[11px] ${on ? "btn-primary" : "btn-ghost"}`}>
                  {on ? "✓ یادآور فعال است" : "＋ افزودن یادآور"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- بنر هشدار قانون ---------- */
export function LawAlert() {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try { if (localStorage.getItem("mh-law-alert") === "1") setDismissed(true); } catch { /* ignore */ }
  }, []);
  if (dismissed) return null;
  return (
    <div className="border-b border-amber-300/25 bg-gradient-to-l from-amber-400/15 via-amber-300/[0.07] to-transparent">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <p className="text-[12px] text-amber-200">
          ⚠️ <strong>قوانین ۲۰۲۶:</strong> مسیر «کارگر مهمان» بسته شد؛ مسیرهای جایگزین (Blue Card، خوداشتغالی، کاری عادی) فعال است.
          <Link href="/services/work-permit" className="ms-2 underline underline-offset-4 hover:text-white">جزئیات ←</Link>
        </p>
        <button onClick={() => { setDismissed(true); try { localStorage.setItem("mh-law-alert", "1"); } catch { /* ignore */ } }} className="text-[11px] text-white/40 hover:text-white">✕ بستن</button>
      </div>
    </div>
  );
}
