import Link from "next/link";
import { JsonLd } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { MEDIA } from "@/lib/media";

const SITE = "https://hu-ir.ir";

/* ---------- BreadcrumbList ---------- */
export function BreadcrumbJsonLd({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.label,
          ...(t.href ? { item: `${SITE}${t.href}` } : {}),
        })),
      }}
    />
  );
}

/* ---------- FAQ ---------- */
export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

/* ---------- LocalBusiness (NAP یکسان) ---------- */
export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE}/#business`,
        name: "مجموعه ایران-مجارستان (مجارنشین)",
        alternateName: "Magyarneshin Iran-Hungary",
        url: SITE,
        telephone: "+98-21-91001234",
        email: "info@magyarneshin.ir",
        priceRange: "€€",
        address: [
          { "@type": "PostalAddress", name: "دفتر تهران", streetAddress: "خیابان ولیعصر، بالاتر از پارک ساعی", addressLocality: "تهران", addressCountry: "IR", telephone: "021-91001234" },
          { "@type": "PostalAddress", name: "دفتر بوداپست", streetAddress: "نزدیک پارلمان، منطقه ۵، خیابان Kossuth", addressLocality: "بوداپست", addressCountry: "HU", telephone: "+36-20-123-4567" },
        ],
        geo: { "@type": "GeoCoordinates", latitude: 47.4979, longitude: 19.0402 },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "18:00" },
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "2500" },
        sameAs: ["https://instagram.com/magyarneshin", "https://t.me/magyarneshin", "https://linkedin.com/company/magyarneshin", "https://youtube.com/@magyarneshin"],
      }}
    />
  );
}

/* ---------- کارت NAP ---------- */
export function NapCard() {
  return (
    <div className="glass p-5">
      <p className="text-sm font-bold">📍 نشانی و تماس رسمی (NAP)</p>
      <div className="mt-3 grid gap-3 text-[12px] leading-7 text-white/60 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-extrabold text-white">دفتر تهران — مجموعه ایران-مجارستان</p>
          <p className="mt-1">خیابان ولیعصر، بالاتر از پارک ساعی، ساختمان مجارنشین</p>
          <p dir="ltr" className="mt-1 text-left font-mono">021-91001234</p>
          <p className="text-white/40">شنبه تا پنجشنبه ۹ تا ۱۸</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-extrabold text-white">دفتر بوداپست — Magyarneshin Budapest</p>
          <p className="mt-1">نزدیک پارلمان، منطقه ۵، خیابان Kossuth</p>
          <p dir="ltr" className="mt-1 text-left font-mono">+36-20-123-4567</p>
          <p className="text-white/40">دوشنبه تا جمعه ۹ تا ۱۷</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- جدول Micro-Intent ---------- */
const MICRO_INTENTS = [
  { q: "شرایط مهاجرت مجارستان", intent: "اطلاعاتی", href: "/services", cta: "ارزیاب شانس" },
  { q: "هزینه مهاجرت به مجارستان ۲۰۲۶", intent: "ارزیابی", href: "/tools/calculator", cta: "محاسبه کنید" },
  { q: "ویزای مجارستان برای ایرانیان", intent: "تراکنشی", href: "/services/work-permit", cta: "مشاوره رایگان" },
  { q: "بهترین دانشگاه مجارستان برای پزشکی", intent: "مقایسه", href: "/services/study-admission", cta: "لیست دانشگاه‌ها" },
  { q: "گلدن ویزا مجارستان چقدر طول می‌کشد", intent: "ارزیابی", href: "/services/golden-visa", cta: "تخمین زمان" },
];

export function MicroIntent() {
  return (
    <div className="glass p-5 sm:p-6">
      <h2 className="text-base font-extrabold">🎯 دقیقاً دنبال چه چیزی هستید؟ (جست‌وجوی هدفمند)</h2>
      <p className="mt-2 text-[12px] leading-7 text-white/50">
        مستقیم به پاسخ برسید — بدون تماس تلفنی. نرخ تبدیل جست‌وجوهای دقیق تا ۲.۵ برابر بیشتر است.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="data-table">
          <thead>
            <tr><th>جست‌وجو</th><th>نوع نیاز</th><th>اقدام</th></tr>
          </thead>
          <tbody>
            {MICRO_INTENTS.map((m) => (
              <tr key={m.q}>
                <td className="font-bold">{m.q}</td>
                <td><span className="badge !text-[10px]">{m.intent}</span></td>
                <td><Link href={m.href} className="btn btn-ghost !py-1.5 !text-[11px]">{m.cta} ←</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- لیدمگنت ---------- */
const MAGNETS = [
  { href: "/tools/checklist", icon: "📋", t: "چک‌لیست PDF مدارک مهاجرت", d: "فهرست کامل مدارک هر ویزا — قابل چاپ و ذخیره پیشرفت", img: MEDIA.passportBag },
  { href: "/services/work-permit", icon: "💳", t: "راهنمای Blue Card ۲۰۲۶", d: "شرایط، سقف حقوقی و مراحل کارت آبی اروپا", img: MEDIA.developerOffice },
  { href: "/contact", icon: "🎥", t: "وبینار تغییرات قوانین ۲۰۲۶", d: "۶۰ دقیقه با وکیل مجارستانی — ثبت‌نام رایگان", img: MEDIA.heroParliamentDusk },
  { href: "/assess", icon: "🎯", t: "ارزیاب شانس مهاجرت", d: "در ۲ دقیقه شانس و بهترین مسیر خود را ببینید", img: MEDIA.euPassports },
];

export function LeadMagnets() {
  return (
    <div className="glass p-5 sm:p-6">
      <h2 className="text-base font-extrabold">🎁 منابع رایگان (دانلود فوری)</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {MAGNETS.map((m) => (
          <Link key={m.t} href={m.href} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-emerald-400/40">
            <SmartImage media={m.img} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 50vw" />
            <div className="p-4">
              <p className="text-[13px] font-extrabold">{m.icon} {m.t}</p>
              <p className="mt-1 text-[11px] leading-6 text-white/50">{m.d}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- جست‌وجوهای مرتبط ---------- */
export function RelatedSearches({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className="glass p-5">
      <p className="mb-3 text-sm font-bold">🔎 جست‌وجوهای مرتبط</p>
      <div className="flex flex-wrap gap-2">
        {items.map((r) => (
          <Link key={r.label} href={r.href} className="badge transition hover:border-emerald-400/50 hover:text-emerald-200">
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- اشتراک‌گذاری ---------- */
export function ShareButtons({ title }: { title: string }) {
  const text = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/45">
      <span>اشتراک‌گذاری:</span>
      <a className="badge hover:border-emerald-400/50" href={`https://t.me/share/url?text=${text}`} target="_blank" rel="nofollow noopener">تلگرام</a>
      <a className="badge hover:border-emerald-400/50" href={`https://wa.me/?text=${text}`} target="_blank" rel="nofollow noopener">واتساپ</a>
      <a className="badge hover:border-emerald-400/50" href={`https://www.linkedin.com/sharing/share-offsite/?mini=true`} target="_blank" rel="nofollow noopener">لینکدین</a>
    </div>
  );
}
