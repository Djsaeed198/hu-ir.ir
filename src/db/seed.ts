import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  caseEvents,
  cases,
  documents,
  invoices,
  knowledge,
  leads,
  messages,
  services,
  users,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";

type ServiceSeed = typeof services.$inferInsert;
type ArticleSeed = typeof articles.$inferInsert;
type KnowledgeSeed = typeof knowledge.$inferInsert;

const SERVICE_SEED: ServiceSeed[] = [
  {
    slug: "work-permit",
    titleFa: "اقامت کاری و مجوز کار مجارستان",
    titleEn: "Work Permit & Employment Residence",
    category: "مهاجرت کاری",
    icon: "💼",
    summary: "دریافت مجوز کار رسمی و اقامت یک‌ساله قابل تمدید برای متخصصان ایرانی.",
    description:
      "کارشناسان ما در بوداپست پرونده شما را نزد کارفرمایان معتبر مجارستانی ارائه می‌کنند، قرارداد کاری را تنظیم می‌کنند و کل فرآیند اخذ Work Permit و ویزای ملی D را پیگیری می‌کنند.",
    features: ["ارزیابی رزومه با موتور هوشمند", "معرفی به کارفرمایان همکار", "تنظیم قرارداد کاری نزد وکیل", "پیگیری پرونده سفارت"],
    priceFromEur: 4200,
    durationLabel: "۴ تا ۶ ماه",
    successRate: 94,
    popularity: 96,
  },
  {
    slug: "job-offer",
    titleFa: "جاب آفر تضمینی",
    titleEn: "Guaranteed Job Offer",
    category: "مهاجرت کاری",
    icon: "🤝",
    summary: "دریافت پیشنهاد شغلی از شرکت‌های مجارستانی در حوزه IT، مهندسی، پزشکی و هتلداری.",
    description:
      "با شبکه‌ای از بیش از ۱۲۰ کارفرمای مجارستانی، بر اساس مهارت و سابقه شما بهترین تطبیق شغلی را انجام می‌دهیم و تا دریافت نامه پیشنهاد شغلی همراهتان هستیم.",
    features: ["تطبیق هوشمند شغل و مهارت", "آماده‌سازی مصاحبه انگلیسی", "قرارداد کاری معتبر", "پشتیبانی تا شروع کار"],
    priceFromEur: 5600,
    durationLabel: "۳ تا ۵ ماه",
    successRate: 91,
    popularity: 89,
  },
  {
    slug: "cv-interview",
    titleFa: "رزومه‌نویسی اروپایی و آماده‌سازی مصاحبه",
    titleEn: "EU CV & Interview Coaching",
    category: "مهاجرت کاری",
    icon: "📄",
    summary: "تهیه CV و Cover Letter استاندارد اروپا + شبیه‌سازی مصاحبه کاری.",
    description: "رزومه شما با الگوی ATS اروپایی بازنویسی می‌شود و در دو جلسه مصاحبه شبیه‌سازی‌شده آماده می‌شوید.",
    features: ["قالب ATS-friendly", "بازنویسی توسط مشاور ارشد", "دو جلسه مصاحبه شبیه‌سازی", "تحلیل نقاط ضعف"],
    priceFromEur: 320,
    durationLabel: "۷ روز کاری",
    successRate: 98,
    popularity: 74,
  },
  {
    slug: "study-admission",
    titleFa: "پذیرش تحصیلی دانشگاه‌های مجارستان",
    titleEn: "University Admission",
    category: "تحصیلی",
    icon: "🎓",
    summary: "پذیرش از Semmelweis، ELTE، BME، Debrecen و دیگر دانشگاه‌های معتبر.",
    description:
      "از انتخاب رشته و انگیزه‌نامه تا مصاحبه دانشگاه و دریافت نامه پذیرش، تمام مراحل توسط مشاوران تحصیلی ما مدیریت می‌شود.",
    features: ["انتخاب رشته داده‌محور", "نگارش SOP و انگیزه‌نامه", "پیگیری مصاحبه دانشگاه", "ویزای تحصیلی و اقامت همراه"],
    priceFromEur: 6500,
    durationLabel: "۴ تا ۷ ماه",
    successRate: 96,
    popularity: 93,
  },
  {
    slug: "medical-university",
    titleFa: "پذیرش پزشکی، دندانپزشکی و داروسازی",
    titleEn: "Medical & Dentistry Admission",
    category: "تحصیلی",
    icon: "🩻",
    summary: "مسیر تخصصی رشته‌های علوم پزشکی با آمادگی آزمون ورودی.",
    description:
      "آمادگی آزمون ورودی دانشگاه‌های پزشکی مجارستان، ترجمه مدارک، و همراهی تا ثبت‌نام نهایی در دانشگاه.",
    features: ["آموزش آزمون ورودی", "معادل‌سازی مدارک", "مشاوره با دانشجویان مقیم", "بورسیه‌های partial"],
    priceFromEur: 7800,
    durationLabel: "۵ تا ۸ ماه",
    successRate: 92,
    popularity: 88,
  },
  {
    slug: "scholarship",
    titleFa: "بورسیه Stipendium Hungaricum",
    titleEn: "Scholarship Programs",
    category: "تحصیلی",
    icon: "🏅",
    summary: "کسب بورسیه کامل دولت مجارستان شامل شهریه، خوابگاه و کمک‌هزینه ماهانه.",
    description: "تحلیل شانس بورسیه، تکمیل فرم APPLICATION و انگیزه‌نامه، و رفع نواقص پرونده در فرآیند ارزیابی Tempus.",
    features: ["ارزیابی شانس بورسیه", "تکمیل پروفایل Tempus", "انگیزه‌نامه تخصصی", "پیگیری نتیجه"],
    priceFromEur: 1500,
    durationLabel: "۶ ماه",
    successRate: 84,
    popularity: 81,
  },
  {
    slug: "golden-visa",
    titleFa: "گلدن ویزا مجارستان (اقامت ۱۰ ساله)",
    titleEn: "Golden Visa / Guest Investor",
    category: "سرمایه‌گذاری",
    icon: "💎",
    summary: "اقامت ۱۰ ساله از طریق سرمایه‌گذاری در صندوق‌های مورد تأیید دولت مجارستان.",
    description:
      "مشاوره انتخاب صندوق، افتتاح حساب بانکی، انتقال وجه قانونی، خرید واحدهای صندوق و درخواست اقامت بلندمدت برای شما و خانواده.",
    features: ["انتخاب صندوق مورد تأیید", "افتتاح حساب و انتقال وجه", "انطباق کامل با قانون جدید", "اقامت برای خانواده"],
    priceFromEur: 250000,
    durationLabel: "۳ تا ۵ ماه",
    successRate: 97,
    popularity: 90,
  },
  {
    slug: "company-registration",
    titleFa: "ثبت شرکت در مجارستان (Kft / Bt / Zrt)",
    titleEn: "Company Registration",
    category: "ثبت شرکت",
    icon: "🏛️",
    summary: "ثبت شرکت با مالیات شرکتی ۹٪ و اخذ اقامت مدیرعامل.",
    description:
      "از انتخاب نام و موضوع فعالیت تا ثبت نهایی در دادگاه ثبت شرکت‌های مجارستان، افتتاح حساب بانکی و درخواست اقامت کارآفرینی.",
    features: ["وکیل مجارستانی رسمی", "دفتر ثبت‌شده (Registered Office)", "افتتاح حساب شرکتی", "اقامت مدیرعامل"],
    priceFromEur: 9500,
    durationLabel: "۴ تا ۶ هفته",
    successRate: 95,
    popularity: 86,
  },
  {
    slug: "accounting-tax",
    titleFa: "حسابداری، مالیات و انطباق",
    titleEn: "Accounting & Tax Compliance",
    category: "ثبت شرکت",
    icon: "🧾",
    summary: "حسابداری ماهانه، اظهارنامه‌ها و بهینه‌سازی مالیاتی با نرخ ۹٪.",
    description: "خدمات حسابداری و مالیاتی توسط حسابداران مجار با گزارش ماهانه فارسی برای مالکان ایرانی.",
    features: ["حسابداری ماهانه", "اظهارنامه VAT", "گزارش فارسی برای مالک", "مشاوره بهینه‌سازی مالیات"],
    priceFromEur: 250,
    durationLabel: "ماهانه",
    successRate: 99,
    popularity: 66,
  },
  {
    slug: "realestate",
    titleFa: "خرید، اجاره و مدیریت ملک",
    titleEn: "Real Estate Services",
    category: "املاک",
    icon: "🏠",
    summary: "خرید آپارتمان در بوداپست با بازدهی ۵ تا ۷ درصد و مدیریت کامل ملک.",
    description:
      "جست‌وجوی ملک با معیارهای شما، بررسی حقوقی سند، مذاکره قیمت، تنظیم قرارداد نزد وکیل و مدیریت اجاره برای مالکان غیرمقیم.",
    features: ["بررسی حقوقی سند", "بازدید ویدیویی", "مذاکره قیمت", "مدیریت اجاره و مستأجر"],
    priceFromEur: 6500,
    durationLabel: "۳ تا ۸ هفته",
    successRate: 97,
    popularity: 84,
  },
  {
    slug: "language-courses",
    titleFa: "دوره‌های زبان مجاری و انگلیسی",
    titleEn: "Hungarian & English Courses",
    category: "زبان و آکادمی",
    icon: "📚",
    summary: "از سطح مبتدی تا B2 با اساتید مقیم بوداپست و آمادگی آزمون‌های رسمی.",
    description: "کلاس‌های آنلاین و حضوری، آمادگی IELTS/TOEFL و دوره‌های فشرده زبان مجاری برای زندگی روزمره.",
    features: ["کلاس آنلاین زنده", "اساتید مقیم مجارستان", "آمادگی IELTS", "گواهی پایان دوره"],
    priceFromEur: 690,
    durationLabel: "۸ تا ۱۶ هفته",
    successRate: 99,
    popularity: 78,
  },
  {
    slug: "customs",
    titleFa: "ترخیص گمرکی و امور بازرگانی",
    titleEn: "Customs Clearance",
    category: "گمرک و لجستیک",
    icon: "🛃",
    summary: "ترخیص سریع کالا از گمرک مجارستان با کد EORI و تعرفه‌گذاری صحیح.",
    description: "اخذ EORI، تعیین HS Code، تنظیم اظهارنامه گمرکی و پیگیری ترخیص در بنادر و فرودگاه‌های مجارستان.",
    features: ["اخذ کد EORI", "تعیین HS Code", "اظهارنامه گمرکی", "پیگیری ترخیص"],
    priceFromEur: 900,
    durationLabel: "۳ تا ۱۰ روز",
    successRate: 96,
    popularity: 62,
  },
  {
    slug: "logistics",
    titleFa: "حمل و نقل بین‌المللی ایران-مجارستان",
    titleEn: "International Freight",
    category: "گمرک و لجستیک",
    icon: "🚚",
    summary: "حمل هوایی، دریایی و زمینی با بیمه بار و رهگیری لحظه‌ای.",
    description: "انتخاب بهترین مسیر و روش حمل، انبارداری در اروپا و تحویل درب منزل یا انبار شما.",
    features: ["حمل هوایی و زمینی", "بیمه بار", "انبارداری اروپا", "رهگیری آنلاین"],
    priceFromEur: 1200,
    durationLabel: "۷ تا ۳۰ روز",
    successRate: 95,
    popularity: 60,
  },
  {
    slug: "medical-visa",
    titleFa: "ویزای درمانی و توریسم درمانی",
    titleEn: "Medical Visa",
    category: "درمانی",
    icon: "🩺",
    summary: "هماهنگی درمان در بیمارستان‌های بوداپست با هزینه ۴۰ تا ۶۰ درصد کمتر.",
    description: "ارسال پرونده پزشکی، دریافت پلن درمان، ویزای درمانی، مترجم همراه و اسکان نزدیک کلینیک.",
    features: ["پلن درمان و پیش‌فاکتور", "ویزای درمانی", "مترجم همراه", "اسکان نزدیک کلینیک"],
    priceFromEur: 3600,
    durationLabel: "۳ تا ۸ هفته",
    successRate: 93,
    popularity: 70,
  },
  {
    slug: "dental",
    titleFa: "دندانپزشکی و زیبایی در مجارستان",
    titleEn: "Dental & Aesthetic Care",
    category: "درمانی",
    icon: "🦷",
    summary: "کلینیک‌های تخصصی دندانپزشکی بوداپست با کیفیت اروپایی و قیمت مناسب.",
    description: "برنامه‌ریزی درمان، ایمپلنت و کارهای زیبایی، همراه با اقامت کوتاه‌مدت و مترجم.",
    features: ["پلن درمان قبل از سفر", "کلینیک‌های معتبر اروپایی", "اقامت و ترانسفر", "گارانتی خدمات"],
    priceFromEur: 2200,
    durationLabel: "۱ تا ۳ هفته",
    successRate: 98,
    popularity: 64,
  },
  {
    slug: "post-arrival",
    titleFa: "خدمات پس از ورود و استقرار",
    titleEn: "Post-Arrival Settlement",
    category: "پس از ورود",
    icon: "🛬",
    summary: "استقبال فرودگاه، اسکان، حساب بانکی، بیمه، Tax Card و ثبت‌نام فرزندان.",
    description: "پکیج کامل استقرار در مجارستان؛ تا جایی که زندگی روزمره شما بدون نیاز به مترجم جریان پیدا کند.",
    features: ["استقبال فرودگاه بوداپست", "افتتاح حساب OTP / K&H", "بیمه درمانی دولتی و خصوصی", "تبدیل گواهینامه رانندگی"],
    priceFromEur: 1450,
    durationLabel: "۱ تا ۳ هفته",
    successRate: 99,
    popularity: 75,
  },
  {
    slug: "legal",
    titleFa: "خدمات حقوقی و وکالت در مجارستان",
    titleEn: "Legal Services",
    category: "حقوقی",
    icon: "⚖️",
    summary: "وکلای مجارستانی برای قراردادها، دعاوی، مالکیت فکری و حقوق کار.",
    description: "تنظیم و بررسی قراردادهای بین‌المللی، پیگیری دعاوی، ثبت برند و اختراع، و مشاوره حقوق خانواده.",
    features: ["وکیل رسمی مجارستانی", "تنظیم قرارداد دوزبانه", "ثبت برند و اختراع", "پیگیری دعاوی"],
    priceFromEur: 480,
    durationLabel: "بر اساس پرونده",
    successRate: 92,
    popularity: 55,
  },
  {
    slug: "tourist-visa",
    titleFa: "ویزای توریستی شنگن مجارستان",
    titleEn: "Schengen Tourist Visa",
    category: "ویزا و اقامت",
    icon: "✈️",
    summary: "مشاوره و آماده‌سازی پرونده ویزای شنگن با نرخ موفقیت بالا.",
    description: "برنامه سفر، رزرو هتل و بلیط، اثبات تمکن مالی، بیمه سفر و وقت سفارت — همراه با تمرین مصاحبه.",
    features: ["برنامه سفر معتبر", "رزرو هتل و بلیط", "بیمه سفر شنگن", "وقت سفارت"],
    priceFromEur: 480,
    durationLabel: "۳ تا ۶ هفته",
    successRate: 90,
    popularity: 87,
  },
  {
    slug: "visa-extension",
    titleFa: "تمدید و تبدیل اقامت",
    titleEn: "Residence Permit Renewal",
    category: "ویزا و اقامت",
    icon: "🔄",
    summary: "تمدید کارت اقامت و تبدیل ویزای توریستی به اقامت کاری یا تحصیلی.",
    description: "بررسی شرایط تمدید، تکمیل فرم‌های اداره مهاجرت مجارستان (National Directorate-General for Aliens Policing).",
    features: ["بررسی شرایط تمدید", "تکمیل فرم‌های اداره مهاجرت", "پیگیری کارت اقامت", "جلوگیری از قطع اقامت"],
    priceFromEur: 690,
    durationLabel: "۳ تا ۶ هفته",
    successRate: 94,
    popularity: 58,
  },
  {
    slug: "citizenship",
    titleFa: "تابعیت و پاسپورت مجارستان",
    titleEn: "Citizenship & Passport",
    category: "ویزا و اقامت",
    icon: "🛂",
    summary: "مسیر قانونی تابعیت پس از اقامت دائم، همراه با آموزش زبان و مصاحبه.",
    description: "ارزیابی شرایط، آماده‌سازی مدارک اجداد مجاری (در صورت وجود)، آموزش مصاحبه قانون اساسی و زبان مجاری.",
    features: ["ارزیابی شرایط تابعیت", "آموزش مصاحبه قانون اساسی", "آموزش زبان مجاری", "پیگیری پرونده"],
    priceFromEur: 3200,
    durationLabel: "۱۲ تا ۲۴ ماه",
    successRate: 88,
    popularity: 52,
  },
  {
    slug: "vip-concierge",
    titleFa: "خدمات VIP و کنسیرج",
    titleEn: "VIP Concierge",
    category: "خدمات ویژه",
    icon: "👑",
    summary: "مشاوره با وکیل ارشد، پرواز اختصاصی، راننده و مترجم همراه.",
    description: "بسته لوکس برای مدیران و سرمایه‌گذاران: کنسیرج شخصی، اقامت ۵ ستاره، سرویس فرودگاهی VIP و مترجم اختصاصی.",
    features: ["وکیل ارشد اختصاصی", "Fast Track فرودگاه", "راننده و خودرو لوکس", "کنسیرج ۲۴/۷"],
    priceFromEur: 12000,
    durationLabel: "سفارشی",
    successRate: 99,
    popularity: 48,
  },
  {
    slug: "b2b-relocation",
    titleFa: "انتقال کارکنان سازمانی (Relocation B2B)",
    titleEn: "Corporate Relocation",
    category: "خدمات سازمانی",
    icon: "🏢",
    summary: "جابجایی تیم‌های کاری شرکت‌ها به مجارستان با قرارداد سازمانی.",
    description: "طراحی پکیج Relocation برای شرکت‌ها: مجوز کار دسته‌جمعی، اسکان خانوادگی، آموزش intercultural و حسابداری.",
    features: ["مجوز کار دسته‌جمعی", "پکیج خانوادگی", "آموزش intercultural", "SLA اختصاصی"],
    priceFromEur: 18000,
    durationLabel: "سفارشی",
    successRate: 96,
    popularity: 44,
  },
  {
    slug: "money-transfer",
    titleFa: "انتقال وجه و خدمات ارزی",
    titleEn: "Payments & FX",
    category: "سرمایه‌گذاری",
    icon: "💱",
    summary: "انتقال قانونی وجه بین ایران و مجارستان با نرخ رقابتی.",
    description: "همراهی در انتقال سرمایه برای خرید ملک، شهریه دانشگاه و سرمایه شرکت، با مستندسازی کامل قانونی.",
    features: ["مشاوره انتقال قانونی", "مستندسازی منبع وجه", "نرخ رقابتی ارز", "پیگیری تا واریز"],
    priceFromEur: 350,
    durationLabel: "۲ تا ۱۰ روز",
    successRate: 93,
    popularity: 57,
  },
  {
    slug: "academy",
    titleFa: "مجارنشین آکادمی (دوره‌های مهاجرت)",
    titleEn: "Migration Academy",
    category: "زبان و آکادمی",
    icon: "🖥️",
    summary: "وبینار و دوره‌های ویدیویی مهاجرت، بازار کار و زندگی در مجارستان.",
    description: "بیش از ۴۰ ساعت محتوای آموزشی با حضور وکلای مجارستانی، مهاجران موفق و کارشناسان مالی.",
    features: ["۴۰+ ساعت ویدیو", "وبینار ماهانه زنده", "گواهی پایان دوره", "دسترسی مادام‌العمر"],
    priceFromEur: 190,
    durationLabel: "خودخوان",
    successRate: 100,
    popularity: 68,
  },
];

