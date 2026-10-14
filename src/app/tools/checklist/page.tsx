import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Breadcrumbs, CtaBand, PageHero } from "@/components/rich-blocks";
import { BreadcrumbJsonLd } from "@/components/seo-blocks";
import { DocsChecklist } from "@/components/upgrade-widgets";
import { DOCS_BY_VISA } from "@/lib/upgrade-content";
import { MEDIA, SECTION_IMAGES } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "چک‌لیست مدارک مهاجرت مجارستان ۲۰۲۶ | PDF + ذخیره پیشرفت",
  description: "چک‌لیست تعاملی مدارک هر ویزای مجارستان: تیک بزنید، پیشرفت ذخیره شود، خروجی چاپ بگیرید. دانلود PDF رایگان.",
  alternates: { canonical: "https://hu-ir.ir/tools/checklist" },
};

export default async function ChecklistPage({ searchParams }: { searchParams: Promise<{ visa?: string }> }) {
  const { visa } = await searchParams;
  const found = DOCS_BY_VISA.find((d) => d.visa === visa);
  const groups = found ? found.groups : DOCS_BY_VISA.flatMap((d) => d.groups.map((g) => ({ title: `${d.visa} — ${g.title}`, items: g.items })));

  return (
    <div>
      <BreadcrumbJsonLd trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "چک‌لیست مدارک" }]} />
      <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "ابزارها", href: "/tools" }, { label: "چک‌لیست مدارک" }]} />
      <PageHero badge="ابزار آنلاین" title="چک‌لیست هوشمند مدارک" desc="نوع ویزا را انتخاب کنید، مدارک آماده را تیک بزنید؛ پیشرفت شما خودکار ذخیره می‌شود و قابل چاپ است." icon="✅" image={SECTION_IMAGES.toolChecklist} imagePriority />
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/checklist" className={`badge !py-1.5 ${!found ? "!border-emerald-400/50 !text-emerald-300" : ""}`}>همه ویزاها</Link>
            {DOCS_BY_VISA.map((d) => (
              <Link key={d.visa} href={`/tools/checklist?visa=${encodeURIComponent(d.visa)}`} className={`badge !py-1.5 ${found?.visa === d.visa ? "!border-emerald-400/50 !text-emerald-300" : ""}`}>{d.icon} {d.visa}</Link>
            ))}
          </div>
        </Reveal>
        <Reveal><DocsChecklist groups={groups} storageKey={`mh-checklist-${found?.visa ?? "all"}`} /></Reveal>
        <Reveal><CtaBand title="مدارکتان کامل شد؟" desc="در سامانه بارگذاری کنید تا کارشناس بررسی و برای اپلای اقدام کند." image={MEDIA.passportBag} /></Reveal>
      </div>
    </div>
  );
}
