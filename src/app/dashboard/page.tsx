import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getCaseByCode, getUserCases } from "@/lib/cases";
import { toBundleDTO } from "@/lib/types";
import { CaseWorkspace } from "@/components/case-workspace";
import { STAGES, faDate, faNum, stageLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "داشبورد متقاضی | مجارنشین" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");

  const { code } = await searchParams;
  const myCases = await getUserCases(user.id);
  const selected = code ? await getCaseByCode(code) : myCases[0] ? await getCaseByCode(myCases[0].code) : null;
  const bundle = selected && selected.info.userId === user.id ? toBundleDTO(selected) : null;

  const totalBills = bundle?.bills.reduce((sum, b) => sum + b.amountEur, 0) ?? 0;
  const paidBills = bundle?.bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.amountEur, 0) ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/45">سلام {user.fullName} 👋</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">داشبورد متقاضی</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/assess" className="btn btn-ghost !py-2 !text-xs">
            🧭 ارزیابی هوشمند
          </Link>
          <Link href="/services" className="btn btn-primary !py-2 !text-xs">
            ✚ پرونده جدید
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-3">
          <div className="glass p-4">
            <p className="mb-3 text-sm font-bold">پرونده‌های من ({faNum(myCases.length)})</p>
            <div className="space-y-2">
              {myCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard?code=${c.code}`}
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
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-sky-400" style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className="mt-2 text-[10px] text-white/40">
                    {c.code} • {stageLabel(c.stage)}
                  </p>
                </Link>
              ))}
              {myCases.length === 0 && (
                <p className="rounded-2xl border border-dashed border-white/15 p-4 text-center text-[12px] text-white/40">
                  هنوز پرونده‌ای ندارید. از کاتالوگ خدمات شروع کنید.
                </p>
              )}
            </div>
          </div>

          {bundle && (
            <div className="glass p-4">
              <p className="mb-3 text-sm font-bold">خلاصه مالی</p>
              <Row label="مجموع فاکتور" value={`${faNum(totalBills.toLocaleString("en-US"))} €`} />
              <Row label="پرداخت‌شده" value={`${faNum(paidBills.toLocaleString("en-US"))} €`} tone="text-emerald-300" />
              <Row label="مانده" value={`${faNum((totalBills - paidBills).toLocaleString("en-US"))} €`} tone="text-amber-300" />
              <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-white/35">
                آخرین به‌روزرسانی: {faDate(bundle.info.updatedAt)}
              </p>
            </div>
          )}

          <div className="glass p-4">
            <p className="mb-2 text-sm font-bold">مراحل پرونده</p>
            <ol className="space-y-1.5 text-[11px] text-white/50">
              {STAGES.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-white/10 text-[9px]">{faNum(i + 1)}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <section>
          {bundle ? (
            <CaseWorkspace bundle={bundle} role="owner" />
          ) : (
            <div className="glass p-10 text-center">
              <p className="text-4xl">📁</p>
              <p className="mt-3 text-sm text-white/55">پرونده‌ای برای نمایش انتخاب نشده است.</p>
              <Link href="/services" className="btn btn-primary mt-4 !py-2 !text-xs">
                شروع پرونده جدید
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 text-[12px] last:border-0">
      <span className="text-white/50">{label}</span>
      <span className={`font-bold ${tone}`}>{value}</span>
    </div>
  );
}