const ARTICLE_SEED: ArticleSeed[] = [
  {
    slug: "golden-visa-2026",
    title: "قوانین جدید گلدن ویزا مجارستان در ۲۰۲۶؛ چه چیزی تغییر کرد؟",
    excerpt: "مرور کامل شرایط جدید اقامت سرمایه‌گذاری، حداقل مبلغ، و مزیت اقامت ۱۰ ساله برای خانواده.",
    body:
      "برنامه Guest Investor مجارستان در نسخه جدید خود، سرمایه‌گذاری در صندوق‌های مورد تأیید دولت را مبنای صدور اقامت ۱۰ ساله قرار داده است.\n\nنکات کلیدی:\n• سرمایه‌گذاری حداقل ۲۵۰ هزار یورو در صندوق‌های مورد تأیید\n• امکان درخواست همزمان برای همسر و فرزندان زیر ۱۸ سال\n• عدم الزام به اقامت دائم در مجارستان برای حفظ کارت\n• امکان تبدیل به اقامت دائم پس از ۳ سال\n\nکارشناسان مجارنشین پیش از هر اقدام، انطباق منبع سرمایه را بررسی می‌کنند تا درخواست در مرحله بررسی بانکی رد نشود.",
    category: "news",
    tag: "ویزا",
    readMinutes: 6,
    coverEmoji: "💎",
  },
  {
    slug: "work-permit-shortage-list",
    title: "مشاغل کم‌نیروی مجارستان؛ فرصت طلایی برای متخصصان ایرانی",
    excerpt: "فهرست مشاغل مورد نیاز بازار کار مجارستان و نکات دریافت جاب‌آفر در ۹۰ روز.",
    body:
      "بازار کار مجارستان در حوزه‌های IT، مهندسی مکانیک، پرستاری، هتلداری و تولید صنعتی با کمبود نیرو مواجه است.\n\nبر اساس داده‌های سامانه هوشمند مجارنشین، میانگین زمان دریافت جاب‌آفر برای متقاضیان با زبان B2 حدود ۷۸ روز و برای متقاضیان بدون مدرک زبان ۱۴۲ روز است.\n\nتوصیه ما: پیش از اپلای، رزومه خود را با الگوی ATS اروپایی بازنویسی کنید و حداقل به سطح B1 انگلیسی برسید.",
    category: "market",
    tag: "بازار کار",
    readMinutes: 5,
    coverEmoji: "💼",
  },
  {
    slug: "semmelweis-guide",
    title: "راهنمای کامل پذیرش پزشکی در دانشگاه سمِلوِیس بوداپست",
    excerpt: "شرایط آزمون ورودی، شهریه، خوابگاه و شانس پذیرش برای دانشجویان ایرانی.",
    body:
      "دانشگاه Semmelweis معتبرترین مرکز آموزش علوم پزشکی مجارستان است. شهریه سالانه پزشکی حدود ۱۸ تا ۲۰ هزار دلار است.\n\nمراحل پذیرش:\n۱. ارسال مدارک و ترجمه رسمی\n۲. آزمون ورودی (زیست، شیمی، فیزیک) به انگلیسی\n۳. مصاحبه آنلاین با کمیته دانشگاه\n۴. دریافت پذیرش و درخواست ویزای تحصیلی\n\nدر سامانه ما، آزمون آزمایشی هوشمند شانس پذیرش شما را پیش از ثبت‌نام برآورد می‌کند.",
    category: "academy",
    tag: "تحصیل",
    readMinutes: 7,
    coverEmoji: "🎓",
  },
  {
    slug: "budapest-property-yield",
    title: "بازدهی اجاره آپارتمان در بوداپست؛ کدام مناطق بیشترین سود را دارند؟",
    excerpt: "تحلیل داده محیطی مناطق ۵، ۷، ۹ و ۱۳ بوداپست برای سرمایه‌گذاری ملکی.",
    body:
      "میانگین بازدهی اجاره در بوداپست بین ۴.۵ تا ۷.۲ درصد است. منطقه ۷ (اکسیر) و منطقه ۹ برای اجاره کوتاه‌مدت و منطقه ۱۳ برای اجاره بلندمدت خانوادگی بهترین عملکرد را دارند.\n\nنکته مهم: خرید ملک توسط خارجی در مناطق کشاورزی ممنوع است اما آپارتمان مسکونی بدون محدودیت قابل خرید است.",
    category: "market",
    tag: "املاک",
    readMinutes: 5,
    coverEmoji: "🏠",
  },
  {
    slug: "company-tax-9",
    title: "چرا مالیات شرکتی ۹ درصدی مجارستان جذاب‌ترین در اتحادیه اروپاست؟",
    excerpt: "مقایسه مالیات، هزینه ثبت شرکت و فرآیند افتتاح حساب بانکی مجارستان با کشورهای همسایه.",
    body:
      "مجارستان با نرخ مالیات شرکتی ۹ درصد، پایین‌ترین نرخ در اتحادیه اروپا را دارد. ثبت شرکت Kft حدود ۴ تا ۶ هفته زمان می‌برد و سرمایه اولیه می‌تواند تا ۳ میلیون فورینت باشد.\n\nبرای مدیرعامل خارجی، اقامت کارآفرینی بر مبنای شرکت قابل درخواست است.",
    category: "academy",
    tag: "کسب‌وکار",
    readMinutes: 6,
    coverEmoji: "🏛️",
  },
  {
    slug: "nowruz-budapest",
    title: "جشن نوروز ایرانیان مقیم بوداپست؛ گزارش تصویری کامیونیتی",
    excerpt: "روایت شب نوروز جامعه ایرانیان مجارستان و برنامه‌های پیش‌روی کامیونیتی.",
    body:
      "بیش از ۱۲ هزار ایرانی در مجارستان زندگی می‌کنند. کامیونیتی مجارنشین هر ماه رویدادهای شبکه‌سازی، کارگاه‌های تخصصی و جلسات پرسش‌وپاسخ با وکلا برگزار می‌کند.",
    category: "community",
    tag: "کامیونیتی",
    readMinutes: 4,
    coverEmoji: "🌱",
  },
];

