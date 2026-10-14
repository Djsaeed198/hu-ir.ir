import Link from "next/link";
import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { Reveal } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { MEDIA, articleImage } from "@/lib/media";
import { faDate, faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "وبلاگ مهاجرت مجارستان ۲۰۲۶ | آکادمی و اخبار | ایران-مجارستان",
  description: "آخرین اخبار قوانین ویزا، راهنمای دانشگاه‌ها، تحلیل بازار املاک و داستان موفقیت مهاجرت به مجارستان. به‌روز با ۲۰۲۶.",
  openGraph: {
    title: "آکادمی و اخبار مهاجرتی | ایران-مجارستان",
    description: "محتوای تخصصی مهاجرت به مجارستان از منبع اصلی با ۲۵۰۰+ پرونده.",
    images: [{ url: MEDIA.chainBridgeDay.src, alt: MEDIA.chainBridgeDay.alt }],
  },
  alternates: { canonical: "https://hu-ir.ir/news" },
};

const CATS = [
  { key: "all", label: "همه" },
  { key: "news", label: "اخبار مهاجرتی" },
  { key: "academy", label: "آکادمی" },
  { key: "market", label: "تحلیل بازار" },
  { key: "community", label: "کامیونیتی" },
];

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  await ensureSeed();
  const { cat } = await searchParams;
  const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt));
  const filtered = !cat || cat === "all" ? rows : rows.filter((r) => r.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "وبلاگ", href: "/news" }]} />
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="badge !text-amber-300">آکادمی • اخبار • کامیونیتی</span>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">مرکز محتوای مجارنشین</h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-white/55">
            تحلیل قوانین جدید ویزا، راهنمای گام‌به‌گام دانشگاه‌ها، گزارش بازار املاک و رویدادهای جامعه ایرانیان مقیم
            مجارستان.
          </p>
        </div>
        <SmartImage media={MEDIA.basilicaStreet} priority sizes="(max-width: 1024px) 100vw, 45vw" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Link
            key={c.key}
            href={c.key === "all" ? "/news" : `/news?cat=${c.key}`}
            className={`badge ${(!cat || cat === "all") === (c.key === "all") || cat === c.key ? "!border-emerald-400/50 !text-emerald-300" : ""}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => {
          const img = articleImage(a.slug, i);
          return (
            <Reveal key={a.id} delay={Math.min(i, 8) * 60}>
              <Link href={`/news/${a.slug}`} className="glass glass-hover flex h-full flex-col overflow-hidden p-0">
                <SmartImage
                  media={{ ...img, alt: `${a.title} — ${a.tag}`, title: a.title }}
                  ratio="16/8"
                  rounded="rounded-none"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl" aria-hidden>{a.coverEmoji}</span>
                    <span className="badge !text-[10px] text-white/50">{a.tag}</span>
                  </div>
                  <h2 className="mt-3 text-base font-extrabold leading-7">{a.title}</h2>
                  <p className="mt-2 flex-1 text-[13px] leading-6 text-white/50">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/35">
                    <span>{faDate(a.publishedAt)}</span>
                    <span>{faNum(a.readMinutes)} دقیقه مطالعه</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
