import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import { getSessionUser } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hu-ir.ir";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "مجارنشین | سامانه هوشمند مهاجرت ایران-مجارستان",
    template: "%s | ایران-مجارستان",
  },
  description:
    "سامانه هوشمند و اپلیکیشن جامع خدمات ایران-مجارستان: مهاجرت کاری، تحصیلی، گلدن ویزا، ثبت شرکت، املاک، گمرک، حمل‌ونقل و خدمات پس از ورود با دستیار هوشمند ۲۴ ساعته.",
  manifest: "/manifest.webmanifest",
  applicationName: "مجارنشین",
  keywords: [
    "مهاجرت به مجارستان",
    "اقامت مجارستان",
    "ویزای مجارستان برای ایرانیان",
    "تحصیل در مجارستان",
    "کار در مجارستان",
    "گلدن ویزا مجارستان",
    "کارت آبی اروپا",
    "ثبت شرکت مجارستان",
    "هزینه مهاجرت به مجارستان",
    "بورسیه Stipendium Hungaricum",
    "هزینه زندگی در بوداپست",
    "خوداشتغالی مجارستان",
    "اقامت دائم مجارستان",
    "تابعیت مجارستان",
  ],
  authors: [{ name: "مجموعه ایران-مجارستان", url: BASE }],
  creator: "مجارنشین",
  publisher: "ایران-مجارستان",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    title: "مجارنشین | سامانه هوشمند مهاجرت ایران-مجارستان",
    description: "ارزیابی هوشمند پرونده، پیگیری لحظه‌ای و دستیار ۲۴ ساعته مهاجرت به مجارستان.",
    url: BASE,
    siteName: "ایران-مجارستان (مجارنشین)",
    locale: "fa_IR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "مجارنشین | مهاجرت به مجارستان", description: "مسیر مطمئن مهاجرت به قلب اروپا" },
  alternates: { canonical: BASE },
  category: "immigration",
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black">
          پرش به محتوای اصلی
        </a>
        <SiteHeader user={user} />
        <main id="main-content" className="min-h-[70vh]">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
