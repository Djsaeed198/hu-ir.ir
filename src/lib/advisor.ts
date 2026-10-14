/**
 * موتور هوشمند مشاوره (Rule-based + Scoring)
 * توصیه‌گر مسیر مهاجرتی + ارزیابی شانس موفقیت + تخمین زمان پرونده
 */
import { faNum } from "@/lib/format";

export type AssessInput = {
  age: "18-24" | "25-34" | "35-44" | "45+";
  education: "diploma" | "bachelor" | "master" | "phd";
  capital: "lt10k" | "10-50k" | "50-150k" | "gt150k";
  language: "beginner" | "intermediate" | "advanced";
  purpose: "work" | "study" | "invest" | "business" | "family" | "treatment";
  timeline: "now" | "3m" | "6m+";
  jobOffer: boolean;
  family: boolean;
  englishField?: string;
};

export type PathRecommendation = {
  key: string;
  title: string;
  match: number;
  costEur: number;
  durationMonths: number;
  summary: string;
  steps: string[];
  serviceSlug: string;
};

export type AssessResult = {
  score: number;
  verdict: string;
  summary: string;
  strengths: string[];
  risks: string[];
  estimatedDays: number;
  successProbability: number;
  paths: PathRecommendation[];
  nextActions: string[];
};

export const ASSESS_QUESTIONS = [
  {
    id: "age",
    title: "سن شما در چه بازه‌ای است؟",
    hint: "سن روی امتیازدهی ویزای کاری و تحصیلی تأثیر مستقیم دارد.",
    options: [
      { value: "18-24", label: "۱۸ تا ۲۴ سال" },
      { value: "25-34", label: "۲۵ تا ۳۴ سال" },
      { value: "35-44", label: "۳۵ تا ۴۴ سال" },
      { value: "45+", label: "۴۵ سال و بالاتر" },
    ],
  },
  {
    id: "education",
    title: "آخرین مدرک تحصیلی شما؟",
    hint: "مدرک بالاتر = شانس بیشتر در مسیرهای کاری و Blue Card.",
    options: [
      { value: "diploma", label: "دیپلم" },
      { value: "bachelor", label: "کارشناسی" },
      { value: "master", label: "کارشناسی ارشد" },
      { value: "phd", label: "دکتری" },
    ],
  },
  {
    id: "capital",
    title: "بودجه‌ای که برای مهاجرت در نظر دارید؟",
    hint: "ارقام به یورو و شامل کل هزینه‌های مسیر است.",
    options: [
      { value: "lt10k", label: "کمتر از ۱۰,۰۰۰ یورو" },
      { value: "10-50k", label: "۱۰ تا ۵۰ هزار یورو" },
      { value: "50-150k", label: "۵۰ تا ۱۵۰ هزار یورو" },
      { value: "gt150k", label: "بیش از ۱۵۰ هزار یورو" },
    ],
  },
  {
    id: "language",
    title: "سطح زبان انگلیسی شما؟",
    hint: "برای تحصیل حداقل B2 و برای کار B1 پیشنهاد می‌شود.",
    options: [
      { value: "beginner", label: "مبتدی" },
      { value: "intermediate", label: "متوسط (B1)" },
      { value: "advanced", label: "پیشرفته (B2 و بالاتر)" },
    ],
  },
  {
    id: "purpose",
    title: "هدف اصلی شما از مهاجرت به مجارستان؟",
    hint: "هدف، مسیر حقوقی پرونده را تعیین می‌کند.",
    options: [
      { value: "work", label: "کار و اقامت کاری" },
      { value: "study", label: "تحصیل در دانشگاه" },
      { value: "invest", label: "سرمایه‌گذاری و گلدن ویزا" },
      { value: "business", label: "راه‌اندازی کسب‌وکار / ثبت شرکت" },
      { value: "family", label: "همراهی خانواده / اقامت خانوادگی" },
      { value: "treatment", label: "درمان و توریسم درمانی" },
    ],
  },
  {
    id: "timeline",
    title: "زمان شروع مطلوب شما؟",
    hint: "برنامه‌ریزی واقع‌بینانه نرخ موفقیت را بالا می‌برد.",
    options: [
      { value: "now", label: "در اسرع وقت" },
      { value: "3m", label: "تا ۳ ماه آینده" },
      { value: "6m+", label: "۶ ماه یا بیشتر" },
    ],
  },
] as const;

const CAPITAL_SCORE: Record<AssessInput["capital"], number> = {
  lt10k: 0,
  "10-50k": 8,
  "50-150k": 16,
  gt150k: 22,
};

const EDUCATION_SCORE: Record<AssessInput["education"], number> = {
  diploma: 2,
  bachelor: 8,
  master: 13,
  phd: 16,
};

const AGE_SCORE: Record<AssessInput["age"], number> = {
  "18-24": 9,
  "25-34": 12,
  "35-44": 8,
  "45+": 4,
};

const LANGUAGE_SCORE: Record<AssessInput["language"], number> = {
  beginner: 0,
  intermediate: 8,
  advanced: 14,
};

