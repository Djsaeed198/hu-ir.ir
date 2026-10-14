import Link from "next/link";
import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { SmartImage } from "@/components/smart-image";
import { MEDIA, serviceImage } from "@/lib/media";
import { faMoney, faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "خدمات مهاجرت مجارستان ۲۰۲۶ | کاری، تحصیلی، گلدن ویزا",
  description: "کاتالوگ کامل خدمات ایران-مجارستان: مهاجرت کاری، تحصیلی، گلدن ویزا، ثبت شرکت، املاک، گمرک و خدمات پس از ورود. مشاوره رایگان.",
  openGraph: {
    title: "خدمات مهاجرت مجارستان | ایران-مجارستان",
    description: "۲۴+ خدمت تخصصی با پیگیری آنلاین و قرارداد رسمی.",
    images: [{ url: MEDIA.businessMeeting.src, alt: MEDIA.businessMeeting.alt }],
  },
  alternates: { canonical: "https://hu-ir.ir/services" },
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  await ensureSeed();
  const { cat, q } = await searchParams;
  const all = await db.select().from(services).orderBy(desc(services.popularity));
  const categories = [...new Set(all.map((s) => s.category))];

  const filtered = all.filter((s) => {
    const okCat = !cat || cat === "all" || s.category === cat;
    const okQ = !q || `${s.titleFa} ${s.summary} ${s.category}`.includes(q);
    return okCat && okQ;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "خدمات", href: "/services" }]} />
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="badge !text-emerald-300">کاتالوگ خدمات</span>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{faNum(all.length)} خدمت تخصصی ایران-مجارستان</h1>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-white/55">
            مهاجرت کاری، تحصیلی، گلدن ویزا، ثبت شرکت، املاک، زبان، گمرک و لجستیک، درمان، حقوقی، پس از ورود و خدمات
            سازمانی — همه با پیگیری آنلاین در سامانه هوشمند.
          </p>
        </div>
        <SmartImage media={MEDIA.heroParliamentDusk} priority sizes="(max-width: 1024px) 100vw, 45vw" />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <form className="glass flex items-center gap-2 p-3" action="/services" role="search">
          <input name="q" defaultValue={q ?? ""} className="field !border-0 !bg-transparent" placeholder="جستجوی خدمت…" aria-label="جستجوی خدمت" />
          <button className="btn btn-primary !py-2 !text-xs">جستجو</button>
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/services"
            className={`badge ${!cat || cat === "all" ? "!border-emerald-400/50 !text-emerald-300" : ""}`}
          >
            همه ({faNum(all.length)})
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/services?cat=${encodeURIComponent(c)}`}
              className={`badge ${cat === c ? "!border-emerald-400/50 !text-emerald-300" : ""}`}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => {
          const img = serviceImage(s.slug);
          return (
            <Reveal key={s.id} delay={Math.min(i, 8) * 50}>
              <Link href={`/services/${s.slug}`} className="glass glass-hover flex h-full flex-col overflow-hidden p-0">
                <div className="relative">
                  <SmartImage
                    media={{ ...img, alt: `${s.titleFa} — ${s.summary.slice(0, 60)}`, title: `${s.titleFa} | ایران-مجارستان` }}
                    ratio="16/8"
                    rounded="rounded-none"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <span className="absolute right-3 top-3 badge !bg-black/60 !text-[10px] text-white/80 backdrop-blur">{s.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden>{s.icon}</span>
                    <h2 className="text-base font-extrabold leading-7">{s.titleFa}</h2>
                  </div>
                  <p className="mt-1 text-[11px] text-white/35" dir="ltr">{s.titleEn}</p>
                  <p className="mt-3 flex-1 text-[13px] leading-6 text-white/50">{s.summary}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center text-[10px]">
                    <div>
                      <p className="text-sm font-bold text-emerald-300">{faNum(s.successRate)}٪</p>
                      <p className="text-white/40">موفقیت</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sky-300">{faNum(s.durationLabel)}</p>
                      <p className="text-white/40">مدت زمان</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-300">{faMoney(s.priceFromEur)}</p>
                      <p className="text-white/40">شروع هزینه</p>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="glass mt-10 p-10 text-center text-sm text-white/50">خدمتی با این فیلتر یافت نشد.</p>
      )}
    </div>
  );
}
