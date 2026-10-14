import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, JsonLd, PageHero } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LeadMagnets, RelatedSearches, ShareButtons } from "@/components/seo-blocks";
import { LawAlert } from "@/components/upgrade-widgets";
import { CITIES, HUNGARY_PAGES } from "@/lib/upgrade-content";
import { cityImage, guideImage } from "@/lib/media";

export const dynamic = "force-dynamic";

const SEO_META: Record<string, { title: string; desc: string }> = {
  why: {
    title: "چرا مجارستان؟ مقایسه با آلمان و کانادا | ایران-مجارستان",
    desc: "مقایسه کامل مجارستان با آلمان، فرانسه و کانادا برای مهاجرت ایرانیان. هزینه، مالیات، اقامت و تحصیل.",
  },
  "cost-of-living": {
    title: "هزینه زندگی در مجارستان ۲۰۲۶ | بوداپست و شهرستان",
    desc: "جدول دقیق هزینه زندگی در مجارستان ۲۰۲۶: اجاره، غذا، حمل‌ونقل. مقایسه بوداپست با شهرستان و برلین.",
  },
  work: {
    title: "کار در مجارستان ۲۰۲۶ | حقوق، قوانین و Blue Card",
    desc: "راهنمای کار در مجارستان ۲۰۲۶: حقوق مشاغل، قوانین جدید، Blue Card و مالیات. مشاوره رایگان.",
  },
  study: {
    title: "تحصیل در مجارستان ۲۰۲۶ | دانشگاه‌ها و بورسیه",
    desc: "راهنمای تحصیل در مجارستان: ۲۱ دانشگاه، شهریه، بورسیه Stipendium Hungaricum و کار دانشجویی.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = HUNGARY_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  const seo = SEO_META[slug];
  const img = guideImage(slug);
  return {
    title: seo?.title ?? `${page.title} ۲۰۲۶ | راهنمای مجارستان | ایران-مجارستان`,
    description: seo?.desc ?? `${page.excerpt}. مشاوره رایگان با ایران-مجارستان.`,
    openGraph: { title: page.title, description: page.excerpt, images: [{ url: img.src, alt: img.alt }], locale: "fa_IR", type: "article" },
    alternates: { canonical: `https://hu-ir.ir/hungary/${slug}` },
  };
}

export default async function HungaryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = HUNGARY_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const others = HUNGARY_PAGES.filter((p) => p.slug !== slug).slice(0, 6);
  const hero = guideImage(slug);

  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "مجارستان", href: "/hungary" }, { label: page.title }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "مجارستان", href: "/hungary" }, { label: page.title }]} />
      <PageHero badge="راهنمای مجارستان" title={page.title} desc={page.excerpt} icon={page.icon} updated={page.updated} image={hero} imagePriority />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: page.title, description: page.excerpt, image: hero.src, inLanguage: "fa-IR", author: { "@type": "Organization", name: "ایران-مجارستان" } }} />

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        {slug === "work" && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-amber-300/25">
            <LawAlert />
          </div>
        )}
        {/* CTA اولیه */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/contact" className="btn btn-primary !py-2 !text-xs">🎯 مشاوره رایگان</Link>
          <Link href="/assess" className="btn btn-ghost !py-2 !text-xs">ارزیاب شانس</Link>
          <Link href="/tools/calculator" className="btn btn-ghost !py-2 !text-xs">محاسبه هزینه</Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            {page.blocks.map((b, i) => (
              <Reveal key={b.heading}><ContentSection block={b} image={i === 1 ? hero : undefined} /></Reveal>
            ))}
            {slug === "cities" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {CITIES.map((c) => {
                  const img = cityImage(c.slug);
                  return (
                    <Link key={c.slug} href={`/hungary/cities/${c.slug}`} className="glass glass-hover overflow-hidden p-0">
                      <SmartImage media={{ ...img, alt: `زندگی در ${c.nameFa} — راهنمای شهر`, title: c.nameFa }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                      <div className="p-5">
                        <p className="text-sm font-extrabold">{c.icon} {c.nameFa} ({c.nameEn})</p>
                        <p className="mt-1 text-[11px] text-white/45">👥 {c.population} • 💰 {c.cost}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Reveal><RelatedSearches items={[
              { label: "هزینه زندگی در بوداپست", href: "/hungary/cost-of-living" },
              { label: "کار در مجارستان", href: "/hungary/work" },
              { label: "تحصیل در مجارستان", href: "/hungary/study" },
              { label: "مقایسه مسیرهای مهاجرت", href: "/tools/comparison" },
            ]} /></Reveal>
            <ShareButtons title={page.title} />
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="glass p-5">
              <p className="mb-3 text-sm font-bold">سایر راهنماها</p>
              <div className="space-y-2">
                {others.map((o) => {
                  const img = guideImage(o.slug);
                  return (
                    <Link key={o.slug} href={`/hungary/${o.slug}`} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-[13px] transition hover:border-emerald-400/40">
                      <SmartImage media={{ ...img, alt: o.title, title: o.title }} ratio="1/1" rounded="rounded-lg" sizes="48px" className="!w-12 shrink-0" />
                      <span>{o.icon} {o.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="glass overflow-hidden border-emerald-400/25 p-0">
              <SmartImage media={hero} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 30vw" />
              <div className="p-5">
                <p className="text-sm font-bold text-emerald-300">سفر آشنایی با مجارستان</p>
                <p className="mt-2 text-[12px] leading-7 text-white/55">تور ۵ روزه بوداپست + جلسه با وکیل + بازدید دانشگاه/ملک. ویزای توریستی با ما.</p>
                <Link href="/contact" className="btn btn-primary mt-4 w-full !py-2 !text-xs">رزرو مشاوره تور</Link>
              </div>
            </div>
          </aside>
        </div>
        <div className="mt-10 space-y-5">
          <Reveal><LeadMagnets /></Reveal>
          <Reveal><CtaBand image={hero} /></Reveal>
        </div>
      </div>
    </div>
  );
}
