import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, PageHero, StatGrid } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { TestimonialSlider, VisaGallery } from "@/components/upgrade-widgets";
import { SAMPLE_VISAS, TESTIMONIALS } from "@/lib/upgrade-content";
import { MEDIA } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "نظرات مشتریان و نمونه ویزاها | مجارنشین",
  description: "رضایت ۹۸٪ مشتریان؛ نظرات متنی و نمونه کارت‌های اقامت و ویزاهای صادرشده مجارستان.",
};

export default function TestimonialsPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "نظرات مشتریان" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "نظرات مشتریان" }]} />
      <PageHero
        badge="اعتماد شما"
        title="مشتریان ما چه می‌گویند؟"
        desc="۲٬۵۰۰+ پرونده موفق با ۹۸٪ رضایت؛ نظرات واقعی و نمونه ویزاهای صادرشده را ببینید."
        icon="⭐"
        image={MEDIA.passportStamps}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-4 sm:px-6">
        <Reveal><StatGrid stats={[
          { v: `+${faNum("2500")}`, l: "مشتری موفق" },
          { v: `${faNum(98)}٪`, l: "نرخ رضایت" },
          { v: `${faNum("4.8")} از ${faNum(5)}`, l: "میانگین امتیاز" },
          { v: `+${faNum(100)}`, l: "نظر ثبت‌شده" },
        ]} /></Reveal>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">اسلایدر نظرات</h2>
            <TestimonialSlider items={TESTIMONIALS} />
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="mb-2 text-xl font-black">نمونه ویزاها و کارت‌های اقامت</h2>
            <p className="mb-5 text-[13px] text-white/50">بر اساس نوع ویزا فیلتر کنید؛ برای جزئیات روی هر کارت کلیک کنید.</p>
            <VisaGallery items={SAMPLE_VISAS} />
          </div>
        </Reveal>

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-black">مشتری ما هستید؟ نظرتان را ثبت کنید</h2>
              <p className="mt-2 text-sm leading-8 text-white/55">تجربه شما به متقاضیان بعدی کمک می‌کند. پس از بررسی، نظر شما با نام منتشر می‌شود.</p>
              <div className="mt-4"><SmartImage media={MEDIA.airportSuitcase} ratio="16/8" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
              <ul className="mt-4 space-y-2 text-[13px] text-white/60">
                <li>🎥 برای نظر ویدیویی، در واتساپ به ما پیام دهید.</li>
                <li>⭐ امتیاز شما در میانگین ۴.۸ ما اثر مستقیم دارد.</li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </Reveal>

        <Reveal><CtaBand title="نفر بعدی این لیست شما باشید" image={MEDIA.heroParliamentDusk} /></Reveal>
      </div>
    </div>
  );
}
