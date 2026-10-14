import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, PageHero } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LeadMagnets, MicroIntent } from "@/components/seo-blocks";
import { CITIES, COUNTRY_COMPARISON, HUNGARY_PAGES, WHY_HUNGARY } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES, cityImage, guideImage } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "راهنمای مجارستان ۲۰۲۶ | زندگی، کار، تحصیل و شهرها",
  description: "راهنمای جامع مجارستان ۲۰۲۶: هزینه زندگی، شهرها، فرهنگ، تحصیل، کار و سرمایه‌گذاری. مقایسه با آلمان و کانادا. مشاوره رایگان.",
  openGraph: {
    title: "راهنمای کشور مجارستان | ایران-مجارستان",
    description: "همه‌چیز درباره زندگی در مجارستان با داده‌های ۲۰۲۶.",
    images: [{ url: MEDIA.chainBridgeAerial.src, alt: MEDIA.chainBridgeAerial.alt }],
  },
  alternates: { canonical: "https://hu-ir.ir/hungary" },
};

const WHY_IMGS = [SECTION_IMAGES.whyEdu, SECTION_IMAGES.whyCost, SECTION_IMAGES.whyEu, SECTION_IMAGES.whyEconomy, SECTION_IMAGES.whyCulture, SECTION_IMAGES.whyLocation];

export default function HungaryHub() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "مجارستان", href: "/hungary" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "کشور مجارستان" }]} />
      <PageHero
        badge="راهنمای کشور"
        title="مجارستان را بشناسید؛ قلب تپنده اروپا"
        desc="همه‌چیز درباره زندگی، تحصیل، کار، سرمایه‌گذاری و شهرهای مجارستان — با داده‌های به‌روز ۲۰۲۶ و تجربه ۲٬۵۰۰+ پرونده."
        icon="🇭🇺"
        image={MEDIA.heroParliamentDusk}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-4 sm:px-6">
        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">چرا مجارستان؟ ({faNum(6)} مزیت کلیدی)</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WHY_HUNGARY.map((w, i) => (
                <Link key={w.title} href="/hungary/why" className="glass glass-hover overflow-hidden p-0">
                  <SmartImage media={{ ...WHY_IMGS[i % WHY_IMGS.length], alt: `${w.title} — مزیت مهاجرت به مجارستان`, title: w.title }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="p-5">
                    <p className="text-sm font-extrabold"><span aria-hidden>{w.icon}</span> {w.title}</p>
                    <p className="mt-1.5 text-[12px] leading-7 text-white/55">{w.text}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/hungary/why" className="btn btn-ghost mt-5 !py-2 !text-xs">مقایسه کامل با آلمان و کانادا ←</Link>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">شهرها ({faNum(CITIES.length)} شهر اصلی)</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((c) => {
                const img = cityImage(c.slug);
                return (
                  <Link key={c.slug} href={`/hungary/cities/${c.slug}`} className="glass glass-hover overflow-hidden p-0">
                    <div className="relative">
                      <SmartImage media={{ ...img, alt: `زندگی در ${c.nameFa} مجارستان — هزینه و راهنما`, title: `زندگی در ${c.nameFa} | مجارستان` }} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                      <span className="absolute left-3 top-3 badge !bg-black/60 !text-[10px] backdrop-blur" dir="ltr">{c.nameEn}</span>
                    </div>
                    <div className="p-5">
                      <p className="text-base font-extrabold"><span aria-hidden>{c.icon}</span> {c.nameFa}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-6 text-white/50">{c.intro}</p>
                      <div className="mt-3 flex gap-2 text-[10px] text-white/40">
                        <span className="badge !text-[10px]">👥 {c.population}</span>
                        <span className="badge !text-[10px]">💰 {c.cost}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link href="/hungary/cities" className="glass glass-hover overflow-hidden p-0">
                <SmartImage media={MEDIA.sopronStreet} ratio="16/8" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="grid place-items-center p-5 text-center">
                  <div>
                    <p className="text-sm font-extrabold">🗺️ مقایسه همه شهرها</p>
                    <p className="mt-1 text-[12px] text-white/50">جدول جمعیت، هزینه و ویژگی‌ها</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">راهنماهای موضوعی</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUNGARY_PAGES.map((p) => {
                const img = guideImage(p.slug);
                return (
                  <Link key={p.slug} href={`/hungary/${p.slug}`} className="glass glass-hover overflow-hidden p-0">
                    <SmartImage media={{ ...img, alt: `${p.title} — راهنمای مجارستان ۲۰۲۶`, title: `${p.title} | مجارستان` }} ratio="16/6" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="flex items-start gap-3 p-5">
                      <span className="text-2xl" aria-hidden>{p.icon}</span>
                      <span>
                        <span className="block text-sm font-extrabold">{p.title}</span>
                        <span className="mt-1 block text-[12px] leading-6 text-white/50">{p.excerpt}</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal><MicroIntent /></Reveal>
        <Reveal><ContentSection block={{ heading: "مجارستان در یک نگاه مقایسه‌ای", table: COUNTRY_COMPARISON }} image={MEDIA.euPassports} /></Reveal>
        <Reveal><LeadMagnets /></Reveal>
        <Reveal><CtaBand image={MEDIA.heroParliamentNight} /></Reveal>
      </div>
    </div>
  );
}
