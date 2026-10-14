import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { MigrationCalendar } from "@/components/upgrade-widgets";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "تقویم مهاجرتی مجارستان ۲۰۲۶ | مهلت بورسیه و ترم‌ها",
  description: "مهلت بورسیه Stipendium، ترم‌های دانشگاه، تعطیلات رسمی و پیک سفارت مجارستان + یادآور ذخیره‌شونده.",
  alternates: { canonical: "https://hu-ir.ir/tools/calendar" },
};

export default function CalendarPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "تقویم مهاجرتی" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "تقویم مهاجرتی" }]} />
      <PageHero badge="ابزار آنلاین" title="تقویم مهاجرتی مجارستان" desc="مهلت‌ها را از دست ندهید: بورسیه، ترم‌ها، تعطیلات ادارات و پیک‌های سفارت — با یادآور ذخیره‌شونده." icon="📅" image={SECTION_IMAGES.toolCalendar} imagePriority />
      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-4 sm:px-6">
        <Reveal><MigrationCalendar /></Reveal>
        <Reveal><CtaBand title="مهلت مهمی نزدیک است؟" desc="کارشناس ما برنامه اقدام فوری شما را در یک جلسه رایگان می‌چیند." image={MEDIA.graduationCaps} /></Reveal>
      </div>
    </div>
  );
}
