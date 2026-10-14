import Link from "next/link";
import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles, services } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LeadMagnets, LocalBusinessJsonLd, MicroIntent } from "@/components/seo-blocks";
import { LawAlert, TestimonialSlider, VisaGallery } from "@/components/upgrade-widgets";
import { SAMPLE_VISAS, TESTIMONIALS } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES, articleImage, serviceImage } from "@/lib/media";
import { faDate, faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مهاجرت به مجارستان ۲۰۲۶ | اقامت، ویزا و گلدن ویزا | ایران-مجارستان",
  description: "راهنمای کامل مهاجرت به مجارستان ۲۰۲۶: Blue Card، اقامت کاری، تحصیل، گلدن ویزا و ثبت شرکت. ۲۵۰۰+ پرونده موفق. مشاوره رایگان.",
  keywords: ["مهاجرت به مجارستان", "اقامت مجارستان", "ویزای مجارستان برای ایرانیان", "گلدن ویزا مجارستان", "هزینه مهاجرت به مجارستان ۲۰۲۶", "Blue Card مجارستان"],
  openGraph: {
    title: "مهاجرت به مجارستان ۲۰۲۶ | ایران-مجارستان",
    description: "Blue Card، اقامت کاری، تحصیل و گلدن ویزا با ۲۵۰۰+ پرونده موفق. مشاوره رایگان.",
    locale: "fa_IR",
    type: "website",
    images: [{ url: MEDIA.heroParliamentNight.src, alt: MEDIA.heroParliamentNight.alt }],
  },
  twitter: { card: "summary_large_image", title: "مهاجرت به مجارستان ۲۰۲۶", description: "مسیر مطمئن مهاجرت به قلب اروپا با ایران-مجارستان" },
  alternates: { canonical: "https://hu-ir.ir/" },
};

const NINE_SERVICES = [
  { slug: "work-permit", icon: "💼", short: "اخذ اقامت از طریق جاب آفر" },
  { slug: "study-admission", icon: "🎓", short: "پذیرش از دانشگاه‌های برتر" },
  { slug: "golden-visa", icon: "🏆", short: "اقامت ۱۰ ساله با سرمایه‌گذاری" },
  { slug: "company-registration", icon: "🏢", short: "کسب‌وکار در اروپا با مالیات ۹٪" },
  { slug: "realestate", icon: "🏠", short: "مشاوره خرید ملک" },
  { slug: "language-courses", icon: "📚", short: "آمادگی زبان برای دانشگاه" },
  { slug: "customs", icon: "📦", short: "خدمات گمرکی حرفه‌ای" },
  { slug: "logistics", icon: "🚚", short: "حمل بین‌المللی مطمئن" },
  { slug: "post-arrival", icon: "🤝", short: "همراهی کامل پس از ورود" },
];

const FIVE_STEPS = [
  { n: "۱", t: "مشاوره رایگان", d: "ارزیابی شرایط و پاسخ همه سوالات", img: SECTION_IMAGES.stepConsult },
  { n: "۲", t: "انتخاب مسیر", d: "بهترین مسیر با ارزیاب هوشمند", img: SECTION_IMAGES.toolAssess },
  { n: "۳", t: "آماده‌سازی مدارک", d: "چک‌لیست هوشمند + ترجمه رسمی", img: SECTION_IMAGES.stepDocs },
  { n: "۴", t: "پیگیری پرونده", d: "تایم‌لاین لحظه‌ای در سامانه", img: SECTION_IMAGES.stepTrack },
  { n: "۵", t: "ورود و استقرار", d: "فرودگاه، اسکان، بانک و بیمه", img: SECTION_IMAGES.stepArrival },
];

