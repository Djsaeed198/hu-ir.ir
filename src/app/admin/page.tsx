import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { assessments, caseEvents, cases, invoices, leads, services, users } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { getSessionUser } from "@/lib/auth";
import { STAGES, faDate, faNum, relativeFa, stageLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "داشبورد مدیریت | مجارنشین" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  await ensureSeed();

  const [
    userCount,
    caseCount,
    activeCaseCount,
    leadCount,
    assessmentCount,
    serviceCount,
    revenuePaid,
    revenuePending,
    stageRows,
    latestCases,
    latestLeads,
    latestEvents,
    avgScore,
  ] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(users),
    db.select({ c: sql<number>`count(*)::int` }).from(cases),
    db.select({ c: sql<number>`count(*)::int` }).from(cases).where(sql`status = 'active'`),
    db.select({ c: sql<number>`count(*)::int` }).from(leads),
    db.select({ c: sql<number>`count(*)::int` }).from(assessments),
    db.select({ c: sql<number>`count(*)::int` }).from(services),
    db.select({ s: sql<number>`coalesce(sum(amount_eur),0)::int` }).from(invoices).where(sql`status = 'paid'`),
    db.select({ s: sql<number>`coalesce(sum(amount_eur),0)::int` }).from(invoices).where(sql`status <> 'paid'`),
    db
      .select({ stage: cases.stage, c: sql<number>`count(*)::int` })
      .from(cases)
      .groupBy(cases.stage)
      .orderBy(cases.stage),
    db.select().from(cases).orderBy(desc(cases.updatedAt)).limit(8),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
    db.select().from(caseEvents).orderBy(desc(caseEvents.createdAt)).limit(8),
    db.select({ s: sql<number>`coalesce(round(avg(score)),0)::int` }).from(assessments),
  ]);

  const byStage = STAGES.map((label, i) => ({
    label,
    count: stageRows.find((r) => r.stage === i + 1)?.c ?? 0,
  }));
  const maxStage = Math.max(1, ...byStage.map((b) => b.count));

  const conversion = leadCount[0].c ? Math.round((caseCount[0].c / leadCount[0].c) * 100) : 0;
  const statusSplit = [
    { label: "در جریان", value: activeCaseCount[0].c, color: "#34d399" },
    { label: "بسته‌شده", value: Math.max(0, caseCount[0].c - activeCaseCount[0].c), color: "#64748b" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/45">داشبورد مدیریت • {user.fullName}</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">KPI و تحلیل داده سامانه هوشمند</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/expert" className="btn btn-ghost !py-2 !text-xs">پنل کارشناس</Link>
          <Link href="/services" className="btn btn-primary !py-2 !text-xs">مدیریت خدمات</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon="👥" label="کاربران سامانه" value={faNum(userCount[0].c)} sub={`${faNum(2500)}+ مشتری مجموعه`} />
        <Kpi icon="📂" label="پرونده‌ها" value={faNum(caseCount[0].c)} sub={`${faNum(activeCaseCount[0].c)} پرونده فعال`} />
        <Kpi icon="💰" label="درآمد تسویه‌شده" value={`${faNum(revenuePaid[0].s.toLocaleString("en-US"))} €`} sub={`مانده: ${faNum(revenuePending[0].s.toLocaleString("en-US"))} €`} />
        <Kpi icon="🎯" label="نرخ تبدیل سرنخ" value={`${faNum(conversion)}٪`} sub={`${faNum(leadCount[0].c)} سرنخ ثبت‌شده`} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon="🤖" label="ارزیابی‌های هوشمند" value={faNum(assessmentCount[0].c)} sub={`میانگین امتیاز ${faNum(avgScore[0].s)}`} />
        <Kpi icon="🛠️" label="خدمات فعال" value={faNum(serviceCount[0].c)} sub="کاتالوگ ۹ حوزه اصلی" />
        <Kpi icon="⏱️" label="کاهش زمان پردازش" value={`${faNum(40)}٪`} sub="نسبت به فرآیند دستی" />
        <Kpi icon="⭐" label="رضایت مشتری" value={`${faNum(4.8)}/${faNum(5)}`} sub="بر اساس نظرسنجی" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass p-5">
          <p className="mb-5 text-sm font-bold">توزیع پرونده‌ها در مراحل</p>
          <div className="space-y-3">
            {byStage.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex items-center justify-between text-[11px] text-white/50">
                  <span>{b.label}</span>
                  <span>{faNum(b.count)} پرونده</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-sky-400 transition-all"
                    style={{ width: `${(b.count / maxStage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5">
          <p className="mb-5 text-sm font-bold">وضعیت پرونده‌ها</p>
          <div className="flex items-center gap-6">
            <div
              className="relative grid h-36 w-36 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${statusSplit
                  .map((s, i) => `${s.color} ${i === 0 ? 0 : statusSplit[0].value}deg`)
                  .join(", ")}, #1f2937 0deg)`,
              }}
            >
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[#0d1424] text-center">
                <div>
                  <p className="text-lg font-black">{faNum(caseCount[0].c)}</p>
                  <p className="text-[10px] text-white/40">کل پرونده</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-[12px]">
              {statusSplit.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-white/60">{s.label}</span>
                  <span className="font-bold">{faNum(s.value)}</span>
                </div>
              ))}
              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-white/40">
                میانگین شانس موفقیت پرونده‌ها: {faNum(
                  latestCases.length
                    ? Math.round(latestCases.reduce((s, c) => s + c.successScore, 0) / latestCases.length)
                    : 0
                )}٪
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="glass overflow-hidden p-5">
          <p className="mb-4 text-sm font-bold">آخرین پرونده‌ها</p>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>کد</th>
                  <th>خدمت</th>
                  <th>مرحله</th>
                  <th>پیشرفت</th>
                  <th>شانس</th>
                </tr>
              </thead>
              <tbody>
                {latestCases.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-[11px] text-emerald-300">{c.code}</td>
                    <td>{c.serviceTitle}</td>
                    <td className="text-white/60">{stageLabel(c.stage)}</td>
                    <td>{faNum(c.progress)}٪</td>
                    <td>{faNum(c.successScore)}٪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass overflow-hidden p-5">
          <p className="mb-4 text-sm font-bold">سرنخ‌های مشاوره (CRM)</p>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>تماس</th>
                  <th>خدمت</th>
                  <th>امتیاز</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {latestLeads.map((l) => (
                  <tr key={l.id}>
                    <td>{l.fullName}</td>
                    <td className="font-mono text-[11px] text-white/60">{faNum(l.phone)}</td>
                    <td className="text-white/60">{l.serviceSlug ?? "—"}</td>
                    <td className="text-emerald-300">{faNum(l.score)}</td>
                    <td>
                      <span className="badge !text-[10px]">
                        {l.status === "new" ? "جدید" : l.status === "contacted" ? "تماس گرفته شد" : "تبدیل شده"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass mt-6 p-5">
        <p className="mb-4 text-sm font-bold">Audit Trail — آخرین رویدادهای سامانه</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {latestEvents.map((e) => (
            <div key={e.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold">{e.title}</span>
                <span className="text-[10px] text-white/35">{relativeFa(e.createdAt)}</span>
              </div>
              <p className="mt-1 text-[11px] text-white/45">
                توسط {e.author} • {faDate(e.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="glass glass-hover p-5">
      <div className="flex items-start justify-between">
        <p className="text-2xl">{icon}</p>
        <span className="badge !text-[10px] text-white/40">KPI</span>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-1 text-[12px] text-white/55">{label}</p>
      {sub && <p className="mt-1 text-[10px] text-white/35">{sub}</p>}
    </div>
  );
}
