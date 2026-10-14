"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ initialMode, next }: { initialMode: "login" | "register"; next?: string }) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, action: mode }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; user?: { role: string } };
      if (!data.ok) {
        setError(data.error ?? "خطای نامشخص");
        setLoading(false);
        return;
      }
      const target = next ?? (data.user?.role === "admin" ? "/admin" : data.user?.role === "expert" ? "/expert" : "/dashboard");
      router.push(target);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setLoading(false);
    }
  }

  async function demo(email: string) {
    setForm({ ...form, email, password: "123456" });
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "123456", action: "login" }),
    });
    const data = (await res.json()) as { ok: boolean; user?: { role: string } };
    if (data.ok) {
      const target = next ?? (data.user?.role === "admin" ? "/admin" : data.user?.role === "expert" ? "/expert" : "/dashboard");
      router.push(target);
      router.refresh();
    } else {
      setError("ورود نمایشی ناموفق بود");
      setLoading(false);
    }
  }

  return (
    <div className="glass p-6 sm:p-8">
      <div className="mb-6 flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg py-2 text-sm transition ${
              mode === m ? "bg-emerald-400/15 font-bold text-emerald-300" : "text-white/55"
            }`}
          >
            {m === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <>
            <input
              required
              className="field"
              placeholder="نام و نام خانوادگی"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="field"
                placeholder="شماره موبایل"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="field"
                placeholder="شهر"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </>
        )}
        <input
          required
          type="email"
          className="field"
          placeholder="ایمیل"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          type="password"
          className="field"
          placeholder="رمز عبور (حداقل ۵ کاراکتر)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-xs text-rose-300">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "لطفاً صبر کنید…" : mode === "login" ? "ورود به سامانه" : "ساخت حساب کاربری"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-[11px] text-white/45">ورود سریع با حساب‌های نمایشی (رمز: ۱۲۳۴۵۶)</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button onClick={() => demo("applicant@demo.ir")} className="btn btn-ghost !py-2 !text-[11px]">
            متقاضی
          </button>
          <button onClick={() => demo("expert@demo.ir")} className="btn btn-ghost !py-2 !text-[11px]">
            کارشناس
          </button>
          <button onClick={() => demo("admin@demo.ir")} className="btn btn-ghost !py-2 !text-[11px]">
            مدیر سامانه
          </button>
        </div>
      </div>
    </div>
  );
}
