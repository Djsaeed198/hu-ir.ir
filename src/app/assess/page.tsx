import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/assessment-wizard";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd, LeadMagnets } from "@/components/seo-blocks";
import { Reveal } from "@/components/reveal";
import { MEDIA } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ارزیاب شانس مهاجرت مجارستان ۲۰۲۶ | رایگان در ۲ دقیقه",
  description: "شانس مهاجرت خود را بسنجید: امتیاز ۰ تا ۱۰۰، بهترین مسیر، ریسک‌ها و زمان تخمینی. رایگان با موتور توصیه‌گر هوشمند.",
  alternates: { canonical: "https://hu-ir.ir/assess" },
};

export default function AssessPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ارزیاب شانس" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ارزیاب شانس" }]} />
      <PageHero
        badge="موتور توصیه‌گر + ارزیاب شانس"
        title="ارزیابی هوشمند پرونده مهاجرتی"
        desc="۶ پارامتر کلیدی را انتخاب کنید؛ سامانه شانس موفقیت، ریسک‌ها، زمان تخمینی و بهترین مسیرهای حقوقی مهاجرت به مجارستان را محاسبه می‌کند."
        image={MEDIA.euPassports}
        imagePriority
      />
      <div className="mx-auto max-w-5xl space-y-10 px-4 pb-4 sm:px-6">
        <AssessmentWizard />
        <Reveal><LeadMagnets /></Reveal>
        <Reveal><CtaBand title="نتیجه‌تان را با کارشناس بررسی کنید" image={MEDIA.businessMeeting} /></Reveal>
      </div>
    </div>
  );
}
