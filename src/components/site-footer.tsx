import Link from "next/link";
import { faNum } from "@/lib/format";

const COLUMNS = [
  {
    title: "خدمات",
    links: [
      { label: "💼 مهاجرت کاری", href: "/services/work-permit" },
      { label: "🎓 مهاجرت تحصیلی", href: "/services/study-admission" },
      { label: "🏆 گلدن ویزا", href: "/services/golden-visa" },
      { label: "🏢 ثبت شرکت", href: "/services/company-registration" },
      { label: "🏠 خرید ملک", href: "/services/realestate" },
      { label: "📚 دوره زبان", href: "/services/language-courses" },
      { label: "📦 ترخیص گمرکی", href: "/services/customs" },
      { label: "🚚 حمل و نقل", href: "/services/logistics" },
      { label: "🤝 خدمات پس از ورود", href: "/services/post-arrival" },
    ],
  },
  {
    title: "لینک‌های سریع",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "کشور مجارستان", href: "/hungary" },
      { label: "فرآیند مهاجرت", href: "/process" },
      { label: "وبلاگ و آکادمی", href: "/news" },
      { label: "نظرات مشتریان", href: "/testimonials" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "همکاری با ما", href: "/partnership" },
      { label: "اپلیکیشن موبایل", href: "/mobile" },
    ],
  },
  {
    title: "ابزارها و سامانه",
    links: [
      { label: "🎯 ارزیاب شانس", href: "/assess" },
      { label: "🧮 محاسبه‌گر هزینه", href: "/tools/calculator" },
      { label: "✅ چک‌لیست مدارک", href: "/tools/checklist" },
      { label: "⚖️ مقایسه مسیرها", href: "/tools/comparison" },
      { label: "🔍 پیگیری پرونده", href: "/track" },
      { label: "👤 ورود / ثبت‌نام", href: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#04060b]/90">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-black text-[#04120d]">
                MH
              </span>
              <div>
                <p className="text-base font-extrabold">مجارنشین</p>
                <p className="text-[11px] text-white/45">سامانه هوشمند خدمات ایران-مجارستان</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
              مسیر مطمئن مهاجرت به قلب اروپا؛ بیش از {faNum("2500")} پرونده موفق، دفاتر تهران و بوداپست،
              و سامانه هوشمند از ارزیابی تا اقامت.
            </p>
            <div className="mt-5 space-y-1.5 text-[12px] text-white/55">
              <p>📞 تهران: {faNum("021-91001234")}</p>
              <p>📞 بوداپست: {faNum("+36-20-123-4567")}</p>
              <p>📧 info@magyarneshin.ir</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="badge">📸 اینستاگرام</span>
              <span className="badge">✈️ تلگرام</span>
              <span className="badge">💼 لینکدین</span>
              <span className="badge">🎬 یوتیوب</span>
              <span className="badge">🇪🇺 Schengen</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-sm font-bold text-emerald-300">{col.title}</p>
              <ul className="space-y-2 text-[13px] text-white/60">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="transition hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {faNum(1405)} مجارنشین — تمامی حقوق محفوظ است.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href="/legal/terms" className="hover:text-white">قوانین</Link>
            <span className="text-white/20">|</span>
            <Link href="/legal/privacy" className="hover:text-white">حریم خصوصی</Link>
            <span className="text-white/20">|</span>
            <Link href="/legal/refund" className="hover:text-white">استرداد وجه</Link>
            <span className="text-white/20">|</span>
            <Link href="/legal/disclaimer" className="hover:text-white">سلب مسئولیت</Link>
            <span className="text-white/20">|</span>
            <Link href="/sitemap.xml" className="hover:text-white">نقشه سایت</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
