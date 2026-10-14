import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { LEGAL_PAGES } from "@/lib/upgrade-content";
import { MEDIA } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return { title: `${page.title} | مجارنشین`, description: page.excerpt };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  const others = LEGAL_PAGES.filter((p) => p.slug !== slug);

  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "حقوقی" }, { label: page.title }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "حقوقی", href: "/legal/terms" }, { label: page.title }]} />
      <PageHero badge="اسناد حقوقی" title={page.title} desc={page.excerpt} icon={page.icon} updated={`آخرین به‌روزرسانی: ${page.updated}`} image={MEDIA.justiceStatue} />
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            {page.blocks.map((b) => <Reveal key={b.heading}><ContentSection block={b} /></Reveal>)}
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass p-5">
              <p className="mb-3 text-sm font-bold">سایر اسناد</p>
              <div className="space-y-2">
                {others.map((o) => (
                  <Link key={o.slug} href={`/legal/${o.slug}`} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] transition hover:border-emerald-400/40">
                    <span>{o.icon}</span> {o.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="glass p-5">
              <p className="text-sm font-bold">سوال حقوقی دارید؟</p>
              <p className="mt-2 text-[12px] leading-7 text-white/55">وکیل مجارستانی ما پاسخ‌گوی سوالات قراردادی و مهاجرتی شماست.</p>
              <Link href="/contact" className="btn btn-ghost mt-3 w-full !py-2 !text-xs">تماس با واحد حقوقی</Link>
            </div>
          </aside>
        </div>
        <div className="mt-10"><CtaBand image={MEDIA.chainBridgeDay} /></div>
      </div>
    </div>
  );
}
