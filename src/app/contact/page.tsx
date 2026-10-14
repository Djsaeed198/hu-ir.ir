import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, LocalBusinessJsonLd, NapCard } from "@/components/seo-blocks";
import { OFFICES } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "تماس با ما | دفاتر تهران و بوداپست",
  description: "فرم تماس، تلفن‌ها، ایمیل، آدرس دفاتر، چت آنلاین و رزرو مشاوره رایگان مجموعه ایران-مجارستان.",
};

const SOCIALS = [
  { icon: "📸", label: "اینستاگرام", value: "@magyarneshin" },
  { icon: "✈️", label: "تلگرام", value: "کانال پرسش‌وپاسخ" },
  { icon: "💼", label: "لینکدین", value: "Magyarneshin" },
  { icon: "🎬", label: "یوتیوب", value: "راهنمای گام‌به‌گام" },
  { icon: "💬", label: "واتساپ", value: "پشتیبانی سریع" },
];

export default function ContactPage() {
  return (
    <div>
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]} />
      <PageHero
        badge="پاسخ در کمتر از ۲ ساعت کاری"
        title="ما اینجا هستیم تا کمک کنیم"
        desc="فرم را پر کنید، تماس بگیرید یا از دستیار هوشمند (پایین صفحه) بپرسید؛ کارشناسان تهران و بوداپست پاسخ‌گو هستند."
        icon="📞"
        image={MEDIA.businessWomen}
        imagePriority
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 pb-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div>
              <h2 className="mb-4 text-lg font-black">فرم درخواست مشاوره</h2>
              <LeadForm />
            </div>
          </Reveal>
          <div className="space-y-4">
            <Reveal>
              <div className="glass p-6">
                <h2 className="text-base font-black">اطلاعات تماس مستقیم</h2>
                <div className="mt-4 grid gap-2.5 text-[13px]">
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">📞 تهران: <strong dir="ltr">{faNum("021-91001234")}</strong> <span className="text-white/40">(شنبه تا پنجشنبه ۹ تا ۱۸)</span></p>
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">📞 بوداپست: <strong dir="ltr">{faNum("+36-20-123-4567")}</strong> <span className="text-white/40">(دوشنبه تا جمعه ۹ تا ۱۷)</span></p>
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">📧 ایمیل: <strong dir="ltr">info@magyarneshin.ir</strong></p>
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3">🤖 چت آنلاین: دستیار هوشمند پایین سمت چپ — ۲۴ ساعته</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="glass p-6">
                <h2 className="text-base font-black">شبکه‌های اجتماعی</h2>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SOCIALS.map((s) => (
                    <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                      <p className="text-xl">{s.icon}</p>
                      <p className="mt-1 text-[12px] font-bold">{s.label}</p>
                      <p className="text-[10px] text-white/40" dir="ltr">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">دفاتر ما</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {OFFICES.map((o, i) => {
                const img = i === 0 ? SECTION_IMAGES.officeTehran : SECTION_IMAGES.officeBudapest;
                return (
                  <div key={o.city} className="glass overflow-hidden p-0">
                    <SmartImage media={{ ...img, alt: `دفتر ${o.city} مجموعه ایران-مجارستان — ${o.address}`, title: `دفتر ${o.city} | ایران-مجارستان` }} ratio="21/8" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="p-5">
                      <p className="text-base font-extrabold">دفتر {o.city}</p>
                      <p className="mt-2 text-[13px] leading-7 text-white/55">{o.address}</p>
                      <p className="mt-1 text-[13px] text-white/55">☎️ {faNum(o.phone)}</p>
                      <p className="mt-1 text-[12px] text-white/40">🕘 {faNum(o.hours)}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {o.extras.map((e) => <span key={e} className="badge !text-[10px]">{e}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal><NapCard /></Reveal>

        <Reveal><CtaBand title="رزرو جلسه ویدیویی" desc="از هر شهر ایران یا جهان؛ لینک جلسه پس از ثبت فرم برای شما پیامک می‌شود." image={MEDIA.chainBridgeDay} /></Reveal>
      </div>
    </div>
  );
}
