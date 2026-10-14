import Link from "next/link";
import { AppPreview } from "@/components/app-preview";
import { Reveal } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { MEDIA } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "اپلیکیشن مهاجرت مجارستان | iOS، اندروید و PWA | مجارنشین",
  description: "اپلیکیشن موبایل مجارنشین: داشبورد پرونده، بارگذاری مدارک با دوربین، چت کارشناس، پرداخت و دستیار هوشمند. نسخه PWA فعال.",
  alternates: { canonical: "https://hu-ir.ir/mobile" },
};

const FEATURES = [
  { icon: "🔐", t: "ورود با OTP و بیومتریک", d: "احراز هویت دو مرحله‌ای + FaceID / اثر انگشت" },
  { icon: "📊", t: "داشبورد پرونده", d: "درصد پیشرفت، مرحله جاری، روزهای باقی‌مانده" },
  { icon: "📷", t: "بارگذاری مدارک با دوربین", d: "اسکن خودکار، OCR و ترجمه پیشنهادی" },
  { icon: "💬", t: "چت و ویدیوکنفرانس", d: "گفتگو با کارشناس، ترجمه خودکار پیام‌ها" },
  { icon: "🔔", t: "اعلان Push و یادآوری", d: "هشدار مهلت‌ها، قرارها و تغییر وضعیت پرونده" },
  { icon: "✍️", t: "امضای دیجیتال قرارداد", d: "امضای درون‌اپ با تاریخ و اثر انگشت زمانی" },
  { icon: "💳", t: "پرداخت ریالی و ارزی", d: "زرین‌پال، آیدی‌پی و Stripe در یک جا" },
  { icon: "🎙️", t: "دستیار صوتی فارسی", d: "پرسش با صدا و پاسخ صوتی هوشمند" },
  { icon: "🗺️", t: "راهنمای پس از ورود", d: "نقشه خدمات بوداپست، بانک‌ها، کلینیک‌ها" },
];

const STACK = [
  { t: "React Native / Expo", d: "یک کدبیس برای iOS و Android" },
  { t: "Firebase Cloud Messaging", d: "اعلان Push بومی" },
  { t: "Next.js PWA", d: "نصب وب‌اپ بدون استور (فعال)" },
  { t: "REST + WebSocket", d: "همگام‌سازی لحظه‌ای با سامانه" },
];

export default function MobilePage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "اپلیکیشن موبایل" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "اپلیکیشن موبایل" }]} />
      <PageHero
        badge="اپلیکیشن موبایل متقاضیان و کارشناسان"
        title="کل فرآیند مهاجرت، در جیب شما"
        desc="پیش‌نمایش تعاملی اپلیکیشن مجارنشین را ببینید: داشبورد پرونده، چک‌لیست هوشمند مدارک، چت کارشناس، پرداخت و دستیار هوشمند. نسخه وب (PWA) همین حالا قابل نصب است."
        image={MEDIA.airportSuitcase}
        imagePriority
      />
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-xl font-black">۹ قابلیت کلیدی اپلیکیشن</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.t} delay={i * 50}>
                <div className="glass glass-hover flex h-full items-start gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-lg">{f.icon}</span>
                  <span>
                    <span className="block text-[13px] font-bold">{f.t}</span>
                    <span className="mt-1 block text-[11px] leading-6 text-white/45">{f.d}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?mode=register" className="btn btn-primary !py-2.5 !text-xs">
              ورود به داشبورد وب
            </Link>
            <Link href="/track" className="btn btn-ghost !py-2.5 !text-xs">
              پیگیری پرونده
            </Link>
          </div>
        </div>

        <div>
          <AppPreview />
          <p className="mt-4 text-center text-[11px] text-white/35">
            پیش‌نمایش تعاملی — تب‌ها را لمس کنید
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <div className="glass p-6">
          <p className="text-sm font-bold">معماری فنی اپلیکیشن</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STACK.map((s) => (
              <div key={s.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[13px] font-bold text-emerald-300">{s.t}</p>
                <p className="mt-1 text-[11px] text-white/45">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-6">
          <p className="text-sm font-bold">اپلیکیشن کارشناسان</p>
          <p className="mt-2 text-[12px] leading-7 text-white/55">
            نسخه کارشناسی با لیست پرونده‌های تخصیص‌یافته، بررسی و تأیید مدارک، ثبت یادداشت، به‌روزرسانی مرحله،
            تقویم وظایف و گزارش‌گیری سریع — کاملاً یکپارچه با پنل مدیریت.
          </p>
          <ul className="mt-4 grid gap-2 text-[12px] text-white/60 sm:grid-cols-2">
            {[
              "مدیریت لیست متقاضیان",
              "بررسی و تأیید مدارک",
              "ثبت یادداشت و تغییر وضعیت",
              "تقویم و مدیریت وظایف",
              "گزارش سریع عملکرد",
              "اعلان پرونده‌های جدید",
            ].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> {x}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-white/35">
            {faNum(9)} ماژول میکروسرویسی پشت این اپلیکیشن: کاربران، پرونده‌ها، مشاوره، پرداخت، مدارک، اعلانات،
            گزارشات، AI/ML، گمرک و حمل‌ونقل.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <SmartImage media={MEDIA.chainBridgeAerial} ratio="21/6" sizes="100vw" />
      </div>
      <div className="mt-6"><CtaBand image={MEDIA.heroParliamentDusk} /></div>
      </div>
    </div>
  );
}
