import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { CostCalculator } from "@/components/upgrade-widgets";
import { SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "محاسبه‌گر هزینه مهاجرت مجارستان ۲۰۲۶ | یورو + تومان",
  description: "هزینه دقیق مهاجرت به مجارستان بر اساس خدمت، تعداد نفرات و خدمات اضافی. برآورد شفاف یورویی و تومانی + پیش‌فاکتور رسمی.",
  alternates: { canonical: "https://hu-ir.ir/tools/calculator" },
};

export default function CalculatorPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "محاسبه‌گر هزینه" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "محاسبه‌گر هزینه" }]} />
      <PageHero badge="ابزار آنلاین" title="محاسبه‌گر هزینه مهاجرت" desc="خدمت، تعداد نفرات و خدمات اضافی را انتخاب کنید تا برآورد شفاف یورویی و تومانی بگیرید." icon="🧮" image={SECTION_IMAGES.toolCalc} imagePriority />
      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-4 sm:px-6">
        <Reveal><CostCalculator /></Reveal>
        <Reveal><CtaBand title="پیش‌فاکتور رسمی می‌خواهید؟" desc="پس از محاسبه، کارشناس ما پیش‌فاکتور دقیق با سربرگ رسمی صادر می‌کند." image={SECTION_IMAGES.toolCalc} /></Reveal>
      </div>
    </div>
  );
}
