import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { documents, leads } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getCaseByCode, getExpertCases } from "@/lib/cases";
import { toBundleDTO } from "@/lib/types";
import { CaseWorkspace, DocBadge } from "@/components/case-workspace";
import { faDate, faNum, relativeFa, stageLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "پنل کارشناس | مجارنشین" };

export default async function ExpertPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/expert");
  if (user.role !== "expert" && user.role !== "admin") redirect("/dashboard");

  const { code } = await searchParams;
  const myCases = await getExpertCases(user.id);
  const selected = code ? await getCaseByCode(code) : myCases[0] ? await getCaseByCode(myCases[0].code) : null;
  const bundle = selected ? toBundleDTO(selected) : null;

  const caseIds = myCases.map((c) => c.id);
  const pendingDocs = caseIds.length
    ? await db.select().from(documents).where(inArray(documents.caseId, caseIds)).orderBy(desc(documents.createdAt)).limit(12)
    : [];
  const recentLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6);
  const waitingLeads = await db.select().from(leads).where(eq(leads.status, "new")).limit(3);

  const avgProgress = myCases.length
    ? Math.round(myCases.reduce((s, c) => s + c.progress, 0) / myCases.length)
    : 0;
  const active = myCases.filter((c) => c.status === "active").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/45">پنل کارشناس • {user.fullName}</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">مدیریت پرونده‌های تخصیص‌یافته</h1>
        </div>
        <Link href="/admin" className="btn btn-ghost !py-2 !text-xs">
          داشبورد مدیریت
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Kpi label="پرونده فعال" value={faNum(active)} icon="📂" />
        <Kpi label="میانگین پیشرفت" value={`${faNum(avgProgress)}٪`} icon="📈" />
        <Kpi label="مدارک در انتظار بررسی" value={faNum(pendingDocs.filter((d) => d.status === "pending").length)} icon="📄" />
        <Kpi label="سرنخ جدید" value={faNum(waitingLeads.length)} icon="🎯" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="glass p-4">
            <p className="mb-3 text-sm font-bold">لیست پرونده‌ها</p>
            <div className="space-y-2">
              {myCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/expert?code=${c.code}`}
                  className={`block rounded-2xl border p-3 transition ${
                    bundle?.info.code === c.code
                      ? "border-emerald-400/50 bg-emerald-400/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold">{c.serviceTitle}</span>
                    <span className="text-[10px] text-emerald-300">{faNum(c.progress)}٪</span>
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/40">{c.code}</p>
                  <p className="mt-1 text-[10px] text-white/35">
                    {stageLabel(c.stage)} • {relativeFa(c.updatedAt)}
                  </p>
                </Link>
              ))}
              {myCases.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-[12px] text-white/40">
                  پرونده‌ای به شما تخصیص نیافته است.
                </p>
              )}
            </div>
          </div>

          <div className="glass p-4">
            <p className="mb-3 text-sm font-bold">آخرین مدارک بارگذاری‌شده</p>
            <div className="space-y-2">
              {pendingDocs.slice(0, 6).map((d) => (
                <div key={d.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px]">{d.name}</span>
                    <DocBadge status={d.status} />
                  </div>
                  <p className="mt-1 text-[10px] text-white/35">{relativeFa(d.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-4">
            <p className="mb-3 text-sm font-bold">سرنخ‌های مشاوره</p>
            <div className="space-y-2">
              {recentLeads.map((l) => (
                <div key={l.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold">{l.fullName}</span>
                    <span className="text-[10px] text-emerald-300">{faNum(l.score)}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-white/40">
                    {l.phone} • {l.serviceSlug ?? "بدون خدمت"}
                  </p>
                  <p className="mt-1 text-[10px] text-white/30">{faDate(l.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section>
          {bundle ? (
            <CaseWorkspace bundle={bundle} role="staff" />
          ) : (
            <div className="glass p-10 text-center text-sm text-white/50">پرونده‌ای انتخاب نشده است.</div>
          )}
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass flex items-center gap-3 p-4">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-xl">{icon}</span>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-[11px] text-white/45">{label}</p>
      </div>
    </div>
  );
}
