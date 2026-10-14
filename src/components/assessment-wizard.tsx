"use client";

import Link from "next/link";
import { useState } from "react";
import { LeadForm } from "@/components/lead-form";
import type { AssessInput, AssessResult } from "@/lib/advisor";
import { ASSESS_QUESTIONS } from "@/lib/advisor";
import { faNum } from "@/lib/format";

type Extra = { jobOffer: boolean; family: boolean };

export function AssessmentWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState<Extra>({ jobOffer: false, family: false });
  const [result, setResult] = useState<AssessResult | null>(null);
  const [loading, setLoading] = useState(false);

  const total = ASSESS_QUESTIONS.length + 1;
  const progress = Math.round((step / total) * 100);

  function choose(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => setStep((s) => Math.min(total, s + 1)), 180);
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: answers.age,
          education: answers.education,
          capital: answers.capital,
          language: answers.language,
          purpose: answers.purpose,
          timeline: answers.timeline,
          jobOffer: extra.jobOffer,
          family: extra.family,
        }),
      });
      const data = (await res.json()) as { ok: boolean; result?: AssessResult };
      if (data.result) setResult(data.result);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return <ResultView result={result} onReset={() => { setResult(null); setStep(0); setAnswers({}); }} />;
  }

  if (step >= total) {
    return (
      <div className="glass p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg font-extrabold">مرحله آخر: دو سوال تکمیلی</p>
          <span className="badge">{faNum(progress)}٪</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ToggleCard
            icon="💼"
            title="پیشنهاد شغلی دارید؟"
            desc="جاب‌آفر یا قرارداد کاری معتبر اروپایی"
            active={extra.jobOffer}
            onClick={() => setExtra({ ...extra, jobOffer: !extra.jobOffer })}
          />
          <ToggleCard
            icon="👨‍👩‍👧"
            title="همراه با خانواده؟"
            desc="همسر یا فرزند زیر ۱۸ سال"
            active={extra.family}
            onClick={() => setExtra({ ...extra, family: !extra.family })}
          />
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button onClick={() => setStep(total - 1)} className="btn btn-ghost flex-1">
            بازگشت
          </button>
          <button onClick={submit} disabled={loading} className="btn btn-primary flex-[2]">
            {loading ? "در حال تحلیل هوشمند…" : "🚀 محاسبه شانس موفقیت پرونده"}
          </button>
        </div>
      </div>
    );
  }

  const q = ASSESS_QUESTIONS[step];

  return (
    <div className="glass overflow-hidden">
      <div className="h-1.5 w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-l from-emerald-400 to-sky-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="badge !text-emerald-300">سوال {faNum(step + 1)} از {faNum(ASSESS_QUESTIONS.length + 1)}</span>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-xs text-white/50 hover:text-white disabled:opacity-30"
          >
            ← بازگشت
          </button>
        </div>
        <h3 className="mt-4 text-xl font-extrabold sm:text-2xl">{q.title}</h3>
        <p className="mt-2 text-sm text-white/50">{q.hint}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.options.map((opt) => {
            const active = answers[q.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => choose(q.id, opt.value)}
                className={`group rounded-2xl border p-4 text-right transition ${
                  active
                    ? "border-emerald-400/70 bg-emerald-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-emerald-400/40 hover:bg-white/[0.06]"
                }`}
              >
                <span className="block text-sm font-bold">{opt.label}</span>
                <span className="mt-1 block text-[11px] text-white/40">
                  {active ? "✓ انتخاب شد" : "برای انتخاب کلیک کنید"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-right transition ${
        active ? "border-emerald-400/70 bg-emerald-400/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-xl">{icon}</span>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-[11px] text-white/45">{desc}</span>
      </span>
      <span className={`ms-auto text-lg ${active ? "text-emerald-300" : "text-white/20"}`}>{active ? "◉" : "○"}</span>
    </button>
  );
}

function ResultView({ result, onReset }: { result: AssessResult; onReset: () => void }) {
  const circumference = 2 * Math.PI * 54;
  const dash = (result.score / 100) * circumference;
  const tone =
    result.score >= 80 ? "#34d399" : result.score >= 65 ? "#38bdf8" : result.score >= 50 ? "#fbbf24" : "#fb7185";

  return (
    <div className="space-y-5 rise">
      <div className="glass p-6 sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[240px_1fr]">
          <div className="relative mx-auto h-[240px] w-[240px]">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke={tone}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-4xl font-black" style={{ color: tone }}>
                  {faNum(result.score)}
                </p>
                <p className="text-[11px] text-white/50">از ۱۰۰ امتیاز</p>
                <p className="mt-1 text-xs font-bold" style={{ color: tone }}>
                  {result.verdict}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg font-extrabold">گزارش ارزیابی هوشمند پرونده</p>
            <p className="mt-2 text-sm leading-7 text-white/60">{result.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Stat label="احتمال موفقیت" value={`${faNum(result.successProbability)}٪`} icon="📈" />
              <Stat label="زمان تخمینی پرونده" value={`${faNum(result.estimatedDays)} روز`} icon="⏱️" />
              <Stat label="مسیرهای پیشنهادی" value={`${faNum(result.paths.length)} مسیر`} icon="🧭" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold text-emerald-300">✅ نقاط قوت پرونده</p>
          <ul className="space-y-2 text-sm text-white/65">
            {result.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-emerald-400">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold text-amber-300">⚠️ ریسک‌ها و اقدامات اصلاحی</p>
          <ul className="space-y-2 text-sm text-white/65">
            {result.risks.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-amber-400">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-extrabold">🎯 مسیرهای پیشنهادی موتور هوشمند</p>
        {result.paths.map((p, i) => (
          <div key={p.key} className="glass glass-hover p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-sm font-black text-emerald-300">
                  {faNum(i + 1)}
                </span>
                <div>
                  <p className="font-bold">{p.title}</p>
                  <p className="text-[11px] text-white/45">
                    هزینه از {faNum(p.costEur.toLocaleString("en-US"))} یورو • حدود {faNum(p.durationMonths)} ماه
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-sky-400"
                    style={{ width: `${p.match}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-emerald-300">{faNum(p.match)}٪ تطبیق</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/60">{p.summary}</p>
            <ol className="mt-3 grid gap-1.5 text-[13px] text-white/55 sm:grid-cols-2">
              {p.steps.map((s, idx) => (
                <li key={s}>
                  <span className="text-emerald-400">{faNum(idx + 1)}.</span> {s}
                </li>
              ))}
            </ol>
            <Link href={`/services/${p.serviceSlug}`} className="btn btn-ghost mt-4 !py-2 !text-xs">
              مشاهده خدمت و شروع پرونده
            </Link>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass p-5">
          <p className="mb-3 text-sm font-bold text-sky-300">🚀 گام‌های بعدی شما</p>
          <ol className="space-y-2 text-sm text-white/65">
            {result.nextActions.map((a, i) => (
              <li key={a} className="flex gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-400/15 text-[10px] text-sky-300">
                  {faNum(i + 1)}
                </span>
                {a}
              </li>
            ))}
          </ol>
          <button onClick={onReset} className="btn btn-ghost mt-4 w-full !py-2 !text-xs">
            ارزیابی مجدد
          </button>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">شروع پرونده با کارشناس اختصاصی</p>
          <LeadForm score={result.score} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xl">{icon}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
      <p className="text-[11px] text-white/45">{label}</p>
    </div>
  );
}