const KNOWLEDGE_SEED: KnowledgeSeed[] = [
  {
    question: "هزینه مهاجرت کاری به مجارستان چقدر است؟",
    answer:
      "هزینه اقامت کاری بسته به شغل و کارفرما بین ۴,۲۰۰ تا ۵,۶۰۰ یورو شامل خدمات ما است؛ به‌علاوه هزینه‌های دولتی سفارت (حدود ۱۱۰ یورو) و هزینه زندگی ماهانه ۷۰۰ تا ۱,۱۰۰ یورو. در سامانه می‌توانید با ارزیاب هوشمند تخمین دقیق هزینه برای شرایط خود را بگیرید.",
    keywords: ["هزینه", "کاری", "کار", "مجوز", "قیمت", "چند"],
    category: "مهاجرت کاری",
  },
  {
    question: "گلدن ویزا مجارستان چیست و شرایط آن کدام است؟",
    answer:
      "گلدن ویزا (Guest Investor) اقامت ۱۰ ساله مجارستان از طریق سرمایه‌گذاری حداقل ۲۵۰ هزار یورو در صندوق‌های مورد تأیید دولت است. مزیت آن امکان درخواست برای همسر و فرزندان، بدون الزام به اقامت دائم و بدون نیاز به مدرک زبان است.",
    keywords: ["گلدن", "ویزا", "سرمایه", "سرمایهگذاری", "اقامت", "ده", "سال"],
    category: "سرمایه‌گذاری",
  },
  {
    question: "شرایط تحصیل پزشکی در مجارستان چگونه است؟",
    answer:
      "برای پذیرش پزشکی نیاز به دیپلم با میانگین بالا، آزمون ورودی (زیست/شیمی/فیزیک) و مصاحبه انگلیسی دارید. شهریه سالانه حدود ۱۸ تا ۲۰ هزار دلار است و دوره ۶ ساله است. دانشگاه‌های اصلی Semmelweis، Debrecen، Szeged و Pécs هستند.",
    keywords: ["پزشکی", "تحصیل", "دانشگاه", "دندان", "سملوئیس", "شهریه"],
    category: "تحصیلی",
  },
  {
    question: "بورسیه تحصیلی مجارستان چطور گرفته می‌شود؟",
    answer:
      "بورسیه Stipendium Hungaricum شهریه، خوابگاه و کمک‌هزینه ماهانه را پوشش می‌دهد. مهلت درخواست معمولاً تا میانه ژانویه است. شانس شما با انگیزه‌نامه قوی و معدل بالا افزایش می‌یابد؛ ارزیاب هوشمند سامانه شانس اولیه شما را محاسبه می‌کند.",
    keywords: ["بورسیه", "شیپ", "استیپندیوم", "رایگان", "کمکهزینه"],
    category: "تحصیلی",
  },
  {
    question: "چه مدارکی برای شروع پرونده لازم است؟",
    answer:
      "مدارک پایه: پاسپورت با حداقل ۱۸ ماه اعتبار، شناسنامه، کارت ملی، مدارک تحصیلی با ترجمه رسمی، عکس بیومتریک، پرینت حساب بانکی و سابقه کاری. چک‌لیست هوشمند سامانه بر اساس مسیر انتخابی، مدارک دقیق را به شما نشان می‌دهد.",
    keywords: ["مدارک", "پاسپورت", "چکلیست", "ترجمه", "سند"],
    category: "مدارک",
  },
  {
    question: "زمان صدور ویزای مجارستان چقدر است؟",
    answer:
      "پس از تکمیل پرونده، بررسی سفارت معمولاً ۲۱ تا ۶۰ روز کاری طول می‌کشد. برای مسیر کاری با مجوز کار، کل فرآیند ۳ تا ۵ ماه و برای گلدن ویزا ۳ تا ۵ ماه است. سامانه برای هر مرحله تخمین زمانی هوشمند ارائه می‌دهد.",
    keywords: ["زمان", "مدت", "چقدر طول", "چند ماه", "سریع"],
    category: "ویزا",
  },
  {
    question: "ثبت شرکت در مجارستان چه مزایایی دارد؟",
    answer:
      "مالیات شرکتی ۹ درصد (کمترین در اتحادیه اروپا)، دسترسی به بازار اروپا، ثبت در ۴ تا ۶ هفته و امکان دریافت اقامت مدیرعامل. سرمایه اولیه شرکت Kft می‌تواند تا ۳ میلیون فورینت باشد.",
    keywords: ["شرکت", "ثبت", "kft", "مالیات", "کارآفرینی", "بیزینس"],
    category: "کسب‌وکار",
  },
  {
    question: "آیا خارجی می‌تواند در مجارستان ملک بخرد؟",
    answer:
      "بله، خرید آپارتمان و ملک مسکونی توسط خارجی‌ها آزاد است و به اقامت نیاز ندارد. تنها خرید زمین کشاورزی محدودیت دارد. تیم حقوقی ما پیش از خرید، سند و وضعیت حقوقی ملک را بررسی می‌کند.",
    keywords: ["ملک", "خانه", "آپارتمان", "خرید ملک", "بوداپست", "املاک"],
    category: "املاک",
  },
  {
    question: "برای زندگی در مجارستان به زبان مجاری نیاز دارم؟",
    answer:
      "برای کار و تحصیل به زبان انگلیسی می‌توانید اکتفا کنید، اما برای زندگی روزمره، اداره‌ها و بیمه، یادگیری زبان مجاری در سطح A2 بسیار کمک‌کننده است. دوره‌های ما با اساتید مقیم بوداپست برگزار می‌شود.",
    keywords: ["زبان", "مجاری", "انگلیسی", "دوره", "آموزش"],
    category: "زبان",
  },
  {
    question: "خدمات پس از ورود شامل چه چیزهایی است؟",
    answer:
      "استقبال از فرودگاه، اسکان اولیه، افتتاح حساب بانکی (OTP/K&H/Erste)، اخذ کارت اقامت و آدرس، بیمه درمانی، Tax Card، تبدیل گواهینامه رانندگی، سیم‌کارت و ثبت‌نام مدرسه فرزندان.",
    keywords: ["پس از ورود", "فرودگاه", "اسکان", "حساب بانکی", "بیمه", "استقرار"],
    category: "پس از ورود",
  },
  {
    question: "نرخ موفقیت پرونده‌های شما چقدر است؟",
    answer:
      "بر اساس داده‌های سامانه، نرخ موفقیت کلی پرونده‌های مجارنشین بالای ۹۵ درصد است. بیش از ۲,۵۰۰ متقاضی از خدمات ما استفاده کرده‌اند و دفاتر ما در تهران و بوداپست فعال است.",
    keywords: ["نرخ موفقیت", "شانس", "اعتبار", "تجربه", "مشتری"],
    category: "عمومی",
  },
  {
    question: "چطور وضعیت پرونده خود را پیگیری کنم؟",
    answer:
      "در صفحه «پیگیری پرونده» کد پرونده (مثل MH-2026-1042) را وارد کنید تا تایم‌لاین، مدارک، پیام‌ها و فاکتورها را ببینید. همچنین در اپلیکیشن موبایل، اعلان لحظه‌ای تغییر وضعیت دریافت می‌کنید.",
    keywords: ["پیگیری", "پرونده", "کد", "وضعیت", "تایمزاین", "دنبال"],
    category: "سامانه",
  },
  {
    question: "دفاتر شما کجا فعال است؟",
    answer:
      "دفتر تهران: خیابان ولیعصر (با وقت قبلی) و دفتر بوداپست: مرکز شهر، نزدیک پارلمان. جلسات آنلاین ویدیویی نیز در سامانه برای متقاضیان در تمام شهرها فعال است.",
    keywords: ["دفتر", "تهران", "بوداپست", "آدرس", "جلسه"],
    category: "عمومی",
  },
  {
    question: "آیا امکان انتقال وجه از ایران به مجارستان وجود دارد؟",
    answer:
      "بله، تیم مالی ما مسیرهای قانونی انتقال وجه برای شهریه دانشگاه، خرید ملک و سرمایه شرکت را با مستندسازی کامل پیشنهاد می‌دهد تا در بررسی ضدپول‌شویی بانک مشکل ایجاد نشود.",
    keywords: ["انتقال وجه", "پول", "ارز", "صرافی", "حساب", "واریز"],
    category: "مالی",
  },
];

