/* کتابخانه مرکزی تصاویر: هر تصویر همراه alt فارسی سئو، title و credit */

export type MediaItem = {
  src: string;
  alt: string;
  title: string;
  credit?: string;
};

const px = (id: number, w = 1200, h = 627) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const pxSquare = (id: number, s = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${s}&h=${s}`;

/* ---------- تصاویر پایه ---------- */
export const MEDIA = {
  heroParliamentNight: {
    src: px(37921193),
    alt: "نمونه ویزای کاری مجارستان — ساختمان پارلمان بوداپست در شب کنار رود دانوب",
    title: "مهاجرت به مجارستان ۲۰۲۶ | پارلمان بوداپست",
    credit: "Ch Jawad / Pexels",
  },
  heroParliamentDusk: {
    src: px(18443131),
    alt: "پارلمان مجارستان در غروب کنار دانوب — مقصد مهاجرت ایرانیان",
    title: "اقامت مجارستان | نمای پارلمان در غروب",
    credit: "Masood Aslami / Pexels",
  },
  chainBridgeDay: {
    src: px(9390777),
    alt: "پل زنجیر و پارلمان مجارستان در روز — زندگی در بوداپست",
    title: "زندگی در بوداپست | پل زنجیر",
    credit: "Matias Mango / Pexels",
  },
  chainBridgeAerial: {
    src: px(21625244),
    alt: "نمای هوایی رود دانوب و پل زنجیر بوداپست — قلب اروپا",
    title: "بوداپست از بالا | دانوب و پل زنجیر",
    credit: "Ozan Tabakoğlu / Pexels",
  },
  basilicaStreet: {
    src: px(27196963),
    alt: "کلیسای سنت ایشتوان بوداپست با عابران — جاذبه‌های مجارستان",
    title: "جاذبه‌های بوداپست | کلیسای سنت ایشتوان",
    credit: "Han / Pexels",
  },
  sopronStreet: {
    src: px(19509246),
    alt: "خیابان تاریخی شوپرون مجارستان با ساختمان‌های رنگی",
    title: "شهرهای تاریخی مجارستان | شوپرون",
    credit: "Anikó Liptai / Pexels",
  },
  oldTownSpire: {
    src: px(15058137),
    alt: "خیابان تاریخی اروپایی با معماری سنتی و مناره کلیسا در مجارستان",
    title: "بافت تاریخی شهرهای مجارستان",
    credit: "Helena Jankovičová / Pexels",
  },
  nightStreetCafe: {
    src: px(10018325),
    alt: "خیابان شبانه اروپایی با کافه‌های روباز — زندگی شبانه بوداپست",
    title: "زندگی شبانه بوداپست",
    credit: "dalia nava / Pexels",
  },
  autumnBudapest: {
    src: px(34419014),
    alt: "منظره پاییزی بوداپست با معماری تاریخی — آب‌وهوای مجارستان",
    title: "پاییز بوداپست | آب‌وهوای چهارفصل مجارستان",
    credit: "Pho Tomass / Pexels",
  },
  /* کار و کسب‌وکار */
  businessMeeting: {
    src: px(7433869),
    alt: "جلسه کاری متخصصان در دفتر مدرن — مهاجرت کاری به مجارستان ۲۰۲۶",
    title: "مهاجرت کاری به مجارستان | جلسه با کارفرما",
    credit: "Vlada Karpovich / Pexels",
  },
  businessSigning: {
    src: px(7433919),
    alt: "امضای قرارداد کاری در مجارستان توسط متخصصان — جاب آفر معتبر",
    title: "قرارداد کاری مجارستان | جاب آفر",
    credit: "Vlada Karpovich / Pexels",
  },
  businessFinance: {
    src: px(8353815),
    alt: "بررسی اسناد مالی در دفتر اروپایی — ثبت شرکت در مجارستان",
    title: "ثبت شرکت Kft در مجارستان",
    credit: "Kampus Production / Pexels",
  },
  businessWomen: {
    src: px(7433930),
    alt: "گفت‌وگوی دو مدیر در جلسه کاری — مشاوره مهاجرت کاری مجارستان",
    title: "مشاوره مهاجرت کاری | ایران-مجارستان",
    credit: "Vlada Karpovich / Pexels",
  },
  developerOffice: {
    src: px(6804610),
    alt: "برنامه‌نویس در حال کدنویسی در دفتر مدرن — فرصت شغلی IT در مجارستان",
    title: "کار IT در مجارستان | Blue Card",
    credit: "cottonbro studio / Pexels",
  },
  developerImac: {
    src: px(89724),
    alt: "متخصص نرم‌افزار مشغول کار — مشاغل پرتقاضای فناوری در بوداپست",
    title: "مشاغل IT مجارستان",
    credit: "Lee Campbell / Pexels",
  },
  developerFemale: {
    src: px(3861951),
    alt: "مهندس نرم‌افزار زن در دفتر اروپایی — بازار کار فناوری مجارستان",
    title: "مهندسی نرم‌افزار در مجارستان",
    credit: "ThisIsEngineering / Pexels",
  },
  /* تحصیل */
  graduationGroup: {
    src: px(35487002),
    alt: "جشن فارغ‌التحصیلی دانشجویان جلوی دانشگاه — تحصیل در مجارستان",
    title: "تحصیل در مجارستان | فارغ‌التحصیلی",
    credit: "Saad Bin Hasan / Pexels",
  },
  graduationCaps: {
    src: px(30562665),
    alt: "پرتاب کلاه فارغ‌التحصیلی دانشجویان — بورسیه Stipendium Hungaricum",
    title: "بورسیه تحصیلی مجارستان ۲۰۲۶",
    credit: "Sun / Pexels",
  },
  graduatesOutdoor: {
    src: px(39192309),
    alt: "چهار فارغ‌التحصیل با لباس دانشگاهی — پذیرش دانشگاه‌های مجارستان",
    title: "پذیرش دانشگاه مجارستان",
    credit: "Sinan KRIYA / Pexels",
  },
  languageClass: {
    src: px(6502822),
    alt: "کلاس زبان انگلیسی با معلم و دانشجو پای تخته — دوره زبان مجاری و انگلیسی",
    title: "دوره زبان برای مهاجرت به مجارستان",
    credit: "Thirdman / Pexels",
  },
  languageTeacher: {
    src: px(6503100),
    alt: "معلم در حال تدریس در کلاس پرنشاط — دوره فاندیشن مجارستان",
    title: "دوره فاندیشن و زبان مجارستان",
    credit: "Thirdman / Pexels",
  },
  languageGrammar: {
    src: px(6502823),
    alt: "دو دانشجو در حال تمرین گرامر انگلیسی — آمادگی آیلتس برای پذیرش",
    title: "آمادگی زبان برای تحصیل در مجارستان",
    credit: "Thirdman / Pexels",
  },
  /* ملک و سرمایه‌گذاری */
  apartmentLiving: {
    src: px(8089172),
    alt: "آپارتمان مدرن مینیمال در بوداپست — خرید ملک در مجارستان",
    title: "خرید آپارتمان در بوداپست",
    credit: "Max Vakhtbovych / Pexels",
  },
  apartmentKitchenBlue: {
    src: px(8082197),
    alt: "آشپزخانه مدرن آپارتمان لوکس — سرمایه‌گذاری ملکی مجارستان",
    title: "سرمایه‌گذاری ملکی در مجارستان",
    credit: "Max Vakhtbovych / Pexels",
  },
  apartmentBright: {
    src: px(7173666),
    alt: "نشیمن روشن آپارتمان معاصر — اجاره و خرید خانه در بوداپست",
    title: "اجاره آپارتمان در بوداپست",
    credit: "Max Vakhtbovych / Pexels",
  },
  apartmentKitchenWhite: {
    src: px(7214450),
    alt: "آشپزخانه سفید لوکس آپارتمان نوساز — ملک مسکونی مجارستان",
    title: "ملک مسکونی مجارستان | گلدن ویزا",
    credit: "Max Vakhtbovych / Pexels",
  },
  handshakeEstate: {
    src: px(8469935),
    alt: "دست‌دادن پس از توافق خرید ملک — گلدن ویزا مجارستان ۲۰۲۶",
    title: "گلدن ویزا مجارستان | خرید ملک",
    credit: "Thirdman / Pexels",
  },
  handshakeAgent: {
    src: px(7937688),
    alt: "توافق زوج جوان با مشاور املاک — خرید خانه در بوداپست",
    title: "خرید خانه در بوداپست با مشاور فارسی‌زبان",
    credit: "Pavel Danilyuk / Pexels",
  },
  citySunset: {
    src: px(38909516),
    alt: "چشم‌انداز غروب شهر مدرن کنار آب — سرمایه‌گذاری در مجارستان",
    title: "سرمایه‌گذاری در مجارستان ۲۰۲۶",
    credit: "McFollis / Pexels",
  },
  /* ویزا و سفر */
  passportSeat: {
    src: px(32227477),
    alt: "پاسپورت و وسایل سفر روی صندلی هواپیما — ویزای مجارستان برای ایرانیان",
    title: "ویزای مجارستان | سفر به بوداپست",
    credit: "DΛVΞ GΛRCIΛ / Pexels",
  },
  passportStamps: {
    src: px(4922356),
    alt: "پاسپورت باز با مهرهای سفر در فرودگاه — نمونه ویزای شنگن مجارستان",
    title: "نمونه ویزای شنگن مجارستان",
    credit: "Ekaterina Belinskaya / Pexels",
  },
  passportBag: {
    src: px(1058959),
    alt: "ساک چرمی و پاسپورت در فرودگاه — مدارک سفر به مجارستان",
    title: "مدارک سفر به مجارستان",
    credit: "nappy / Pexels",
  },
  euPassports: {
    src: px(29402986),
    alt: "پاسپورت‌های اروپایی روی نقشه جهان — اقامت شنگن مجارستان",
    title: "اقامت شنگن از طریق مجارستان",
    credit: "Marta Branco / Pexels",
  },
  euPassportsEuro: {
    src: px(29485310),
    alt: "پاسپورت اروپایی روی نقشه با اسکناس یورو — تابعیت و اقامت دائم مجارستان",
    title: "اقامت دائم و تابعیت مجارستان",
    credit: "Marta Branco / Pexels",
  },
  airportWoman: {
    src: px(3885524),
    alt: "مسافر زن با چمدان جلوی ترمینال فرودگاه — استقبال فرودگاهی بوداپست",
    title: "استقبال فرودگاهی بوداپست | خدمات پس از ورود",
    credit: "Gustavo Fring / Pexels",
  },
  airportPhone: {
    src: px(3885589),
    alt: "مسافر در حال انتظار تاکسی با چمدان در فرودگاه — سفر به مجارستان",
    title: "سفر به مجارستان | خدمات فرودگاهی",
    credit: "Gustavo Fring / Pexels",
  },
  airportSuitcase: {
    src: px(3885499),
    alt: "مسافر خوشحال نشسته روی چمدان جلوی فرودگاه مدرن — مهاجرت به بوداپست",
    title: "مهاجرت به بوداپست | شروع زندگی در اروپا",
    credit: "Gustavo Fring / Pexels",
  },
  /* لجستیک */
  containersStack: {
    src: px(27130409),
    alt: "کانتینرهای رنگارنگ چیده‌شده — حمل‌ونقل بین‌المللی ایران-مجارستان",
    title: "حمل بار به مجارستان | لجستیک",
    credit: "Jan van der Wolf / Pexels",
  },
  containersPort: {
    src: px(14801547),
    alt: "بندر شلوغ با کانتینر و لیفتراک — ترخیص گمرکی مجارستان",
    title: "ترخیص گمرکی مجارستان",
    credit: "Aan Amrin / Pexels",
  },
  containersPattern: {
    src: px(27273657),
    alt: "انبار کانتینرهای صنعتی — ترانزیت کالا به اروپا",
    title: "ترانزیت کالا به مجارستان",
    credit: "Jan van der Wolf / Pexels",
  },
  /* درمان */
  doctorsTeam: {
    src: px(5722160),
    alt: "دو پزشک با روپوش و کلیپ‌برد — تحصیل پزشکی در مجارستان",
    title: "تحصیل پزشکی در مجارستان | Semmelweis",
    credit: "cottonbro studio / Pexels",
  },
  doctorsGroup: {
    src: px(6129502),
    alt: "تیم درمانی متنوع در بیمارستان — ویزای درمانی مجارستان",
    title: "ویزای درمانی و توریسم درمانی مجارستان",
    credit: "RDNE Stock project / Pexels",
  },
  doctorsOffice: {
    src: px(8460371),
    alt: "کادر درمان در کلینیک مدرن — خدمات درمانی بوداپست",
    title: "خدمات درمانی بوداپست",
    credit: "Los Muertos Crew / Pexels",
  },
  hospitalCorridor: {
    src: px(5203594),
    alt: "راهروی مدرن بیمارستان با نور روشن — بهداشت و درمان مجارستان",
    title: "بیمارستان‌های مجارستان",
    credit: "Enrique Silva / Pexels",
  },
  hospitalWheelchair: {
    src: px(6129141),
    alt: "پرستار در حال همراهی بیمار در راهروی بیمارستان — پرستاری در مجارستان",
    title: "کار پرستاری در مجارستان",
    credit: "RDNE Stock project / Pexels",
  },
  spaPool: {
    src: px(3967124),
    alt: "استراحت در استخر سرپوشیده — حمام‌های حرارتی معروف بوداپست",
    title: "حمام‌های حرارتی بوداپست",
    credit: "Andrea Piacquadio / Pexels",
  },
  /* حقوقی */
  contractSigning: {
    src: px(8112136),
    alt: "امضای قرارداد رسمی روی کلیپ‌برد — خدمات حقوقی مجارستان",
    title: "قرارداد رسمی مهاجرت | وکیل مجارستانی",
    credit: "Pavel Danilyuk / Pexels",
  },
  justiceStatue: {
    src: px(7876048),
    alt: "بررسی اسناد حقوقی کنار تندیس عدالت — مشاوره حقوقی اقامت مجارستان",
    title: "مشاوره حقوقی اقامت مجارستان",
    credit: "Karolina Grabowska / Pexels",
  },
} satisfies Record<string, MediaItem>;

/* آواتارهای تیم */
export const TEAM_AVATARS = {
  ceo: { src: pxSquare(6102841), alt: "مدیرعامل مجموعه ایران-مجارستان", title: "مدیریت مجموعه ایران-مجارستان" },
  workExpert: { src: pxSquare(31420959), alt: "کارشناس مهاجرت کاری مجارستان", title: "کارشناس مهاجرت کاری" },
  studyExpert: { src: pxSquare(27603433), alt: "کارشناس پذیرش تحصیلی مجارستان", title: "کارشناس پذیرش تحصیلی" },
  lawyer: { src: pxSquare(11701102), alt: "وکیل مهاجرتی مجارستان در بوداپست", title: "وکیل مهاجرتی بوداپست" },
  support1: { src: pxSquare(35721594), alt: "کارشناس پشتیبانی پرونده‌های مجارستان", title: "کارشناس پشتیبانی" },
  support2: { src: pxSquare(35725749), alt: "مشاور خدمات پس از ورود به مجارستان", title: "مشاور استقرار بوداپست" },
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof MEDIA;

/* ---------- نگاشت خدمت -> تصویر ---------- */
const SERVICE_IMAGE_MAP: Record<string, MediaKey> = {
  "work-permit": "businessMeeting",
  "job-offer": "businessSigning",
  "cv-interview": "businessWomen",
  "blue-card": "developerOffice",
  "self-employment": "developerFemale",
  "study-admission": "graduationGroup",
  "medical-university": "doctorsTeam",
  scholarship: "graduationCaps",
  "golden-visa": "handshakeEstate",
  "company-registration": "businessFinance",
  "accounting-tax": "contractSigning",
  realestate: "apartmentLiving",
  "language-courses": "languageClass",
  customs: "containersPort",
  logistics: "containersStack",
  "medical-visa": "doctorsGroup",
  dental: "doctorsOffice",
  "post-arrival": "airportWoman",
  legal: "justiceStatue",
  "tourist-visa": "passportSeat",
  "visa-extension": "passportStamps",
  citizenship: "euPassportsEuro",
  "vip-concierge": "citySunset",
  "b2b-relocation": "businessFinance",
  "money-transfer": "euPassportsEuro",
  academy: "languageTeacher",
};

export function serviceImage(slug: string): MediaItem {
  const key = SERVICE_IMAGE_MAP[slug] ?? "heroParliamentNight";
  return MEDIA[key];
}

/* ---------- نگاشت راهنما / شهر / مقاله ---------- */
const GUIDE_IMAGE_MAP: Record<string, MediaKey> = {
  about: "heroParliamentDusk",
  why: "euPassports",
  life: "nightStreetCafe",
  study: "graduatesOutdoor",
  work: "developerImac",
  investment: "citySunset",
  cities: "chainBridgeAerial",
  culture: "basilicaStreet",
  "cost-of-living": "apartmentBright",
  weather: "autumnBudapest",
  education: "languageGrammar",
  healthcare: "hospitalCorridor",
  transport: "airportPhone",
};

export function guideImage(slug: string): MediaItem {
  return MEDIA[GUIDE_IMAGE_MAP[slug] ?? "chainBridgeDay"];
}

const CITY_IMAGE_MAP: Record<string, MediaKey> = {
  budapest: "chainBridgeDay",
  debrecen: "oldTownSpire",
  szeged: "autumnBudapest",
  pecs: "sopronStreet",
  gyor: "basilicaStreet",
};

export function cityImage(slug: string): MediaItem {
  return MEDIA[CITY_IMAGE_MAP[slug] ?? "chainBridgeAerial"];
}

const ARTICLE_IMAGE_MAP: Record<string, MediaKey> = {
  "golden-visa-2026": "handshakeEstate",
  "work-permit-shortage-list": "developerOffice",
  "semmelweis-guide": "doctorsTeam",
  "budapest-property-yield": "apartmentKitchenBlue",
  "company-tax-9": "businessFinance",
  "nowruz-budapest": "nightStreetCafe",
};

export function articleImage(slug: string, fallback = 0): MediaItem {
  const keys: MediaKey[] = ["heroParliamentNight", "chainBridgeAerial", "euPassports", "graduationGroup", "businessMeeting", "apartmentLiving"];
  const mapped = ARTICLE_IMAGE_MAP[slug];
  if (mapped) return MEDIA[mapped];
  return MEDIA[keys[fallback % keys.length]];
}

/* تصاویر مراحل، ابزارها و بخش‌ها */
export const SECTION_IMAGES = {
  stepConsult: MEDIA.businessWomen,
  stepDocs: MEDIA.passportStamps,
  stepApply: MEDIA.contractSigning,
  stepTrack: MEDIA.airportPhone,
  stepArrival: MEDIA.airportSuitcase,
  toolAssess: MEDIA.euPassports,
  toolCalc: MEDIA.apartmentBright,
  toolChecklist: MEDIA.passportBag,
  toolCompare: MEDIA.citySunset,
  toolCalendar: MEDIA.graduationCaps,
  whyEdu: MEDIA.graduatesOutdoor,
  whyCost: MEDIA.apartmentKitchenWhite,
  whyEu: MEDIA.euPassports,
  whyEconomy: MEDIA.businessFinance,
  whyCulture: MEDIA.basilicaStreet,
  whyLocation: MEDIA.chainBridgeAerial,
  officeTehran: MEDIA.businessMeeting,
  officeBudapest: MEDIA.chainBridgeDay,
  ctaBand: MEDIA.heroParliamentDusk,
} satisfies Record<string, MediaItem>;
