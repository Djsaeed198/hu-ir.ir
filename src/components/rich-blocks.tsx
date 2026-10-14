import Link from "next/link";
import { faNum } from "@/lib/format";
import type { ContentBlock } from "@/lib/upgrade-content";
import type { MediaItem } from "@/lib/media";
import { SmartImage } from "@/components/smart-image";

/* ---------- هیرو صفحات داخلی (با تصویر اختیاری) ---------- */
export function PageHero({
  badge,
  title,
  desc,
  icon,
  updated,
  image,
  imagePriority,
}: {
  badge: string;
  title: string;
  desc: string;
  icon?: string;
  updated?: string;
  image?: MediaItem;
  imagePriority?: boolean;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6">
        {image ? (
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="badge !text-emerald-300">{badge}</span>
              <h1 className="mt-4 max-w-3xl text-3xl font-black leading-relaxed sm:text-4xl">
                {icon && <span className="ml-2">{icon}</span>}
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-8 text-white/55">{desc}</p>
              {updated && <p className="mt-2 text-[11px] text-white/35">{updated}</p>}
            </div>
            <SmartImage media={image} priority={imagePriority} sizes="(max-width: 1024px) 100vw, 45vw" ratio="16/10" />
          </div>
        ) : (
          <>
            <span className="badge !text-emerald-300">{badge}</span>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-relaxed sm:text-4xl">
              {icon && <span className="ml-2">{icon}</span>}
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/55">{desc}</p>
            {updated && <p className="mt-2 text-[11px] text-white/35">{updated}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pt-6 text-xs text-white/40 sm:px-6">
      {trail.map((t, i) => (
        <span key={t.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/20">/</span>}
          {t.href ? (
            <Link href={t.href} className="hover:text-white">{t.label}</Link>
          ) : (
            <span className="text-white/70" aria-current="page">{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ---------- بلوک محتوایی (با تصویر اختیاری) ---------- */
export function ContentSection({ block, image }: { block: ContentBlock; image?: MediaItem }) {
  return (
    <section className="glass overflow-hidden p-0">
      {image && <SmartImage media={image} ratio="21/8" rounded="rounded-none" sizes="(max-width: 1024px) 100vw, 66vw" />}
      <div className="p-5 sm:p-6">
        <h2 className="text-base font-extrabold sm:text-lg">{block.heading}</h2>
        {block.paragraphs?.map((p) => (
          <p key={p.slice(0, 40)} className="mt-3 text-[13px] leading-8 text-white/65">{p}</p>
        ))}
        {block.bullets && (
          <ul className="mt-4 space-y-2.5">
            {block.bullets.map((b) => (
              <li key={b.slice(0, 40)} className="flex gap-2.5 text-[13px] leading-7 text-white/65">
                <span className="mt-0.5 text-emerald-400">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {block.table && (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="data-table">
              <thead>
                <tr>{block.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {block.table.rows.map((r, i) => (
                  <tr key={i}>{r.map((c, j) => <td key={j} className={j === 0 ? "font-bold" : ""}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {block.note && (
          <p className="mt-4 rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-3 text-[12px] leading-7 text-amber-200">
            💡 {block.note}
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- جریان مراحل ---------- */
export function StepsFlow({ steps }: { steps: { n: string; t: string; d: string; time?: string }[] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-6 right-[27px] top-6 hidden w-px bg-gradient-to-b from-emerald-400/60 via-white/10 to-transparent sm:block" />
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="glass glass-hover flex gap-4 p-5">
            <span className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-base font-black text-[#04120d]">
              {faNum(s.n)}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[15px] font-extrabold">{s.t}</p>
                {s.time && <span className="badge !text-[10px] text-sky-300">⏱️ {faNum(s.time)}</span>}
              </div>
              <p className="mt-1.5 text-[13px] leading-7 text-white/55">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- نوار CTA (با تصویر پس‌زمینه اختیاری) ---------- */
export function CtaBand({
  title = "آماده شروع سفر مهاجرتی خود هستید؟",
  desc = "با مشاوران متخصص ما در تهران و بوداپست در تماس باشید؛ پاسخ در کمتر از ۲ ساعت کاری.",
  image,
}: {
  title?: string;
  desc?: string;
  image?: MediaItem;
}) {
  return (
    <div className="glass relative overflow-hidden border-emerald-400/25 p-0 text-center">
      {image && (
        <div className="relative h-44 w-full sm:h-52">
          <SmartImage media={image} ratio="21/5" rounded="rounded-none" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b111c] via-[#0b111c]/60 to-transparent" />
        </div>
      )}
      {!image && <div className="absolute inset-0 grid-lines opacity-40" />}
      <div className="relative p-6 sm:p-10">
        <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-white/55">{desc}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">🎯 مشاوره رایگان</Link>
          <Link href="/assess" className="btn btn-ghost">ارزیابی هوشمند شانس</Link>
          <Link href="/tools/calculator" className="btn btn-ghost">محاسبه هزینه</Link>
        </div>
      </div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: { v: string; l: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.l} className="glass p-5 text-center">
          <p className="text-2xl font-black gradient-text sm:text-3xl">{s.v}</p>
          <p className="mt-1.5 text-[11px] text-white/50">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

export function LinkCards({ links }: { links: { href: string; icon: string; title: string; desc: string; image?: MediaItem }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="glass glass-hover overflow-hidden p-0">
          {l.image && <SmartImage media={l.image} ratio="16/7" rounded="rounded-none" sizes="(max-width: 640px) 100vw, 33vw" />}
          <div className="p-5">
            <p className="text-2xl">{l.icon}</p>
            <p className="mt-2 text-sm font-extrabold">{l.title}</p>
            <p className="mt-1 text-[12px] leading-6 text-white/50">{l.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------- اسکیمای SEO ---------- */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
