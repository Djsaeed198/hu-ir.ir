import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { SmartImage } from "@/components/smart-image";
import { PATH_COMPARISON } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "مقایسه مسیرهای مهاجرت مجارستان ۲۰۲۶ | کاری، Blue Card، تحصیلی",
  description: "مقایسه دقیق ۵ مسیر مهاجرت: هزینه، زمان، شرایط و امتیاز. Blue Card، کاری، تحصیلی، گلدن ویزا و خوداشتغالی.",
  alternates: { canonical: "https://hu-ir.ir/tools/comparison" },
};

const RECOMMEND = [
  { icon: "💻", title: "متخصص IT / مهندسی", text: "Blue Card با امتیاز ۹ از ۱۰؛ سریع، معتبر و با حقوق بالا.", img: "developerOffice" as const },
  { icon: "🎨", title: "فریلنسر و مشاور", text: "خوداشتغالی؛ بدون کارفرما، ۲ تا ۴ ماهه و کم‌ریسک.", img: "developerFemale" as const },
  { icon: "🎓", title: "دانشجو و فارغ‌التحصیل", text: "تحصیل سپس کار؛ مطمئن با امکان بورسیه کامل.", img: "graduationGroup" as const },
  { icon: "💰", title: "سرمایه‌گذار", text: "گلدن ویزا؛ اقامت ۱۰ ساله برای کل خانواده.", img: "handshakeEstate" as const },
  { icon: "🤝", title: "دارنده جاب‌آفر", text: "اقامت کاری عادی؛ مستقیم‌ترین مسیر با قرارداد موجود.", img: "businessSigning" as const },
];

export default function ComparisonPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "مقایسه مسیرها" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "مقایسه مسیرها" }]} />
      <PageHero badge="ابزار آنلاین" title="مقایسه ۵ مسیر مهاجرت به مجارستان" desc="هزینه، زمان، شرایط و امتیاز هر مسیر در یک جدول — به‌روز با قوانین ۲۰۲۶." icon="⚖️" updated="به‌روزرسانی: ژوئن ۲۰۲۶" image={SECTION_IMAGES.toolCompare} imagePriority />
      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-4 sm:px-6">
        <Reveal><ContentSection block={{ heading: "جدول مقایسه", table: PATH_COMPARISON, note: "مسیر «کارگر مهمان» از ژوئن ۲۰۲۶ حذف شده و در جدول نیست." }} image={MEDIA.citySunset} /></Reveal>
        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">توصیه سریع بر اساس پروفایل شما</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RECOMMEND.map((r) => (
                <div key={r.title} className="glass glass-hover overflow-hidden p-0">
                  <SmartImage media={{ ...MEDIA[r.img], alt: `توصیه مهاجرتی برای ${r.title}`, title: r.title }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="p-5">
                    <p className="text-sm font-extrabold">{r.icon} {r.title}</p>
                    <p className="mt-1.5 text-[12px] leading-7 text-white/55">{r.text}</p>
                  </div>
                </div>
              ))}
              <Link href="/assess" className="glass glass-hover grid place-items-center overflow-hidden border-emerald-400/30 p-5 text-center">
                <div>
                  <p className="text-2xl">🎯</p>
                  <p className="mt-2 text-sm font-extrabold text-emerald-300">توصیه دقیق با ارزیاب هوشمند</p>
                  <p className="mt-1 text-[12px] text-white/50">۲ دقیقه • رایگان • با درصد تطبیق</p>
                </div>
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal><CtaBand image={SECTION_IMAGES.toolAssess} /></Reveal>
      </div>
    </div>
  );
}
