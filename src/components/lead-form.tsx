"use client";

import { useState } from "react";

export function LeadForm({
  serviceSlug,
  compact = false,
  score,
}: {
  serviceSlug?: string;
  compact?: boolean;
  score?: number;
}) {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", city: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, serviceSlug, score }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "ثبت درخواست انجام نشد");
        setState("error");
        return;
      }
      setState("done");
      setForm({ fullName: "", phone: "", email: "", city: "", message: "" });
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="glass p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15 text-3xl">✅</div>
        <p className="mt-4 text-base font-bold text-emerald-300">درخواست شما ثبت شد</p>
        <p className="mt-2 text-sm text-white/60">
          کارشناس ما حداکثر تا ۲ ساعت کاری تماس می‌گیرد. کد پیگیری از طریق پیامک ارسال می‌شود.
        </p>
        <button onClick={() => setState("idle")} className="btn btn-ghost mt-4 !py-2 !text-xs">
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`glass p-5 sm:p-6 ${compact ? "" : "sm:p-7"}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          className="field"
          placeholder="نام و نام خانوادگی *"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          required
          className="field"
          placeholder="شماره تماس *"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="field"
          placeholder="ایمیل (اختیاری)"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="field"
          placeholder="شهر"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>
      <textarea
        className="field mt-3 min-h-[90px] resize-y"
        placeholder="شرایط خود را توضیح دهید (تحصیلات، بودجه، هدف از مهاجرت…)"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary mt-4 w-full">
        {state === "loading" ? "در حال ثبت…" : "درخواست مشاوره تخصصی رایگان"}
      </button>
      <p className="mt-3 text-center text-[11px] text-white/40">
        اطلاعات شما رمزنگاری‌شده ذخیره می‌شود و در اختیار شخص ثالث قرار نمی‌گیرد.
      </p>
    </form>
  );
}