let seedPromise: Promise<void> | null = null;

async function seedAll(): Promise<void> {
  // خدمات
  const [{ count: serviceCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(services);
  if (serviceCount === 0) {
    await db.insert(services).values(SERVICE_SEED).onConflictDoNothing();
  }

  // خدمات جدید قوانین ۲۰۲۶ (upsert ایمن با تکیه بر یکتایی slug)
  const SERVICE_2026: ServiceSeed[] = [
    {
      slug: "blue-card",
      titleFa: "کارت آبی اروپا (EU Blue Card)",
      titleEn: "EU Blue Card Hungary",
      category: "مهاجرت کاری",
      icon: "💳",
      summary: "اقامت ۴ ساله متخصصان با مدرک دانشگاهی؛ سریع‌ترین مسیر کاری پس از قانون ۲۰۲۶.",
      description:
        "پس از لغو مسیر کارگر مهمان، Blue Card بهترین گزینه متخصصان IT، مهندسی و پزشکی است: جاب‌آفر با حقوق بالا، ثبت در Enter Hungary، بیومتریک و دریافت کارت ۴ ساله با همراهی خانواده و مسیر سریع اقامت دائم.",
      features: ["ارزیابی شرایط Blue Card", "تطبیق جاب‌آفر با سقف حقوقی", "ثبت Enter Hungary", "همراهی خانواده"],
      priceFromEur: 2600,
      durationLabel: "۴ تا ۶ ماه",
      successRate: 93,
      popularity: 91,
    },
    {
      slug: "self-employment",
      titleFa: "اقامت خوداشتغالی و فریلنسری",
      titleEn: "Self-Employment Residence",
      category: "مهاجرت کاری",
      icon: "🧑‍💻",
      summary: "اقامت بدون نیاز به کارفرما برای فریلنسرها و مشاوران؛ قابل تمدید تا ۳ سال.",
      description:
        "ثبت خوداشتغالی یا شرکت، اثبات فعالیت اقتصادی و درآمد پایدار، بیمه و محل اقامت؛ دریافت اقامت یک‌ساله قابل تمدید با امکان تبدیل به اقامت دائم. کم‌ریسک‌ترین جایگزین مسیر بسته‌شده کارگر مهمان.",
      features: ["ثبت خوداشتغالی یا Kft", "بیزینس‌پلن و اثبات درآمد", "بیمه و محل اقامت", "تمدید سالانه"],
      priceFromEur: 3500,
      durationLabel: "۲ تا ۴ ماه",
      successRate: 90,
      popularity: 82,
    },
  ];
  await db.insert(services).values(SERVICE_2026).onConflictDoNothing();

  const [{ count: articleCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(articles);
  if (articleCount === 0) {
    await db.insert(articles).values(ARTICLE_SEED).onConflictDoNothing();
  }

  const [{ count: knowledgeCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(knowledge);
  if (knowledgeCount === 0) {
    await db.insert(knowledge).values(KNOWLEDGE_SEED).onConflictDoNothing();
  }

  // کاربران نمایشی
  const demoUsers = [
    { fullName: "سارا محمدی", email: "applicant@demo.ir", role: "applicant", city: "تهران", phone: "09121234567" },
    { fullName: "رضا کریمی (کارشناس بوداپست)", email: "expert@demo.ir", role: "expert", city: "بوداپست", phone: "0036201234567" },
    { fullName: "مدیر سامانه مجارنشین", email: "admin@demo.ir", role: "admin", city: "تهران", phone: "09120000000" },
  ];

  for (const u of demoUsers) {
    await db
      .insert(users)
      .values({ ...u, passwordHash: hashPassword("123456") })
      .onConflictDoNothing();
  }

  const [{ count: caseCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(cases);
  if (caseCount === 0) {
    const applicantRows = await db.select().from(users).where(sql`email = 'applicant@demo.ir'`).limit(1);
    const expertRows = await db.select().from(users).where(sql`email = 'expert@demo.ir'`).limit(1);
    const applicantId = applicantRows[0]?.id;
    const expertId = expertRows[0]?.id;
    if (applicantId) {
      const inserted = await db
        .insert(cases)
        .values([
          {
            code: "MH-2026-1042",
            userId: applicantId,
            expertId: expertId ?? null,
            serviceTitle: "اقامت کاری و مجوز کار مجارستان",
            stage: 4,
            progress: 62,
            priority: "high",
            successScore: 84,
            estimatedDays: 96,
          },
          {
            code: "MH-2026-1043",
            userId: applicantId,
            expertId: expertId ?? null,
            serviceTitle: "دوره‌های زبان مجاری و انگلیسی",
            stage: 2,
            progress: 28,
            priority: "normal",
            successScore: 91,
            estimatedDays: 45,
          },
          {
            code: "MH-2026-1044",
            userId: applicantId,
            expertId: expertId ?? null,
            serviceTitle: "گلدن ویزا مجارستان (اقامت ۱۰ ساله)",
            stage: 3,
            progress: 45,
            priority: "urgent",
            successScore: 93,
            estimatedDays: 120,
          },
        ])
        .returning();

      const main = inserted[0];
      if (main) {
        await db.insert(caseEvents).values([
          { caseId: main.id, title: "پرونده در سامانه ثبت شد", note: "کد رهگیری صادر و کارشناس تخصیص یافت.", stage: 1, author: "سامانه" },
          { caseId: main.id, title: "ارزیابی هوشمند شانس: ۸۴ از ۱۰۰", note: "موتور توصیه‌گر مسیر کاری را به‌عنوان بهترین گزینه پیشنهاد داد.", stage: 1, kind: "ai", author: "دستیار هوشمند" },
          { caseId: main.id, title: "بارگذاری پاسپورت تأیید شد", note: "OCR پاسخگو بود؛ اطلاعات استخراج و انطباق داده شد.", stage: 2, kind: "doc", author: "رضا کریمی" },
          { caseId: main.id, title: "قرارداد دیجیتال امضا شد", note: "فاکتور شماره ۱ صادر و پرداخت اولیه انجام شد.", stage: 3, kind: "payment", author: "مالی" },
          { caseId: main.id, title: "رزومه برای ۴ کارفرما ارسال شد", note: "دو مصاحبه اولیه در هفته آینده برنامه‌ریزی شد.", stage: 4, author: "رضا کریمی" },
        ]);

        await db.insert(documents).values([
          { caseId: main.id, name: "پاسپورت (صفحه اول)", category: "هویتی", status: "approved" },
          { caseId: main.id, name: "مدارک تحصیلی + ترجمه رسمی", category: "تحصیلی", status: "approved" },
          { caseId: main.id, name: "رزومه انگلیسی", category: "شغلی", status: "pending" },
          { caseId: main.id, name: "پرینت حساب بانکی ۶ ماه", category: "مالی", status: "rejected", note: "مانده حساب کمتر از حد لازم است؛ گردش حساب جدید بارگذاری شود." },
        ]);

        await db.insert(messages).values([
          { caseId: main.id, authorRole: "expert", authorName: "رضا کریمی", body: "سلام، پرونده شما در مرحله اپلای است. دو مصاحبه برای هفته آینده تنظیم شده است." },
          { caseId: main.id, authorRole: "applicant", authorName: "سارا محمدی", body: "ممنون. برای مصاحبه چه مدارکی آماده کنم؟" },
          { caseId: main.id, authorRole: "expert", authorName: "رضا کریمی", body: "پاسپورت، پرینت حساب و یک نسخه چاپی از قرارداد کاری. جلسه تمرین مصاحبه را هم در تقویم ثبت کردم." },
        ]);

        await db.insert(invoices).values([
          { caseId: main.id, title: "پرداخت اولیه خدمات اقامت کاری", amountEur: 2100, amountToman: 4_600_000_000, status: "paid" },
          { caseId: main.id, title: "قسط دوم پس از دریافت مجوز کار", amountEur: 2100, amountToman: 4_600_000_000, status: "unpaid" },
        ]);
      }
    }
  }

  const [{ count: leadCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(leads);
  if (leadCount === 0) {
    await db.insert(leads).values([
      { fullName: "امیر رضایی", phone: "09131112233", serviceSlug: "golden-visa", city: "اصفهان", message: "برای گلدن ویزا با سرمایه ۳۰۰ هزار یورو", status: "new", score: 88 },
      { fullName: "مینا تهرانی", phone: "09195556677", serviceSlug: "study-admission", city: "تهران", message: "پذیرش پزشکی برای دخترم", status: "contacted", score: 74 },
      { fullName: "شرکت پارس‌تک", phone: "02188990011", serviceSlug: "b2b-relocation", city: "تهران", message: "انتقال ۱۲ کارشناس به دفتر بوداپست", status: "converted", score: 95 },
    ]).onConflictDoNothing();
  }
}

export async function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedAll().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
