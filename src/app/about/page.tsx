import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, ContentSection, CtaBand, PageHero, StatGrid } from "@/components/rich-blocks";
import { AvatarImage, SmartImage } from "@/components/smart-image";
import { BreadcrumbJsonLd, NapCard } from "@/components/seo-blocks";
import { CERTIFICATES, HISTORY, OFFICES, TEAM, VALUES } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES, TEAM_AVATARS } from "@/lib/media";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره ایران-مجارستان | تیم، دفاتر و افتخارات",
  description: "داستان، ماموریت، تیم ۵۰+ کارشناس، دفاتر تهران و بوداپست و ۲۵۰۰+ پرونده موفق مجموعه ایران-مجارستان از ۱۳۹۳.",
  openGraph: {
    title: "درباره ما | ایران-مجارستان",
    description: "پلی مطمئن بین ایران و مجارستان از سال ۱۳۹۳.",
    images: [{ url: MEDIA.businessMeeting.src, alt: MEDIA.businessMeeting.alt }],
  },
  alternates: { canonical: "https://hu-ir.ir/about" },
};

const AVATARS = [TEAM_AVATARS.ceo, TEAM_AVATARS.workExpert, TEAM_AVATARS.studyExpert, TEAM_AVATARS.lawyer, TEAM_AVATARS.support1, TEAM_AVATARS.support2];
const VALUE_IMGS = [MEDIA.contractSigning, MEDIA.handshakeEstate, MEDIA.developerOffice, MEDIA.airportWoman];

export default function AboutPage() {
  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
      <PageHero
        badge="درباره مجموعه"
        title="پلی مطمئن بین ایران و مجارستان از سال ۱۳۹۳"
        desc="مجموعه ایران-مجارستان با بیش از ۲٬۵۰۰ پرونده موفق، ۵۰+ کارشناس و دفاتر فعال در تهران و بوداپست، بزرگ‌ترین پلتفرم تخصصی مهاجرت به مجارستان برای ایرانیان است."
        image={MEDIA.businessMeeting}
        imagePriority
      />

      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-4 sm:px-6">
        <Reveal><StatGrid stats={[
          { v: `+${faNum("2500")}`, l: "پرونده موفق" },
          { v: `${faNum(98)}٪`, l: "نرخ رضایت" },
          { v: `+${faNum("10")} سال`, l: "تجربه" },
          { v: faNum("21"), l: "دانشگاه همکار" },
        ]} /></Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal><ContentSection block={{ heading: "🎯 ماموریت ما", paragraphs: ["توانمندسازی ایرانیان برای رسیدن به رویای زندگی در اروپا؛ با شفافیت کامل در هزینه‌ها، سرعت در اجرا و همراهی انسانی در تمام مسیر. ما معتقدیم مهاجرت نباید یک قمار باشد، بلکه یک پروژه مدیریت‌شده با نقشه راه مشخص است."] }} image={MEDIA.businessWomen} /></Reveal>
          <Reveal delay={80}><ContentSection block={{ heading: "🔭 چشم‌انداز ما", paragraphs: ["تبدیل شدن به بزرگ‌ترین و معتبرترین پلتفرم جامع مهاجرت به مجارستان؛ ترکیب محتوای آموزشی غنی، ابزارهای هوشمند، پنل کاربری پیشرفته و کامیونیتی فعال ایرانیان مقیم."] }} image={MEDIA.chainBridgeAerial} /></Reveal>
        </div>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">ارزش‌های ما</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <div key={v.title} className="glass glass-hover overflow-hidden p-0">
                  <SmartImage media={{ ...VALUE_IMGS[i % VALUE_IMGS.length], alt: `ارزش ${v.title} در مجموعه ایران-مجارستان`, title: v.title }} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 25vw" />
                  <div className="p-5">
                    <p className="text-sm font-extrabold"><span aria-hidden>{v.icon}</span> {v.title}</p>
                    <p className="mt-1.5 text-[12px] leading-7 text-white/55">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">تاریخچه مجموعه</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HISTORY.map((h) => (
                <div key={h.year} className="glass p-5">
                  <p className="text-lg font-black text-emerald-300">{faNum(h.year)}</p>
                  <p className="mt-2 text-[13px] leading-7 text-white/60">{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="mb-5 text-xl font-black">تیم ما ({faNum(TEAM.length)} نفر از {faNum("50")}+ کارشناس)</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((m, i) => {
                const avatar = AVATARS[i % AVATARS.length];
                return (
                  <div key={m.name} className="glass glass-hover p-5">
                    <div className="flex items-center gap-3">
                      <AvatarImage media={{ ...avatar, alt: `${m.name} — ${m.role} مجموعه ایران-مجارستان`, title: `${m.name} | ${m.role}` }} size={56} />
                      <div>
                        <p className="text-sm font-extrabold">{m.name}</p>
                        <p className="text-[12px] text-emerald-300">{m.role}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-white/40">📍 {m.location} • {faNum(m.exp)} تجربه</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.skills.map((s) => <span key={s} className="badge !text-[10px]">{s}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full overflow-hidden p-0">
              <SmartImage media={SECTION_IMAGES.officeBudapest} ratio="21/8" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="p-6">
                <h2 className="text-lg font-black">دفاتر ما</h2>
                <div className="mt-4 space-y-4">
                  {OFFICES.map((o, i) => (
                    <div key={o.city} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      <SmartImage media={i === 0 ? SECTION_IMAGES.officeTehran : SECTION_IMAGES.officeBudapest} ratio="21/7" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 50vw" />
                      <div className="p-4">
                        <p className="text-sm font-extrabold">📍 دفتر {o.city}</p>
                        <p className="mt-2 text-[12px] leading-7 text-white/55">{o.address}</p>
                        <p className="mt-1 text-[12px] text-white/55">☎️ {faNum(o.phone)} • 🕘 {faNum(o.hours)}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {o.extras.map((e) => <span key={e} className="badge !text-[10px]">{e}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="glass h-full p-6">
              <h2 className="text-lg font-black">گواهی‌ها و مجوزها</h2>
              <ul className="mt-4 space-y-2.5">
                {CERTIFICATES.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] text-white/65">
                    <span className="text-emerald-400">✓</span> {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] text-white/35">اصل مدارک و مجوزها در دفاتر قابل رؤیت است.</p>
              <div className="mt-5"><NapCard /></div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-xl font-black">گفت‌وگو با ما</h2>
              <p className="mt-2 text-sm leading-8 text-white/55">برای آشنایی بیشتر، جلسه مشاوره رایگان رزرو کنید؛ حضوری در تهران و بوداپست یا آنلاین از هر شهر.</p>
              <div className="mt-4"><SmartImage media={MEDIA.businessSigning} ratio="16/8" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
              <div className="mt-4 space-y-2 text-[13px] text-white/60">
                <p>📞 تهران: {faNum("021-91001234")}</p>
                <p>📞 بوداپست: {faNum("+36-20-123-4567")}</p>
                <p>📧 info@magyarneshin.ir</p>
              </div>
            </div>
            <LeadForm />
          </div>
        </Reveal>

        <Reveal><CtaBand image={MEDIA.heroParliamentNight} /></Reveal>
      </div>
    </div>
  );
}
