import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, JsonLd, PageHero, StepsFlow } from "@/components/rich-blocks";
import { BreadcrumbJsonLd, LeadMagnets } from "@/components/seo-blocks";
import { DocsChecklist, FaqAccordion } from "@/components/upgrade-widgets";
import { COST_TABLES, DOCS_BY_VISA, FAQS, PROCESS_STEPS, PROCESS_TIMELINES } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES, type MediaKey } from "@/lib/media";
import { faNum } from "@/lib/format";

const SLUG_IMAGE: Record<string, MediaKey> = {
  steps: "chainBridgeDay",
  documents: "passportStamps",
  costs: "apartmentBright",
  timeline: "airportPhone",
  faq: "businessWomen",
  checklist: "passportBag",
};

export const dynamic = "force-dynamic";

const META: Record<string, { title: string; desc: string; icon: string }> = {
  steps: { title: "مراحل کلی مهاجرت", desc: "فلوچارت ۷ مرحله از مشاوره تا استقرار", icon: "👣" },
  documents: { title: "مدارک مورد نیاز", desc: "لیست کامل و تفکیکی مدارک هر نوع ویزا", icon: "📄" },
  costs: { title: "هزینه‌های مهاجرت", desc: "جدول تفصیلی هزینه‌های دولتی، خدماتی و جانبی", icon: "💰" },
  timeline: { title: "زمان‌بندی مهاجرت", desc: "تخمین زمان هر مسیر + عوامل تأخیر", icon: "⏱️" },
  faq: { title: "سوالات متداول", desc: "پاسخ ۲۴ سوال پرتکرار، دسته‌بندی‌شده", icon: "❓" },
  checklist: { title: "چک‌لیست هوشمند مدارک", desc: "تعاملی: تیک بزنید، پیشرفت ذخیره می‌شود", icon: "✅" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = META[slug];
  if (!m) return {};
  return { title: `${m.title} | فرآیند مهاجرت`, description: m.desc };
}

export default async function ProcessDetail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ visa?: string }> }) {
  const { slug } = await params;
  const m = META[slug];
  if (!m) notFound();
  const { visa } = await searchParams;

  return (
    <div>
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "فرآیند مهاجرت", href: "/process" }, { label: m.title }]} />
      <PageHero badge="فرآیند مهاجرت" title={m.title} desc={m.desc} icon={m.icon} updated="به‌روزرسانی: ۲۰۲۶" />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: m.title, description: m.desc, inLanguage: "fa-IR" }} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-4 sm:px-6">
        {slug === "steps" && (
          <Reveal>
            <div className="glass mb-6 overflow-x-auto p-5 text-center">
              <p className="text-[12px] text-white/45">فلوچارت مسیر</p>
              <p className="mt-2 whitespace-nowrap text-[13px] font-bold text-emerald-300" dir="rtl">
                مشاوره ← انتخاب مسیر ← مدارک ← پرونده ← پیگیری ← نتیجه ← سفر ← استقرار
              </p>
            </div>
            <StepsFlow steps={PROCESS_STEPS} />
          </Reveal>
        )}

        {slug === "documents" && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {DOCS_BY_VISA.map((d) => (
                <a key={d.visa} href={`#visa-${d.visa}`} className="badge hover:border-emerald-400/50">{d.icon} {d.visa}</a>
              ))}
            </div>
            {DOCS_BY_VISA.map((d) => (
              <Reveal key={d.visa}>
                <div id={`visa-${d.visa}`} className="glass scroll-mt-24 p-5 sm:p-6">
                  <h2 className="text-base font-extrabold">{d.icon} {d.visa}</h2>
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {d.groups.map((g) => (
                      <div key={g.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="mb-2 text-[13px] font-bold text-emerald-300">{g.title}</p>
                        <ul className="space-y-1.5">
                          {g.items.map((it) => (
                            <li key={it} className="flex gap-2 text-[12px] leading-6 text-white/60">
                              <span className="text-white/25">☐</span> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link href={`/process/checklist?visa=${encodeURIComponent(d.visa)}`} className="btn btn-ghost mt-4 !py-2 !text-xs">استفاده از چک‌لیست تعاملی ←</Link>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <ContentSection block={{ heading: "نکات ترجمه و تأیید", bullets: ["ترجمه رسمی انگلیسی یا مجاری با مهر دادگستری و وزارت خارجه", "اسکن رنگی با کیفیت ۳۰۰dpi برای بارگذاری در سامانه", "مدارک فارسی بدون ترجمه در سفارت پذیرفته نمی‌شود", "گواهی عدم سوءپیشینه حداکثر ۳ ماه اعتبار دارد"] }} />
            </Reveal>
          </div>
        )}

        {slug === "costs" && (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <Reveal><ContentSection block={{ heading: "🏛️ هزینه‌های دولتی", table: COST_TABLES.gov }} /></Reveal>
              <Reveal delay={60}><ContentSection block={{ heading: "🛠️ هزینه‌های خدماتی", table: COST_TABLES.service }} /></Reveal>
              <Reveal delay={120}><ContentSection block={{ heading: "🧳 هزینه‌های جانبی", table: COST_TABLES.side }} /></Reveal>
            </div>
            <Reveal>
              <div className="glass border-emerald-400/25 p-6 text-center">
                <p className="text-base font-extrabold">هزینه دقیق شرایط شما چقدر می‌شود؟</p>
                <p className="mt-2 text-[13px] text-white/55">با محاسبه‌گر آنلاین، بر اساس خدمت، تعداد نفرات و خدمات اضافی حساب کنید.</p>
                <Link href="/tools/calculator" className="btn btn-primary mt-4">🧮 محاسبه‌گر هزینه</Link>
              </div>
            </Reveal>
          </div>
        )}

        {slug === "timeline" && (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              {PROCESS_TIMELINES.map((t) => (
                <Reveal key={t.visa}>
                  <div className="glass p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold">{t.icon} {t.visa}</h2>
                      <span className="badge !text-emerald-300">جمع: {faNum(t.total)}</span>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {t.rows.map(([stage, time]) => (
                        <div key={stage} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-[12px]">
                          <span className="text-white/70">{stage}</span>
                          <span className="text-sky-300">{faNum(time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <ContentSection block={{ heading: "عوامل تأخیر (و راه پیشگیری)", bullets: ["نقص مدارک: با چک‌لیست هوشمند و بررسی کارشناس حل می‌شود", "تعطیلات رسمی مجارستان و صف سفارت در پیک تابستان", "بررسی امنیتی تکمیلی برای برخی پرونده‌ها", "تأخیر کارفرما/دانشگاه در صدور نامه — پیگیری هفتگی ما"] }} />
            </Reveal>
          </div>
        )}

        {slug === "faq" && (
          <Reveal>
            <FaqAccordion items={FAQS} />
          </Reveal>
        )}

        {slug === "checklist" && (
          <ChecklistView initialVisa={visa} />
        )}

        <Reveal><LeadMagnets /></Reveal>
        <Reveal><CtaBand image={SECTION_IMAGES.stepArrival} /></Reveal>
      </div>
    </div>
  );
}

function ChecklistView({ initialVisa }: { initialVisa?: string }) {
  const found = DOCS_BY_VISA.find((d) => d.visa === initialVisa);
  const groups = found ? found.groups : DOCS_BY_VISA.flatMap((d) => d.groups.map((g) => ({ title: `${d.visa} — ${g.title}`, items: g.items })));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Link href="/process/checklist" className={`badge !py-1.5 ${!found ? "!border-emerald-400/50 !text-emerald-300" : ""}`}>همه ویزاها</Link>
        {DOCS_BY_VISA.map((d) => (
          <Link key={d.visa} href={`/process/checklist?visa=${encodeURIComponent(d.visa)}`} className={`badge !py-1.5 ${found?.visa === d.visa ? "!border-emerald-400/50 !text-emerald-300" : ""}`}>
            {d.icon} {d.visa}
          </Link>
        ))}
      </div>
      <DocsChecklist groups={groups} storageKey={`mh-checklist-${found?.visa ?? "all"}`} />
    </div>
  );
}
