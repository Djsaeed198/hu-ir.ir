import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { LeadForm } from "@/components/lead-form";
import { StartCaseButton } from "@/components/start-case-button";
import { ContentSection, JsonLd } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, FaqJsonLd, LeadMagnets, MicroIntent, RelatedSearches, ShareButtons } from "@/components/seo-blocks";
import { FaqAccordion } from "@/components/upgrade-widgets";
import { FAQS, JOB_GROUPS, SERVICE_ENRICHMENT, SERVICE_FAQ_MAP, UNIVERSITIES } from "@/lib/upgrade-content";
import { MEDIA, serviceImage } from "@/lib/media";
import { categoryGradient, faMoney, faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

/* تیترهای سئو ۲۰۲۶ طبق راهنما: کلمه کلیدی + سال + برند */
const SEO_TITLES: Record<string, { title: string; desc: string }> = {
  "work-permit": {
    title: "مهاجرت کاری مجارستان ۲۰۲۶ | Blue Card و مسیرهای جایگزین",
    desc: "راهنمای کامل مهاجرت کاری مجارستان پس از لغو ویزای کارگر مهمان. Blue Card، اقامت کاری و خوداشتغالی. مشاوره رایگان.",
  },
  "study-admission": {
    title: "تحصیل در مجارستان ۲۰۲۶ | بورسیه و پذیرش | ایران-مجارستان",
    desc: "راهنمای کامل تحصیل در مجارستان ۲۰۲۶: بورسیه Stipendium Hungaricum، مهلت‌ها، مدارک و هزینه‌ها. مشاوره رایگان.",
  },
  "golden-visa": {
    title: "گلدن ویزا مجارستان ۲۰۲۶ | شرایط و هزینه | ایران-مجارستان",
    desc: "راهنمای کامل گلدن ویزا مجارستان ۲۰۲۶: خرید ملک، صندوق املاک، شرایط و هزینه‌ها. مشاوره رایگان.",
  },
  citizenship: {
    title: "اقامت دائم و تابعیت مجارستان | شرایط ۲۰۲۶ | ایران-مجارستان",
    desc: "راهنمای کامل اقامت دائم و تابعیت مجارستان ۲۰۲۶: شرایط، زمان‌بندی و آزمون زبان. مشاوره تخصصی.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await ensureSeed();
  const [service] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (!service) return {};
  const seo = SEO_TITLES[slug];
  const img = serviceImage(slug);
  return {
    title: seo?.title ?? `${service.titleFa} ۲۰۲۶ | شرایط و هزینه | ایران-مجارستان`,
    description: seo?.desc ?? `${service.summary} مشاوره رایگان با ایران-مجارستان.`,
    openGraph: {
      title: seo?.title ?? service.titleFa,
      description: service.summary,
      images: [{ url: img.src, alt: img.alt }],
      locale: "fa_IR",
      type: "article",
    },
    alternates: { canonical: `https://hu-ir.ir/services/${slug}` },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  await ensureSeed();
  const { slug } = await params;
  const [service] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (!service) notFound();

  const related = await db
    .select()
    .from(services)
    .where(ne(services.slug, slug))
    .orderBy(services.popularity)
    .limit(4);

  const enrichment = SERVICE_ENRICHMENT[slug] ?? [];
  const faqCats = SERVICE_FAQ_MAP[slug] ?? ["عمومی"];
  const faqs = FAQS.filter((f) => faqCats.includes(f.category)).slice(0, 8);
  const showJobs = slug === "work-permit" || slug === "job-offer";
  const showUniversities = slug === "study-admission" || slug === "medical-university" || slug === "scholarship";
  const hero = serviceImage(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: service.titleFa, description: service.summary, image: hero.src, provider: { "@type": "Organization", name: "مجارنشین", url: "https://hu-ir.ir" }, offers: { "@type": "Offer", price: service.priceFromEur, priceCurrency: "EUR" } }} />
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "خدمات", href: "/services" }, { label: service.titleFa }]} />
      <FaqJsonLd faqs={faqs} />
      <nav aria-label="مسیر صفحه" className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white">خانه</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-white">خدمات</Link>
        <span>/</span>
        <span className="text-white/70" aria-current="page">{service.titleFa}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="glass overflow-hidden p-0">
            <SmartImage
              media={{ ...hero, alt: `${service.titleFa} — ${service.summary.slice(0, 70)}`, title: `${service.titleFa} ۲۰۲۶ | ایران-مجارستان` }}
              priority
              ratio="16/7"
              rounded="rounded-none"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${categoryGradient(service.category)} text-3xl`} aria-hidden>
                  {service.icon}
                </div>
                <div>
                  <span className="badge !text-emerald-300">{service.category}</span>
                  <h1 className="mt-2 text-2xl font-black leading-relaxed sm:text-3xl">{service.titleFa}</h1>
                  <p className="text-xs text-white/40" dir="ltr">{service.titleEn}</p>
                </div>
              </div>
              {/* CTA اولیه (بالای صفحه) */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/contact" className="btn btn-primary !py-2 !text-xs">🎯 مشاوره رایگان</Link>
                <Link href="/assess" className="btn btn-ghost !py-2 !text-xs">ارزیاب شانس</Link>
                <Link href="/tools/calculator" className="btn btn-ghost !py-2 !text-xs">محاسبه هزینه</Link>
              </div>
              <p className="mt-6 text-sm leading-8 text-white/65">{service.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Stat label="نرخ موفقیت" value={`${faNum(service.successRate)}٪`} tone="text-emerald-300" />
                <Stat label="مدت زمان" value={faNum(service.durationLabel)} tone="text-sky-300" />
                <Stat label="هزینه از" value={faMoney(service.priceFromEur)} tone="text-amber-300" />
              </div>

              <h2 className="mt-8 text-lg font-extrabold">چه چیزی در این خدمت ارائه می‌شود؟</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[13px] text-white/65">
                    <span className="text-emerald-400">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <h2 className="mt-8 text-lg font-extrabold">مراحل انجام کار در سامانه</h2>
              <ol className="mt-4 space-y-3">
                {[
                  "ثبت درخواست و ارزیابی هوشمند پرونده",
                  "جلسه مشاوره با کارشناس (حضوری یا ویدیویی)",
                  "امضای قرارداد دیجیتال و پرداخت امن",
                  "بارگذاری مدارک با چک‌لیست هوشمند",
                  "اپلای و پیگیری لحظه‌ای در اپلیکیشن",
                  "دریافت نتیجه و خدمات پس از ورود",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-[13px] text-white/60">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-[11px] font-bold text-emerald-300">
                      {faNum(i + 1)}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-6"><ShareButtons title={service.titleFa} /></div>
            </div>
          </div>

          {enrichment.length > 0 && (
            <div className="mt-6 space-y-5">
              {enrichment.map((b, bi) => (
                <ContentSection key={b.heading} block={b} image={bi === 0 ? hero : undefined} />
              ))}
            </div>
          )}

          {/* CTA میانی */}
          <div className="glass mt-6 border-sky-400/25 p-5 text-center">
            <p className="text-sm font-extrabold">هنوز مطمئن نیستید این مسیر برای شماست؟</p>
            <p className="mt-1 text-[12px] text-white/50">در ۲ دقیقه شانس خود را بسنجید یا هزینه دقیق را حساب کنید.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link href="/assess" className="btn btn-primary !py-2 !text-xs">🎯 ارزیاب شانس</Link>
              <Link href="/tools/calculator" className="btn btn-ghost !py-2 !text-xs">🧮 محاسبه هزینه</Link>
            </div>
          </div>

          {showJobs && (
            <div className="glass mt-6 overflow-hidden p-0">
              <SmartImage media={MEDIA.developerImac} ratio="21/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 60vw" />
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-extrabold">مشاغل پرتقاضا در مجارستان</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {JOB_GROUPS.map((j) => (
                    <div key={j.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm font-bold">{j.icon} {j.title}</p>
                      <p className="mt-1.5 text-[11px] leading-6 text-white/50">{j.roles.join(" • ")}</p>
                      <p className="mt-2 text-[11px] font-bold text-emerald-300">حقوق: {j.salary}</p>
                    </div>
                  ))}
                </div>
                <Link href="/hungary/work" className="btn btn-ghost mt-4 !py-2 !text-xs">راهنمای کامل کار در مجارستان ←</Link>
              </div>
            </div>
          )}

          {showUniversities && (
            <div className="glass mt-6 overflow-hidden p-0">
              <SmartImage media={MEDIA.graduatesOutdoor} ratio="21/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 60vw" />
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-extrabold">دانشگاه‌های برتر همکار</h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                  <table className="data-table">
                    <thead><tr><th>دانشگاه</th><th>شهر</th><th>رتبه</th><th>شهریه سالانه</th></tr></thead>
                    <tbody>
                      {UNIVERSITIES.slice(0, 7).map((u) => (
                        <tr key={u.name}><td dir="ltr" className="text-left">{u.name}</td><td>{u.city}</td><td>{u.rank}</td><td>{u.tuition}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/hungary/study" className="btn btn-ghost mt-4 !py-2 !text-xs">راهنمای تحصیل در مجارستان ←</Link>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-5">
            <MicroIntent />
            <LeadMagnets />
          </div>

          {faqs.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-extrabold">سوالات متداول این خدمت</h2>
              <FaqAccordion items={faqs} showFilter={false} />
              <Link href="/faq" className="btn btn-ghost mt-4 !py-2 !text-xs">همه سوالات متداول ←</Link>
            </div>
          )}

          <div className="mt-6">
            <RelatedSearches items={[
              { label: `هزینه ${service.titleFa}`, href: "/tools/calculator" },
              { label: `مدارک ${service.titleFa}`, href: "/tools/checklist" },
              { label: "مقایسه مسیرهای مهاجرت", href: "/tools/comparison" },
              { label: "زمان‌بندی مهاجرت", href: "/process/timeline" },
            ]} />
          </div>

          <div className="mt-6">
            <h2 className="mb-4 text-lg font-extrabold">خدمات مرتبط</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => {
                const img = serviceImage(r.slug);
                return (
                  <Link key={r.id} href={`/services/${r.slug}`} className="glass glass-hover overflow-hidden p-0">
                    <SmartImage media={{ ...img, alt: `${r.titleFa} — خدمت مرتبط`, title: r.titleFa }} ratio="16/6" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 30vw" />
                    <div className="p-4">
                      <p className="text-sm font-bold">{r.titleFa}</p>
                      <p className="mt-1 text-[11px] text-white/40">{r.category}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA نهایی */}
          <div className="glass mt-6 border-emerald-400/25 p-6 text-center">
            <p className="text-base font-extrabold">آماده شروع هستید؟</p>
            <p className="mt-1 text-[12px] text-white/50">کارشناس ما در کمتر از ۲ ساعت کاری با شما تماس می‌گیرد.</p>
            <div className="mt-4"><StartCaseButton serviceSlug={service.slug} /></div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass overflow-hidden p-0">
            <SmartImage media={MEDIA.businessSigning} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 30vw" />
            <div className="p-5">
              <p className="text-sm font-bold">شروع پرونده</p>
              <p className="mt-2 text-[12px] leading-6 text-white/50">
                با یک کلیک پرونده در سامانه ثبت می‌شود، کد رهگیری دریافت می‌کنید و کارشناس تخصیص می‌یابد.
              </p>
              <div className="mt-4 space-y-2">
                <StartCaseButton serviceSlug={service.slug} />
              </div>
              <Link href="/assess" className="btn btn-ghost mt-2 w-full !py-2 !text-xs">
                🧭 ارزیابی هوشمند شانس پرونده
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">درخواست مشاوره برای این خدمت</p>
            <LeadForm serviceSlug={service.slug} compact />
          </div>

          <div className="glass p-5">
            <p className="text-sm font-bold text-emerald-300">پشتیبانی سریع</p>
            <ul className="mt-3 space-y-2 text-[12px] text-white/55">
              <li>☎️ {faNum("021-91001234")} (تهران)</li>
              <li>🇭🇺 {faNum("+36-20-123-4567")} (بوداپست)</li>
              <li>💬 دستیار هوشمند: پایین سمت چپ صفحه</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <p className={`text-lg font-black ${tone}`}>{value}</p>
      <p className="mt-1 text-[11px] text-white/45">{label}</p>
    </div>
  );
}
