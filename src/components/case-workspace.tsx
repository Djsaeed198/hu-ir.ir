"use client";

import { useEffect, useRef, useState } from "react";
import { STAGES, faDate, faNum, relativeFa } from "@/lib/format";
import type { CaseBundleDTO, DocDTO } from "@/lib/types";

type Role = "guest" | "owner" | "staff";

const KIND_ICON: Record<string, string> = {
  status: "🔄",
  doc: "📄",
  payment: "💳",
  ai: "🤖",
  note: "📝",
};

const PRIORITY: Record<string, { label: string; className: string }> = {
  normal: { label: "عادی", className: "text-white/60 border-white/15" },
  high: { label: "مهم", className: "text-amber-300 border-amber-300/40" },
  urgent: { label: "فوری", className: "text-rose-300 border-rose-300/40" },
};

export function CaseWorkspace({ bundle, role }: { bundle: CaseBundleDTO; role: Role }) {
  const [tab, setTab] = useState<"timeline" | "docs" | "chat" | "finance">("timeline");
  const [data, setData] = useState<CaseBundleDTO>(bundle);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [docName, setDocName] = useState("");
  const [docCat, setDocCat] = useState("هویتی");
  const chatRef = useRef<HTMLDivElement>(null);

  const canManage = role === "staff";

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [data.chat.length, tab]);

  async function refresh() {
    const res = await fetch(`/api/cases/${data.info.code}`, { cache: "no-store" });
    const json = (await res.json()) as { ok: boolean; bundle?: CaseBundleDTO };
    if (json.bundle) setData(json.bundle);
  }

  async function updateCase(patch: { stage?: number; progress?: number; status?: string; note?: string }) {
    setBusy(true);
    await fetch(`/api/cases/${data.info.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await refresh();
    setBusy(false);
  }

  async function addMessage() {
    if (!msg.trim()) return;
    setBusy(true);
    await fetch(`/api/cases/${data.info.code}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: msg }),
    });
    setMsg("");
    await refresh();
    setBusy(false);
  }

  async function addDocument() {
    if (!docName.trim()) return;
    setBusy(true);
    await fetch(`/api/cases/${data.info.code}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: docName, category: docCat }),
    });
    setDocName("");
    await refresh();
    setBusy(false);
  }

  async function reviewDoc(doc: DocDTO, status: string) {
    setBusy(true);
    await fetch(`/api/cases/${data.info.code}/documents`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: doc.id, status }),
    });
    await refresh();
    setBusy(false);
  }

  const info = data.info;
  const priority = PRIORITY[info.priority] ?? PRIORITY.normal;
  const approved = data.docs.filter((d) => d.status === "approved").length;
  const remainingDays = Math.max(0, info.estimatedDays - Math.round((Date.now() - new Date(info.createdAt).getTime()) / 86_400_000));

  return (
    <div className="space-y-4">
      <div className="glass p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge !text-emerald-300">کد {info.code}</span>
              <span className={`badge ${priority.className}`}>{priority.label}</span>
              <span className={`badge ${info.status === "active" ? "text-emerald-300 border-emerald-300/40" : "text-white/50"}`}>
                {info.status === "active" ? "در جریان" : info.status === "waiting" ? "در انتظار مدارک" : "بسته شده"}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-extrabold">{info.serviceTitle}</h2>
            <p className="mt-1 text-xs text-white/45">
              متقاضی: {data.applicantName} • کارشناس: {data.expertName ?? "در حال تخصیص"} • شروع: {faDate(info.createdAt)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <MiniStat label="شانس موفقیت" value={`${faNum(info.successScore)}٪`} tone="text-emerald-300" />
            <MiniStat label="پیشرفت" value={`${faNum(info.progress)}٪`} tone="text-sky-300" />
            <MiniStat label="روز باقی‌مانده" value={faNum(remainingDays)} tone="text-amber-300" />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px] text-white/50">
            <span>{STAGES[info.stage - 1]}</span>
            <span>{faNum(info.progress)}٪ تکمیل</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-l from-emerald-400 via-teal-400 to-sky-400 transition-all duration-700"
              style={{ width: `${info.progress}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STAGES.map((s, i) => (
              <span
                key={s}
                className={`rounded-lg px-2 py-1 text-[10px] ${
                  i + 1 < info.stage
                    ? "bg-emerald-400/15 text-emerald-300"
                    : i + 1 === info.stage
                      ? "bg-sky-400/20 text-sky-200"
                      : "bg-white/5 text-white/35"
                }`}
              >
                {i + 1 < info.stage ? "✓ " : ""}
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {canManage && (
        <div className="glass border-emerald-400/25 p-5">
          <p className="mb-3 text-sm font-bold text-emerald-300">🛠️ کنترل کارشناس</p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-white/55">
              مرحله
              <select
                className="field mt-1 !py-2"
                value={info.stage}
                onChange={(e) => updateCase({ stage: Number(e.target.value) })}
              >
                {STAGES.map((s, i) => (
                  <option key={s} value={i + 1} className="bg-[#0d1424]">
                    {faNum(i + 1)} — {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-white/55">
              وضعیت
              <select
                className="field mt-1 !py-2"
                value={info.status}
                onChange={(e) => updateCase({ status: e.target.value })}
              >
                <option value="active" className="bg-[#0d1424]">در جریان</option>
                <option value="waiting" className="bg-[#0d1424]">در انتظار مدارک</option>
                <option value="closed" className="bg-[#0d1424]">بسته شده</option>
              </select>
            </label>
            <div className="min-w-[220px] flex-1">
              <input
                className="field !py-2"
                placeholder="یادداشت برای ثبت در تایم‌لاین…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/55">{faNum(info.progress)}٪</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={info.progress}
                onChange={(e) => updateCase({ progress: Number(e.target.value) })}
                className="h-1.5 w-32 accent-emerald-400"
              />
              <button
                disabled={busy}
                onClick={() => updateCase({ note })}
                className="btn btn-primary !py-2 !text-xs"
              >
                ثبت یادداشت
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass overflow-hidden">
        <div className="flex overflow-x-auto border-b border-white/10">
          {(
            [
              ["timeline", "تایم‌لاین", `${faNum(data.events.length)} رویداد`],
              ["docs", "مدارک", `${faNum(approved)}/${faNum(data.docs.length)} تأیید`],
              ["chat", "گفتگو", `${faNum(data.chat.length)} پیام`],
              ["finance", "مالی", `${faNum(data.bills.length)} فاکتور`],
            ] as const
          ).map(([key, label, hint]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 px-5 py-3 text-sm transition ${
                tab === key ? "border-b-2 border-emerald-400 text-emerald-300" : "text-white/55 hover:text-white"
              }`}
            >
              {label} <span className="text-[10px] text-white/35">{hint}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "timeline" && (
            <ol className="relative space-y-5 border-r border-white/10 pe-5">
              {[...data.events].reverse().map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -right-[27px] grid h-6 w-6 place-items-center rounded-full bg-[#0d1424] text-xs ring-1 ring-white/15">
                    {KIND_ICON[e.kind] ?? "•"}
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold">{e.title}</p>
                      <span className="text-[10px] text-white/40">{relativeFa(e.createdAt)}</span>
                    </div>
                    {e.note && <p className="mt-1.5 text-[13px] leading-6 text-white/55">{e.note}</p>}
                    <p className="mt-2 text-[10px] text-white/35">توسط {e.author} • {faDate(e.createdAt)}</p>
                  </div>
                </li>
              ))}
              {data.events.length === 0 && <Empty text="هنوز رویدادی ثبت نشده است." />}
            </ol>
          )}

          {tab === "docs" && (
            <div className="space-y-4">
              {role !== "guest" && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
                  <input
                    className="field !py-2 flex-1"
                    placeholder="نام مدرک (مثال: پاسپورت صفحه اول)"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                  />
                  <select className="field !py-2 w-auto" value={docCat} onChange={(e) => setDocCat(e.target.value)}>
                    {["هویتی", "تحصیلی", "شغلی", "مالی", "پزشکی", "ملکی", "عمومی"].map((c) => (
                      <option key={c} value={c} className="bg-[#0d1424]">
                        {c}
                      </option>
                    ))}
                  </select>
                  <button disabled={busy} onClick={addDocument} className="btn btn-ghost !py-2 !text-xs">
                    ⬆️ بارگذاری مدرک
                  </button>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {data.docs.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold">{d.name}</p>
                        <p className="mt-1 text-[11px] text-white/40">
                          {d.category} • {faDate(d.createdAt)}
                        </p>
                      </div>
                      <DocBadge status={d.status} />
                    </div>
                    {d.note && <p className="mt-2 text-[11px] text-amber-300/80">{d.note}</p>}
                    {canManage && (
                      <div className="mt-3 flex gap-2">
                        <button
                          disabled={busy}
                          onClick={() => reviewDoc(d, "approved")}
                          className="btn btn-ghost !py-1.5 !text-[11px] !text-emerald-300"
                        >
                          ✓ تأیید
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => reviewDoc(d, "rejected")}
                          className="btn btn-ghost !py-1.5 !text-[11px] !text-rose-300"
                        >
                          ✕ نیاز به اصلاح
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {data.docs.length === 0 && <Empty text="مدرکی بارگذاری نشده است." />}
              </div>
            </div>
          )}

          {tab === "chat" && (
            <div className="space-y-3">
              <div ref={chatRef} className="chat-scroll max-h-[360px] space-y-3 overflow-y-auto pe-1">
                {data.chat.map((m) => {
                  const mine = m.authorRole === "applicant" && role === "owner";
                  const staff = m.authorRole === "expert" || m.authorRole === "admin";
                  return (
                    <div key={m.id} className={mine ? "flex justify-start" : "flex justify-end"}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-6 ${
                          staff
                            ? "border border-emerald-400/25 bg-emerald-400/10 text-emerald-50"
                            : mine
                              ? "bg-sky-400/15 text-sky-50"
                              : "border border-white/10 bg-white/[0.04]"
                        }`}
                      >
                        <p className="mb-1 text-[10px] text-white/45">
                          {m.authorName} • {relativeFa(m.createdAt)}
                        </p>
                        {m.body}
                      </div>
                    </div>
                  );
                })}
                {data.chat.length === 0 && <Empty text="گفتگو آغاز نشده است." />}
              </div>
              {role !== "guest" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    className="field !py-2.5"
                    placeholder="پیام خود را بنویسید…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <button disabled={busy} className="btn btn-primary !py-2.5 !text-xs">
                    ارسال
                  </button>
                </form>
              )}
            </div>
          )}

          {tab === "finance" && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>شرح</th>
                    <th>مبلغ (یورو)</th>
                    <th>مبلغ (تومان)</th>
                    <th>وضعیت</th>
                    <th>سررسید</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bills.map((b) => (
                    <tr key={b.id}>
                      <td>{b.title}</td>
                      <td>{faNum(b.amountEur.toLocaleString("en-US"))}</td>
                      <td>{faNum((b.amountToman / 1_000_000).toFixed(0))} میلیون</td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === "paid" ? "text-emerald-300 border-emerald-300/40" : "text-amber-300 border-amber-300/40"
                          }`}
                        >
                          {b.status === "paid" ? "پرداخت شده" : b.status === "installment" ? "اقساطی" : "در انتظار پرداخت"}
                        </span>
                      </td>
                      <td>{faDate(b.dueDate)}</td>
                    </tr>
                  ))}
                  {data.bills.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-white/40">
                        فاکتوری صادر نشده است.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className={`text-base font-black ${tone}`}>{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  );
}

export function DocBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    approved: { label: "تأیید شده", cls: "text-emerald-300 border-emerald-300/40" },
    rejected: { label: "نیاز به اصلاح", cls: "text-rose-300 border-rose-300/40" },
    pending: { label: "در بررسی", cls: "text-amber-300 border-amber-300/40" },
  };
  const item = map[status] ?? map.pending;
  return <span className={`badge ${item.cls}`}>{item.label}</span>;
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-white/35">{text}</p>;
}
