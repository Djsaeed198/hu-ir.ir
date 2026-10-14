import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, JsonLd, PageHero } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LeadMagnets, RelatedSearches, ShareButtons } from "@/components/seo-blocks";
import { CITIES } from "@/lib/upgrade-content";
import { MEDIA, cityImage } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) return {};
  const img = cityImage(city);
  const title = city === "budapest"
    ? "زندگی در بوداپست | هزینه و راهنما ۲۰۲۶ | ایران-مجارستان"
    : `زندگی در ${c.nameFa} ۲۰۲۶ | هزینه، دانشگاه و کار | ایران-مجارستان`;
  return {
    title,
    description: city === "budapest"
      ? "راهنمای کامل زندگی در بوداپست ۲۰۲۶: هزینه زندگی، اجاره، حمل و نقل و تفریح. مشاوره رایگان."
      : `${c.intro} مشاوره رایگان با ایران-مجارستان.`,
    openGraph: { title, description: c.intro, images: [{ url: img.src, alt: img.alt }], locale: "fa_IR", type: "article" },
    alternates: { canonical: `https://hu-ir.ir/hungary/cities/${city}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = CITIES.find((x) => x.slug === city);
  if (!c) notFound();
  const others = CITIES.filter((x) => x.slug !== city);
  const hero = cityImage(city);

  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "مجارستان", href: "/hungary" }, { label: "شهرها", href: "/hungary/cities" }, { label: c.nameFa }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "مجارستان", href: "/hungary" }, { label: "شهرها", href: "/hungary/cities" }, { label: c.nameFa }]} />
      <PageHero badge={`شهرهای مجارستان • ${c.nameEn}`} title={`زندگی در ${c.nameFa}`} desc={c.intro} icon={c.icon} updated="به‌روزرسانی: ۲۰۲۶" image={hero} imagePriority />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: `زندگی در ${c.nameFa}`, description: c.intro, image: hero.src, inLanguage: "fa-IR", author: { "@type": "Organization", name: "ایران-مجارستان" } }} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/contact" className="btn btn-primary !py-2 !text-xs">🎯 مشاوره رایگان</Link>
          <Link href="/tools/calculator" className="btn btn-ghost !py-2 !text-xs">محاسبه هزینه زندگی</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "جمعیت", v: c.population },
            { l: "هزینه ماهانه", v: c.cost },
            { l: "اجاره", v: c.rent },
          ].map((s) => (
            <div key={s.l} className="glass p-5 text-center">
              <p className="text-lg font-black text-emerald-300">{s.v}</p>
              <p className="mt-1 text-[11px] text-white/45">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full overflow-hidden p-0">
              <SmartImage media={{ ...hero, alt: `جاذبه‌های ${c.nameFa} — ${c.attractions.slice(0, 3).join("، ")}`, title: `جاذبه‌های ${c.nameFa}` }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="p-6">
                <h2 className="text-base font-extrabold">📸 جاذبه‌ها</h2>
                <ul className="mt-4 space-y-2">
                  {c.attractions.map((a) => <li key={a} className="flex gap-2 text-[13px] text-white/65"><span className="text-emerald-400">▸</span>{a}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="glass h-full overflow-hidden p-0">
              <SmartImage media={MEDIA.nightStreetCafe} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="p-6">
                <h2 className="text-base font-extrabold">🏡 زندگی</h2>
                <ul className="mt-4 space-y-2">
                  {c.life.map((a) => <li key={a} className="flex gap-2 text-[13px] text-white/65"><span className="text-emerald-400">▸</span>{a}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="glass h-full overflow-hidden p-0">
              <SmartImage media={MEDIA.graduationGroup} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="p-6">
                <h2 className="text-base font-extrabold">🎓 تحصیل</h2>
                <ul className="mt-4 space-y-2">
                  {c.study.map((a) => <li key={a} className="flex gap-2 text-[13px] text-white/65"><span className="text-sky-300">▸</span>{a}</li>)}
                </ul>
                <Link href="/services/study-admission" className="btn btn-ghost mt-4 !py-2 !text-xs">درخواست پذیرش ←</Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="glass h-full overflow-hidden p-0">
              <SmartImage media={MEDIA.businessMeeting} ratio="16/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="p-6">
                <h2 className="text-base font-extrabold">💼 کار</h2>
                <p className="mt-4 text-[13px] leading-8 text-white/65">{c.work}</p>
                <Link href="/services/work-permit" className="btn btn-ghost mt-4 !py-2 !text-xs">فرصت‌های شغلی ←</Link>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <RelatedSearches items={[
            { label: `هزینه زندگی در ${c.nameFa}`, href: "/hungary/cost-of-living" },
            { label: "مقایسه شهرهای مجارستان", href: "/hungary/cities" },
            { label: "تحصیل در مجارستان", href: "/hungary/study" },
            { label: "ارزیاب شانس مهاجرت", href: "/assess" },
          ]} />
        </Reveal>
        <ShareButtons title={`زندگی در ${c.nameFa}`} />

        <div>
          <h2 className="mb-4 text-lg font-black">سایر شهرها</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => {
              const img = cityImage(o.slug);
              return (
                <Link key={o.slug} href={`/hungary/cities/${o.slug}`} className="glass glass-hover overflow-hidden p-0">
                  <SmartImage media={{ ...img, alt: `زندگی در ${o.nameFa}`, title: o.nameFa }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 25vw" />
                  <div className="p-4">
                    <p className="text-sm font-bold">{o.icon} {o.nameFa}</p>
                    <p className="mt-1 text-[11px] text-white/40">{o.cost}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <Reveal><LeadMagnets /></Reveal>
        <Reveal><CtaBand title={`قصد زندگی در ${c.nameFa} را دارید؟`} image={hero} /></Reveal>
      </div>
    </div>
  );
}