const WHY_CARDS = [
  { title: "سیستم آموزشی قوی", text: "۲۱ دانشگاه معتبر با مدرک مورد تأیید اتحادیه اروپا و شهریه مناسب.", img: SECTION_IMAGES.whyEdu },
  { title: "هزینه زندگی مناسب", text: "حدود ۴۰٪ کمتر از آلمان؛ زندگی ماهانه ۶۴۰ تا ۹۴۰ یورو.", img: SECTION_IMAGES.whyCost },
  { title: "عضویت در اتحادیه اروپا", text: "سفر آزاد شنگن به ۲۷ کشور و دسترسی به بازار کار اروپا.", img: SECTION_IMAGES.whyEu },
  { title: "اقتصاد پایدار", text: "نرخ بیکاری ۳.۴٪، مالیات شرکتی ۹٪ و رشد اقتصادی پایدار.", img: SECTION_IMAGES.whyEconomy },
  { title: "فرهنگ پذیرا", text: "جامعه متنوع، امنیت بالا و پذیرش مناسب مهاجران.", img: SECTION_IMAGES.whyCulture },
  { title: "موقعیت استراتژیک", text: "قلب اروپا با دسترسی عالی به وین، پراگ و برلین.", img: SECTION_IMAGES.whyLocation },
];

const PARTNERS = ["Semmelweis", "ELTE", "BME", "Debrecen", "OTP Bank", "K&H Bank", "Wizz Air", "Audi Győr"];

