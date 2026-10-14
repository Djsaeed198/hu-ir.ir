import { AuthForm } from "@/components/auth-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "ورود / ثبت‌نام | مجارنشین" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const { mode, next } = await searchParams;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <span className="badge !text-emerald-300">سامانه هوشمند مجارنشین</span>
        <h1 className="mt-4 text-3xl font-black leading-relaxed sm:text-4xl">
          حساب کاربری خود را بسازید و پرونده‌تان را هوشمند مدیریت کنید
        </h1>
        <p className="mt-4 text-sm leading-8 text-white/55">
          با ورود به سامانه: داشبورد شخصی پرونده، چت با کارشناس، بارگذاری و پیگیری مدارک، فاکتورها و اعلان‌های
          لحظه‌ای در اختیار شماست.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🔐", t: "ورود امن", d: "هش رمز با scrypt و کوکی امضاشده" },
            { icon: "🧭", t: "توصیه‌گر مسیر", d: "ارزیابی هوشمند رایگان پس از ثبت‌نام" },
            { icon: "💬", t: "چت کارشناس", d: "ارتباط مستقیم با کارشناس تهران/بوداپست" },
            { icon: "📱", t: "PWA", d: "نصب روی موبایل بدون نیاز به استور" },
          ].map((f) => (
            <div key={f.t} className="glass p-4">
              <p className="text-xl">{f.icon}</p>
              <p className="mt-2 text-sm font-bold">{f.t}</p>
              <p className="mt-1 text-[11px] text-white/45">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
      <AuthForm initialMode={mode === "register" ? "register" : "login"} next={next} />
    </div>
  );
}
