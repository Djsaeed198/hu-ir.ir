const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function faNum(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function faMoney(value: number, unit: "€" | "تومان" = "€"): string {
  const grouped = new Intl.NumberFormat("en-US").format(Math.round(value));
  return `${faNum(grouped)} ${unit}`;
}

export function faDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function relativeFa(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "امروز";
  if (days === 1) return "دیروز";
  if (days < 30) return `${faNum(days)} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${faNum(months)} ماه پیش`;
  return `${faNum(Math.floor(months / 12))} سال پیش`;
}

export const STAGES = [
  "ثبت درخواست و مشاوره اولیه",
  "بررسی و تکمیل مدارک",
  "تنظیم قرارداد و پرداخت",
  "اپلای و ارسال به مجارستان",
  "در انتظار تصمیم سفارت",
  "دریافت ویزا / اقامت",
  "خدمات پس از ورود",
] as const;

export const STAGE_LABELS = STAGES;

export function stageLabel(stage: number): string {
  return STAGES[Math.min(Math.max(stage, 1), STAGES.length) - 1];
}

export const SERVICE_CATEGORIES = [
  { key: "مهاجرت کاری", icon: "💼", color: "from-emerald-400/20 to-teal-400/10" },
  { key: "تحصیلی", icon: "🎓", color: "from-sky-400/20 to-indigo-400/10" },
  { key: "سرمایه‌گذاری", icon: "💎", color: "from-amber-400/20 to-yellow-300/10" },
  { key: "ثبت شرکت", icon: "🏛️", color: "from-fuchsia-400/20 to-purple-400/10" },
  { key: "املاک", icon: "🏠", color: "from-rose-400/20 to-orange-300/10" },
  { key: "زبان و آکادمی", icon: "📚", color: "from-cyan-400/20 to-blue-400/10" },
  { key: "گمرک و لجستیک", icon: "🚚", color: "from-lime-400/20 to-emerald-300/10" },
  { key: "درمانی", icon: "🩺", color: "from-teal-400/20 to-green-300/10" },
  { key: "پس از ورود", icon: "🛬", color: "from-violet-400/20 to-indigo-300/10" },
  { key: "حقوقی", icon: "⚖️", color: "from-slate-300/20 to-slate-400/10" },
  { key: "ویزا و اقامت", icon: "🛂", color: "from-orange-400/20 to-amber-300/10" },
  { key: "خدمات ویژه", icon: "👑", color: "from-yellow-400/20 to-amber-200/10" },
  { key: "خدمات سازمانی", icon: "🏢", color: "from-blue-400/20 to-cyan-300/10" },
] as const;

export function categoryIcon(category: string): string {
  return SERVICE_CATEGORIES.find((c) => c.key === category)?.icon ?? "🛠️";
}

export function categoryGradient(category: string): string {
  return (
    SERVICE_CATEGORIES.find((c) => c.key === category)?.color ??
    "from-white/10 to-white/5"
  );
}
