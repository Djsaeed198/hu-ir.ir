import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, JsonLd, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { FaqAccordion } from "@/components/upgrade-widgets";
import { FAQS } from "@/lib/upgrade-content";
import { MEDIA } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "سوالات متداول مهاجرت مجارستان ۲۰۲۶ | ویزا، کار، تحصیل",
  description: "پاسخ ۲۴ سوال پرتکرار درباره ویزا، کار، تحصیل، اقامت، تابعیت و هزینه‌های مهاجرت به مجارستان. مشاوره رایگان.",
  alternates: { canonical: "https://hu-ir.ir/faq" },
};

export default function FaqPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]} />
      <PageHero badge="پاسخ سریع" title="سوالات متداول مهاجرت به مجارستان" desc="۲۴ پاسخ دسته‌بندی‌شده درباره ویزا، کار، تحصیل، اقامت و هزینه — اگر جوابتان نیست، از دستیار هوشمند بپرسید." icon="❓" image={MEDIA.businessWomen} imagePriority />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.slice(0, 12).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
      <div className="mx-auto max-w-4xl space-y-8 px-4 pb-4 sm:px-6">
        <Reveal><FaqAccordion items={FAQS} /></Reveal>
        <Reveal><CtaBand title="سوال دیگری دارید؟" desc="دستیار هوشمند ۲۴ ساعته پاسخ می‌دهد یا جلسه مشاوره رایگان رزرو کنید." image={MEDIA.heroParliamentNight} /></Reveal>
      </div>
    </div>
  );
}