function pathsFor(input: AssessInput): PathRecommendation[] {
  const list: PathRecommendation[] = [];
  const edu = EDUCATION_SCORE[input.education];
  const cap = CAPITAL_SCORE[input.capital];
  const lang = LANGUAGE_SCORE[input.language];

  if (input.purpose === "study") {
    list.push({
      key: "study",
      title: "پذیرش تحصیلی + ویزای تحصیلی",
      match: Math.min(97, 62 + edu + lang),
      costEur: 6500,
      durationMonths: 6,
      summary:
        "پذیرش از دانشگاه‌های Semmelweis، ELTE، BME و Debrecen همراه با ویزای تحصیلی و اقامت همراه برای خانواده.",
      steps: [
        "انتخاب رشته و دانشگاه بر اساس رزومه",
        "دریافت پذیرش و نامه پذیرش رسمی",
        "درخواست ویزای تحصیلی در سفارت مجارستان",
        "اسکان، بیمه و ثبت‌نام پس از ورود",
      ],
      serviceSlug: "study-admission",
    });
  }

  if (input.purpose === "work" || input.jobOffer) {
    list.push({
      key: "work",
      title: "اقامت کاری با جاب آفر",
      match: Math.min(96, 55 + edu + lang + (input.jobOffer ? 12 : 0) + (input.age === "25-34" ? 6 : 0)),
      costEur: 4200,
      durationMonths: 5,
      summary:
        "دریافت پیشنهاد شغلی از کارفرمایان مجارستانی، اخذ Work Permit و اقامت کاری یک‌ساله قابل تمدید.",
      steps: [
        "بازنویسی رزومه استاندارد اروپایی",
        "معرفی به کارفرمایان همکار در مجارستان",
        "مصاحبه و دریافت قرارداد کاری",
        "اخذ مجوز کار و ویزای-national D",
      ],
      serviceSlug: "work-permit",
    });
  }

  if (input.purpose === "invest" || cap >= 16) {
    list.push({
      key: "golden-visa",
      title: "گلدن ویزا (اقامت سرمایه‌گذاری)",
      match: Math.min(98, 60 + cap + (input.purpose === "invest" ? 14 : 0)),
      costEur: 250000,
      durationMonths: 4,
      summary:
        "اقامت ۱۰ ساله مجارستان از طریق سرمایه‌گذاری در صندوق‌های مورد تأیید دولت، بدون الزام به اقامت دائم.",
      steps: [
        "مشاوره انتخاب صندوق سرمایه‌گذاری",
        "افتتاح حساب بانکی و انتقال وجه",
        "خرید واحدهای صندوق و اخذ گواهی",
        "درخواست اقامت ۱۰ ساله برای خانواده",
      ],
      serviceSlug: "golden-visa",
    });
  }

  if (input.purpose === "business" || cap >= 8) {
    list.push({
      key: "company",
      title: "ثبت شرکت Kft و اقامت کارآفرینی",
      match: Math.min(95, 52 + cap + (input.purpose === "business" ? 16 : 0)),
      costEur: 9500,
      durationMonths: 5,
      summary:
        "ثبت شرکت با مسئولیت محدود در بوداپست با مالیات شرکتی ۹٪، افتتاح حساب شرکتی و اخذ اقامت مدیرعامل.",
      steps: [
        "انتخاب نام و موضوع فعالیت شرکت",
        "تنظیم اسناد نزد وکیل مجارستانی",
        "ثبت شرکت و افتتاح حساب بانکی",
        "درخواست اقامت مدیرعامل و خانواده",
      ],
      serviceSlug: "company-registration",
    });
  }

  if (input.purpose === "family") {
    list.push({
      key: "family",
      title: "اقامت خانوادگی (Family Reunification)",
      match: Math.min(93, 58 + (input.family ? 14 : 0) + cap / 2),
      costEur: 2800,
      durationMonths: 4,
      summary: "درخواست اقامت برای همسر و فرزندان زیر ۱۸ سال از طریق پیوست به اقامت‌دار مجارستان.",
      steps: [
        "تهریه مدارک رابطه خانوادگی و ترجمه رسمی",
        "درخواست اقامت خانوادگی",
        "بیمه درمانی و اثبات تمکن مالی",
        "دریافت کارت اقامت خانواده",
      ],
      serviceSlug: "post-arrival",
    });
  }

  if (input.purpose === "treatment") {
    list.push({
      key: "medical",
      title: "ویزای درمانی + هماهنگی بیمارستان",
      match: Math.min(94, 66 + lang / 2),
      costEur: 3600,
      durationMonths: 2,
      summary:
        "هماهنگی نوبت درمان در بیمارستان‌های بوداپست، ویزای درمانی، مترجم همراه و اسکان نزدیک کلینیک.",
      steps: [
        "ارسال پرونده پزشکی به کلینیک همکار",
        "دریافت پلن درمان و پیش‌فاکتور",
        "درخواست ویزای درمانی",
        "همراهی مترجم و اسکان در مجارستان",
      ],
      serviceSlug: "medical-visa",
    });
  }

  if (list.length === 0) {
    list.push({
      key: "language",
      title: "دوره زبان + مسیر آمادگی",
      match: 70,
      costEur: 1900,
      durationMonths: 3,
      summary:
        "با تقویت زبان و آماده‌سازی مدارک، شانس پرونده شما در مسیر کاری/تحصیلی به‌طور محسوسی افزایش می‌یابد.",
      steps: [
        "تعیین سطح و انتخاب دوره",
        "دریافت گواهی زبان معتبر",
        "آماده‌سازی رزومه و مدارک",
        "ورود به مسیر کاری یا تحصیلی",
      ],
      serviceSlug: "language-courses",
    });
  }

  return list.sort((a, b) => b.match - a.match);
}

