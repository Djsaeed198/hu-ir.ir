import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, LinkCards, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ابزارهای آنلاین مهاجرت | ارزیاب، محاسبه‌گر، چک‌لیست و تقویم",
  description: "ابزارهای هوشمند مجارنشین: ارزیاب شانس، محاسبه‌گر هزینه، چک‌لیست مدارک، مقایسه مسیرها و تقویم مهاجرتی.",
};

export default function ToolsHub() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ابزارها" }]} />
      <PageHero
        badge="ابزارهای هوشمند"
        title="خودتان حساب کنید، مقایسه کنید، برنامه بریزید"
        desc="۵ ابزار تعاملی رایگان که ۴۰٪ تماس‌های تلفنی را حذف کرده‌اند: ارزیابی شانس، محاسبه هزینه، چک‌لیست مدارک، مقایسه مسیرها و تقویم مهاجرتی."
        icon="🧰"
        image={MEDIA.euPassports}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-4 sm:px-6">
        <Reveal>
          <LinkCards links={[
            { href: "/assess", icon: "🎯", title: "ارزیاب شانس مهاجرت", desc: "در ۲ دقیقه شانس خود را بسنجید + پیشنهاد بهترین مسیر", image: SECTION_IMAGES.toolAssess },
            { href: "/tools/calculator", icon: "🧮", title: "محاسبه‌گر هزینه", desc: "هزینه دقیق بر اساس خدمت، نفرات و خدمات اضافی", image: SECTION_IMAGES.toolCalc },
            { href: "/tools/checklist", icon: "✅", title: "چک‌لیست مدارک", desc: "تعاملی با ذخیره پیشرفت و خروجی چاپ", image: SECTION_IMAGES.toolChecklist },
            { href: "/tools/comparison", icon: "⚖️", title: "مقایسه مسیرها", desc: "کاری، Blue Card، تحصیلی، گلدن ویزا، خوداشتغالی", image: SECTION_IMAGES.toolCompare },
            { href: "/tools/calendar", icon: "📅", title: "تقویم مهاجرتی", desc: "مهلت بورسیه، ترم‌ها و تعطیلات + یادآور", image: SECTION_IMAGES.toolCalendar },
            { href: "/track", icon: "🔍", title: "پیگیری پرونده", desc: "تایم‌لاین لحظه‌ای با کد رهگیری", image: SECTION_IMAGES.stepTrack },
          ]} />
        </Reveal>
        <Reveal><CtaBand image={MEDIA.heroParliamentDusk} /></Reveal>
      </div>
    </div>
  );
}