export default async function HomePage() {
  await ensureSeed();
  const [all, latest] = await Promise.all([
    db.select().from(services).orderBy(desc(services.popularity)),
    db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(3),
  ]);
  const nine = NINE_SERVICES.map((n) => ({ ...n, db: all.find((s) => s.slug === n.slug) })).filter((x) => x.db);

  return (
    <div>
      <LawAlert />
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }]} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "مجموعه ایران-مجارستان (مجارنشین)",
        alternateName: "Magyarneshin",
        url: "https://hu-ir.ir",
        logo: "https://hu-ir.ir/icon.svg",
        description: "بزرگ‌ترین پلتفرم جامع مهاجرت به مجارستان برای ایرانیان",
        address: [{ "@type": "PostalAddress", addressLocality: "تهران", addressCountry: "IR" }, { "@type": "PostalAddress", addressLocality: "بوداپست", addressCountry: "HU" }],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "2500" },
      }} />

      {/* ---------- ۱. HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div className="rise">
            <span className="badge !border-emerald-400/40 !text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              به‌روز با قوانین ۲۰۲۶ مجارستان
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.3] sm:text-5xl lg:text-[3.2rem]">
              مسیر مطمئن مهاجرت به <span className="gradient-text">قلب اروپا</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
              با بیش از {faNum("2500")} پرونده موفق، مجموعه ایران-مجارستان همراه شماست تا رویای زندگی در اروپا را به
              واقعیت تبدیل کنید؛ از ارزیابی هوشمند تا اقامت و استقرار.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">🎯 مشاوره رایگان</Link>
              <Link href="/services" className="btn btn-ghost">📋 مشاهده خدمات</Link>
              <Link href="/testimonials" className="btn btn-ghost">🎥 داستان مشتریان</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-white/45">
              <span className="badge">✓ قرارداد رسمی</span>
              <span className="badge">✓ وکیل مجارستانی</span>
              <span className="badge">✓ پیگیری آنلاین</span>
            </div>
          </div>
          <div className="relative">
            <div className="glass overflow-hidden p-0">
              <SmartImage media={MEDIA.heroParliamentNight} priority ratio="16/9" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 45vw" />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4">
                  <p className="text-xs text-emerald-300">وضعیت پرونده زنده</p>
                  <p className="mt-1 text-sm font-bold">Blue Card — مصاحبه سفارت</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-l from-emerald-400 to-sky-400" />
                  </div>
                  <p className="mt-2 text-[10px] text-white/45">{faNum(62)}٪ تکمیل • {faNum(96)} روز باقی‌مانده</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-sky-300">دستیار هوشمند</p>
                  <p className="mt-1 text-[13px] leading-6 text-white/70">«شانس پرونده شما {faNum(84)}٪ است؛ با Blue Card به {faNum(91)}٪ می‌رسد.»</p>
                </div>
              </div>
            </div>
            <div className="floaty absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/10 bg-[#0d1424]/90 p-4 backdrop-blur-xl sm:block">
              <p className="text-[11px] text-white/45">کاهش زمان پردازش</p>
              <p className="text-xl font-black text-emerald-300">{faNum(40)}٪</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ۲. نوار اعتماد ---------- */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {[
            { v: `+${faNum("2500")}`, l: "مشتری موفق" },
            { v: `${faNum(98)}٪`, l: "رضایت مشتریان" },
            { v: `+${faNum(10)}`, l: "سال تجربه" },
            { v: faNum(2), l: "دفتر تهران و بوداپست" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-black gradient-text">{s.v}</p>
              <p className="mt-1 text-[12px] text-white/50">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden border-t border-white/10 py-3">
          <div className="marquee-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span key={p + i} className="flex items-center gap-2 text-sm text-white/35" dir="ltr">◆ {p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ۳. خدمات اصلی ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge !text-emerald-300">خدمات تخصصی ما</span>
              <h2 className="mt-3 text-3xl font-black">{faNum(9)} خدمت اصلی + خدمات تکمیلی</h2>
            </div>
            <Link href="/services" className="btn btn-ghost !py-2 !text-xs">همه {faNum(all.length)} خدمت ←</Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nine.map((s, i) => {
            const img = serviceImage(s.slug);
            return (
              <Reveal key={s.slug} delay={i * 50}>
                <Link href={`/services/${s.slug}`} className="glass glass-hover block h-full overflow-hidden p-0">
                  <SmartImage media={{ ...img, alt: `${s.db!.titleFa} — ${s.short}`, title: `${s.db!.titleFa} | ایران-مجارستان` }} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.icon}</span>
                      <h3 className="text-base font-extrabold">{s.db!.titleFa}</h3>
                    </div>
                    <p className="mt-1 text-[13px] text-white/50">{s.short}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
                      <span className="text-white/45">از {faNum(s.db!.priceFromEur.toLocaleString("en-US"))} €</span>
                      <span className="text-emerald-300">{faNum(s.db!.successRate)}٪ موفقیت</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- ۴. چرا مجارستان ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="glass overflow-hidden p-0">
            <SmartImage media={MEDIA.chainBridgeAerial} ratio="21/6" rounded="rounded-none" sizes="100vw" />
            <div className="p-6 sm:p-10">
              <span className="badge !text-amber-300">چرا مجارستان بهترین مقصد برای ایرانیان است؟</span>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {WHY_CARDS.map((w) => (
                  <Link key={w.title} href="/hungary/why" className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-amber-300/40">
                    <SmartImage media={{ ...w.img, alt: `${w.title} — چرا مهاجرت به مجارستان`, title: w.title }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="p-4">
                      <p className="text-sm font-bold">{w.title}</p>
                      <p className="mt-1 text-[11px] leading-6 text-white/45">{w.text}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/hungary" className="btn btn-gold !py-2.5 !text-xs">راهنمای کامل مجارستان ←</Link>
                <Link href="/hungary/cost-of-living" className="btn btn-ghost !py-2.5 !text-xs">هزینه زندگی</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- ۵. فرآیند کار ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal><h2 className="text-center text-3xl font-black">مسیر شما به مجارستان در {faNum(5)} گام</h2></Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FIVE_STEPS.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <Link href="/process" className="glass glass-hover relative block h-full overflow-hidden p-0">
                <SmartImage media={{ ...p.img, alt: `گام ${p.n}: ${p.t} — فرآیند مهاجرت به مجارستان`, title: `${p.t} | فرآیند مهاجرت` }} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 20vw" />
                <span className="absolute right-4 top-[calc(38%-18px)] grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-black text-[#04120d] shadow-lg">{faNum(p.n)}</span>
                <div className="p-5 pt-6">
                  <p className="text-base font-extrabold">{p.t}</p>
                  <p className="mt-2 text-[12px] leading-6 text-white/50">{p.d}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- ۶. ابزارهای آنلاین ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge !border-sky-400/40 !text-sky-300">ابزارهای هوشمند ما</span>
              <h2 className="mt-3 text-3xl font-black">خودتان بسنجید و حساب کنید</h2>
            </div>
            <Link href="/tools" className="btn btn-ghost !py-2 !text-xs">همه ابزارها ←</Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/assess", t: "ارزیاب شانس مهاجرت", d: "در ۲ دقیقه شانس خود را بسنجید + پیشنهاد بهترین مسیر", cta: "شروع ارزیابی", img: SECTION_IMAGES.toolAssess },
            { href: "/tools/calculator", t: "محاسبه‌گر هزینه", d: "هزینه دقیق مهاجرت بر اساس خدمت و نفرات", cta: "محاسبه کنید", img: SECTION_IMAGES.toolCalc },
            { href: "/tools/checklist", t: "چک‌لیست مدارک", d: "مدارک مورد نیاز هر ویزا با ذخیره پیشرفت", cta: "دریافت چک‌لیست", img: SECTION_IMAGES.toolChecklist },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <Link href={c.href} className="glass glass-hover block h-full overflow-hidden p-0">
                <SmartImage media={{ ...c.img, alt: `${c.t} — ابزار رایگان مهاجرت به مجارستان`, title: `${c.t} | مجارنشین` }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="p-6">
                  <p className="text-base font-extrabold">{c.t}</p>
                  <p className="mt-1.5 text-[13px] leading-7 text-white/50">{c.d}</p>
                  <span className="btn btn-primary mt-4 !py-2 !text-xs">{c.cta}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Micro-Intent + LeadMagnet ---------- */}
      <section className="mx-auto max-w-7xl space-y-5 px-4 py-10 sm:px-6">
        <Reveal><MicroIntent /></Reveal>
        <Reveal><LeadMagnets /></Reveal>
      </section>

      {/* ---------- ۷. نمونه ویزاها ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge !text-emerald-300">پرونده‌های موفق</span>
              <h2 className="mt-3 text-3xl font-black">نمونه ویزاها و کارت‌های اقامت</h2>
            </div>
            <Link href="/testimonials" className="btn btn-ghost !py-2 !text-xs">مشاهده همه ←</Link>
          </div>
        </Reveal>
        <div className="mt-8"><VisaGallery items={SAMPLE_VISAS} /></div>
      </section>

      {/* ---------- ۸. نظرات ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal><h2 className="mb-8 text-center text-3xl font-black">مشتریان ما چه می‌گویند؟</h2></Reveal>
        <TestimonialSlider items={TESTIMONIALS} />
      </section>

      {/* ---------- ۹. وبلاگ ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-black">آخرین مقالات</h2>
            <Link href="/news" className="btn btn-ghost !py-2 !text-xs">همه مقالات ←</Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {latest.map((a, i) => {
            const img = articleImage(a.slug, i);
            return (
              <Reveal key={a.id} delay={i * 70}>
                <Link href={`/news/${a.slug}`} className="glass glass-hover flex h-full flex-col overflow-hidden p-0">
                  <SmartImage media={{ ...img, alt: `${a.title} — وبلاگ مهاجرت مجارستان`, title: a.title }} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{a.coverEmoji}</span>
                      <span className="badge !text-[10px]">{a.tag}</span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-extrabold leading-7">{a.title}</h3>
                    <p className="mt-2 flex-1 text-[12px] leading-6 text-white/50">{a.excerpt}</p>
                    <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-white/35">{faDate(a.publishedAt)} • {faNum(a.readMinutes)} دقیقه</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- ۱۰. CTA نهایی ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="badge !text-amber-300">مشاوره رایگان</span>
              <h2 className="mt-3 text-3xl font-black leading-relaxed">آماده شروع سفر مهاجرتی خود هستید؟</h2>
              <p className="mt-3 text-sm leading-8 text-white/55">فرم را پر کنید؛ کارشناس ما در تهران یا بوداپست حداکثر تا ۲ ساعت کاری تماس می‌گیرد و مسیر پیشنهادی را توضیح می‌دهد.</p>
              <div className="mt-5"><SmartImage media={MEDIA.businessSigning} ratio="16/8" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
              <div className="mt-5 space-y-2 text-sm text-white/60">
                <p>📞 تهران: {faNum("021-91001234")}</p>
                <p>📞 بوداپست: {faNum("+36-20-123-4567")}</p>
                <p>💬 واتساپ و تلگرام: پشتیبانی سریع</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}><LeadForm /></Reveal>
        </div>
      </section>
    </div>
  );
}