export function assess(input: AssessInput): AssessResult {
  let score = 42;
  score += AGE_SCORE[input.age];
  score += EDUCATION_SCORE[input.education];
  score += CAPITAL_SCORE[input.capital];
  score += LANGUAGE_SCORE[input.language];

  const strengths: string[] = [];
  const risks: string[] = [];

  if (input.jobOffer) {
    score += 10;
    strengths.push("داشتن جاب‌آفر یا سابقه همکاری با کارفرمای اروپایی، مهم‌ترین عامل افزایش شانس شماست.");
  } else {
    risks.push("بدون پیشنهاد شغلی، مسیر کاری زمان‌برتر می‌شود؛ پیشنهاد می‌کنیم سرویس جاب‌آفر تضمینی را فعال کنید.");
  }

  if (input.language === "advanced") {
    strengths.push("سطح زبان بالای شما امکان مصاحبه مستقیم با کارفرما/دانشگاه را فراهم می‌کند.");
  } else if (input.language === "beginner") {
    score -= 8;
    risks.push("سطح زبان مبتدی، پرونده را در مصاحبه سفارت آسیب‌پذیر می‌کند؛ دوره فشرده زبان توصیه می‌شود.");
  }

  if (input.capital === "gt150k") {
    strengths.push("توان مالی شما مسیر گلدن ویزا و سرمایه‌گذاری را با بالاترین نرخ موفقیت باز می‌کند.");
  } else if (input.capital === "lt10k") {
    score -= 6;
    risks.push("بودجه محدود، گزینه‌ها را به مسیر کاری/تحصیلی با بورسیه محدود می‌کند.");
  }

  if (input.education === "master" || input.education === "phd") {
    strengths.push("مدرک تحصیلی بالا شانس پذیرش و ویزای نیروی متخصص را افزایش می‌دهد.");
  }

  if (input.timeline === "now") {
    risks.push("زمان‌بندی فشرده؛ برخی مراحل اداری مجارستان حداقل ۶۰ روز کاری زمان می‌برد.");
  }

  if (input.family) {
    score += 3;
    strengths.push("امکان درخواست همزمان اقامت برای همسر و فرزندان زیر ۱۸ سال وجود دارد.");
  }

  if (input.age === "45+") {
    risks.push("برای بالای ۴۵ سال، مسیر سرمایه‌گذاری یا ثبت شرکت نرخ موفقیت بالاتری نسبت به ویزای کاری دارد.");
  }

  score = Math.max(28, Math.min(97, score));

  const verdict =
    score >= 80
      ? "شانس بالا"
      : score >= 65
        ? "شانس خوب"
        : score >= 50
          ? "شانس متوسط — نیازمند تقویت پرونده"
          : "پرریسک — نیازمند بازطراحی مسیر";

  const paths = pathsFor(input);
  const baseDays =
    input.purpose === "study" ? 150 : input.purpose === "invest" ? 120 : input.purpose === "treatment" ? 60 : 110;
  const estimatedDays = Math.round(baseDays * (input.timeline === "now" ? 0.85 : input.timeline === "3m" ? 1 : 1.15));

  const nextActions = [
    "ثبت درخواست مشاوره و تخصیص کارشناس پرونده",
    paths[0] ? `شروع مسیر «${paths[0].title}» با کارشناس اختصاصی` : "بررسی مسیرهای جایگزین",
    "بارگذاری پاسپورت و مدارک هویتی در سامانه",
    "دریافت چک‌لیست هوشمند مدارک و تایم‌لاین پرونده",
  ];

  return {
    score,
    verdict,
    summary: `بر اساس ${faNum(ASSESS_QUESTIONS.length)} پارامتر کلیدی، پرونده شما در وضعیت «${verdict}» قرار دارد. موتور هوشمند ${faNum(paths.length)} مسیر حقوقی منطبق با شرایط شما پیدا کرد.`,
    strengths: strengths.length ? strengths : ["پروفایل شما قابل ارتقا است؛ با تکمیل مدارک امتیاز محاسبه‌شده افزایش می‌یابد."],
    risks: risks.length ? risks : ["ریسک خاصی شناسایی نشد؛ انطباق مدارک با چک‌لیست کارشناس را رعایت کنید."],
    estimatedDays,
    successProbability: score,
    paths,
    nextActions,
  };
}
