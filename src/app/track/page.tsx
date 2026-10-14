import { TrackConsole } from "@/components/track-console";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { Reveal } from "@/components/reveal";
import { MEDIA } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "پیگیری پرونده مهاجرت مجارستان | تایم‌لاین لحظه‌ای",
  description: "با کد رهگیری، تایم‌لاین رویدادها، وضعیت مدارک، گفتگو با کارشناس و فاکتورها را لحظه‌ای ببینید.",
  alternates: { canonical: "https://hu-ir.ir/track" },
};

export default function TrackPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "پیگیری پرونده" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "پیگیری پرونده" }]} />
      <PageHero
        badge="شفافیت کامل"
        title="پیگیری لحظه‌ای پرونده"
        desc={`تایم‌لاین رویدادها، وضعیت مدارک، گفتگو با کارشناس و فاکتورها — بدون تماس تلفنی. بیش از ${faNum("12000")} رویداد پرونده‌ای در سامانه ثبت شده است.`}
        image={MEDIA.airportPhone}
        imagePriority
      />
      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-4 sm:px-6">
        <TrackConsole initialBundle={null} />
        <Reveal><CtaBand title="کد رهگیری ندارید؟" desc="اولین پرونده خود را در کمتر از ۵ دقیقه ثبت کنید و کد بگیرید." image={MEDIA.passportStamps} /></Reveal>
      </div>
    </div>
  );
}
