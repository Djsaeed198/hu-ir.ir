import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, LinkCards, PageHero, StepsFlow } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { PROCESS_STEPS } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "فرآیند مهاجرت به مجارستان | مراحل، مدارک، هزینه و زمان‌بندی",
  description: "نقشه راه کامل مهاجرت به مجارستان: ۷ مرحله از مشاوره تا استقرار، مدارک، هزینه‌ها، زمان‌بندی و سوالات متداول.",
};

export default function ProcessHub() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "فرآیند مهاجرت", href: "/process" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "فرآیند مهاجرت" }]} />
      <PageHero
        badge="نقشه راه"
        title="مسیر شما به مجارستان در ۷ گام شفاف"
        desc="از مشاوره رایگان تا استقرار کامل؛ هر مرحله با زمان‌بندی، مدارک و هزینه مشخص. بدون ابهام، بدون هزینه پنهان."
        icon="🗺️"
        image={MEDIA.chainBridgeDay}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 pb-4 sm:px-6">
        <Reveal>
          <LinkCards links={[
            { href: "/process/steps", icon: "👣", title: "مراحل کلی", desc: "فلوچارت کامل ۷ مرحله مهاجرت", image: SECTION_IMAGES.stepConsult },
            { href: "/process/documents", icon: "📄", title: "مدارک مورد نیاز", desc: "لیست تفکیکی هر نوع ویزا", image: MEDIA.passportStamps },
            { href: "/process/costs", icon: "💰", title: "هزینه‌ها", desc: "جدول دولتی، خدماتی و جانبی", image: SECTION_IMAGES.toolCalc },
            { href: "/process/timeline", icon: "⏱️", title: "زمان‌بندی", desc: "تخمین دقیق هر مسیر + عوامل تأخیر", image: SECTION_IMAGES.stepTrack },
            { href: "/process/faq", icon: "❓", title: "سوالات متداول", desc: "۲۴ پاسخ دسته‌بندی‌شده", image: MEDIA.businessWomen },
            { href: "/process/checklist", icon: "✅", title: "چک‌لیست هوشمند", desc: "تعاملی با ذخیره پیشرفت", image: SECTION_IMAGES.toolChecklist },
          ]} />
        </Reveal>
        <Reveal>
          <div>
            <h2 className="mb-6 text-xl font-black">نمای کلی ۷ گام</h2>
            <StepsFlow steps={PROCESS_STEPS} />
          </div>
        </Reveal>
        <Reveal><CtaBand image={MEDIA.heroParliamentNight} /></Reveal>
      </div>
    </div>
  );
}
