import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LeadMagnets, RelatedSearches, ShareButtons } from "@/components/seo-blocks";
import { articleImage } from "@/lib/media";
import { faDate, faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await ensureSeed();
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  if (!article) return {};
  const img = articleImage(slug);
  return {
    title: `${article.title} | وبلاگ ایران-مجارستان`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [{ url: img.src, alt: img.alt }], locale: "fa_IR", type: "article" },
    alternates: { canonical: `https://hu-ir.ir/news/${slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await ensureSeed();
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  if (!article) notFound();

  const more = await db.select().from(articles).where(ne(articles.slug, slug)).orderBy(desc(articles.publishedAt)).limit(4);
  const hero = articleImage(slug);

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "وبلاگ", href: "/news" }, { label: article.title }]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, image: hero.src, inLanguage: "fa-IR", author: { "@type": "Organization", name: "ایران-مجارستان" }, datePublished: article.publishedAt?.toISOString() }} />
      <nav aria-label="مسیر صفحه" className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white">خانه</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-white">آکادمی و اخبار</Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass overflow-hidden p-0">
          <SmartImage media={{ ...hero, alt: `${article.title} — ${article.tag}`, title: article.title }} priority ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 60vw" />
          <div className="p-6 sm:p-8">
            <span className="text-4xl" aria-hidden>{article.coverEmoji}</span>
            <h1 className="mt-4 text-2xl font-black leading-relaxed sm:text-3xl">{article.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-white/40">
              <span className="badge !text-[10px] text-emerald-300">{article.tag}</span>
              <span>{faDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{faNum(article.readMinutes)} دقیقه مطالعه</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/contact" className="btn btn-primary !py-2 !text-xs">🎯 مشاوره رایگان</Link>
              <Link href="/assess" className="btn btn-ghost !py-2 !text-xs">ارزیاب شانس</Link>
            </div>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-8 text-white/70">
              {article.excerpt}
            </p>
            <div className="mt-6 space-y-4 text-sm leading-8 text-white/65">
              {article.body.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4"><ShareButtons title={article.title} /></div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass p-5">
            <p className="text-sm font-bold">مشاوره تخصصی برای پرونده شما</p>
            <p className="mt-2 text-[12px] leading-6 text-white/50">
              کارشناسان تهران و بوداپست آماده بررسی شرایط شما هستند.
            </p>
            <div className="mt-4">
              <LeadForm compact />
            </div>
          </div>
          <div className="glass p-5">
            <p className="mb-3 text-sm font-bold">مطالب مرتبط</p>
            <div className="space-y-2">
              {more.map((m, i) => {
                const img = articleImage(m.slug, i + 1);
                return (
                  <Link
                    key={m.id}
                    href={`/news/${m.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 transition hover:border-emerald-400/40"
                  >
                    <SmartImage media={{ ...img, alt: m.title, title: m.title }} ratio="1/1" rounded="rounded-lg" sizes="64px" className="!w-16 shrink-0" />
                    <span>
                      <span className="block text-[13px] font-bold leading-6">{m.title}</span>
                      <span className="mt-1 block text-[10px] text-white/35">{faDate(m.publishedAt)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-8 space-y-5">
        <RelatedSearches items={[
          { label: "قوانین جدید مهاجرت ۲۰۲۶", href: "/services/work-permit" },
          { label: "بورسیه مجارستان", href: "/services/study-admission" },
          { label: "هزینه زندگی در بوداپست", href: "/hungary/cost-of-living" },
        ]} />
        <LeadMagnets />
      </div>
    </article>
  );
}
