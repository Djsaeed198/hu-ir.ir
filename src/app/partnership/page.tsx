import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { MEDIA } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "همکاری با ما | نمایندگی، وکلا، دانشگاه‌ها و فرصت‌های شغلی",
  description: "اعطای نمایندگی استانی، همکاری با وکلا و دانشگاه‌ها و فرصت‌های شغلی مجموعه ایران-مجارستان.",
  alternates: { canonical: "https://hu-ir.ir/partnership" },
};

export default function PartnershipPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "همکاری" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "همکاری" }]} />
      <PageHero
        badge="رشد مشترک"
        title="همکاری با بزرگ‌ترین پلتفرم ایران-مجارستان"
        desc="نمایندگی استانی، همکاری حقوقی و دانشگاهی، و پیوستن به تیم ۵۰+ نفره ما در تهران و بوداپست."
        icon="🤝"
        image={MEDIA.handshakeEstate}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal><ContentSection image={MEDIA.businessFinance} block={{ heading: "🏢 اعطای نمایندگی استانی", paragraphs: ["در مشهد، اصفهان، شیراز، تبریز و اهواز نماینده فعال می‌پذیریم."], bullets: ["آموزش کامل فرآیندها و دسترسی به سامانه", "کمیسیون پلکانی تا ۲۰٪ + پاداش عملکرد", "پشتیبانی بازاریابی محلی و محتوای آماده", "شرط: دفتر فعال و حداقل ۲ سال سابقه خدمات"], note: "ظرفیت هر استان محدود به ۲ نماینده است." }} /></Reveal>
          <Reveal delay={60}><ContentSection image={MEDIA.justiceStatue} block={{ heading: "⚖️ همکاری با وکلا و مشاوران", paragraphs: ["وکلای دادگستری و مشاوران مهاجرت می‌توانند پرونده‌های مجارستان خود را با زیرساخت ما اجرا کنند."], bullets: ["دسترسی به وکیل مجارستانی و مترجم رسمی", "پنل اختصاصی پیگیری پرونده موکلان", "کارمزد شفاف و تسویه ماهانه"] }} /></Reveal>
          <Reveal><ContentSection image={MEDIA.graduationGroup} block={{ heading: "🎓 همکاری با دانشگاه‌ها و کالج‌ها", paragraphs: ["موسسات آموزشی و کالج‌های زبان برای مسیر فاندیشن و پذیرش دانشجو:"], bullets: ["قرارداد جذب دانشجو با کمیسیون رقابتی", "وبینار مشترک و تور آشنایی مجارستان", "پشتیبانی ویزا و اسکان دانشجویان"] }} /></Reveal>
          <Reveal delay={60}><ContentSection image={MEDIA.developerOffice} block={{ heading: "💼 فرصت‌های شغلی", paragraphs: ["همیشه دنبال استعداد تازه هستیم؛ رزومه بفرستید:"], bullets: ["کارشناس پرونده مهاجرت (تهران/بوداپست)", "مشاور فروش تلفنی (دورکار)", "تولیدکننده محتوا و مترجم", "توسعه‌دهنده (Next.js) — تیم محصول"], note: "رزومه + نمونه‌کار به jobs@magyarneshin.ir" }} /></Reveal>
        </div>
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-xl font-black">فرم درخواست همکاری</h2>
              <p className="mt-2 text-sm leading-8 text-white/55">نوع همکاری، شهر و توضیح کوتاه بنویسید؛ واحد توسعه کسب‌وکار ظرف ۴۸ ساعت پاسخ می‌دهد.</p>
            </div>
            <LeadForm />
          </div>
        </Reveal>
        <Reveal><CtaBand image={MEDIA.heroParliamentDusk} /></Reveal>
      </div>
    </div>
  );
}
