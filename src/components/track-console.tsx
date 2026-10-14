"use client";

import { useState } from "react";
import { CaseWorkspace } from "@/components/case-workspace";
import type { CaseBundleDTO } from "@/lib/types";

export function TrackConsole({ initialBundle }: { initialBundle: CaseBundleDTO | null }) {
  const [code, setCode] = useState("");
  const [bundle, setBundle] = useState<CaseBundleDTO | null>(initialBundle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/cases/${code.trim()}`, { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; bundle?: CaseBundleDTO; error?: string };
      if (!json.ok || !json.bundle) {
        setBundle(null);
        setError(json.error ?? "پرونده‌ای با این کد یافت نشد");
      } else {
        setBundle(json.bundle);
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="glass flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex-1">
          <label className="text-xs text-white/55">کد رهگیری پرونده</label>
          <input
            className="field mt-1.5 tracking-widest"
            placeholder="MH-2026-1042"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>
        <button disabled={loading} className="btn btn-primary sm:mt-6">
          {loading ? "در حال جستجو…" : "🔍 پیگیری پرونده"}
        </button>
      </form>

      {error && (
        <div className="glass border-rose-400/30 p-5 text-sm text-rose-200">
          {error} — نمونه کد فعال: <span className="font-mono">MH-2026-1042</span>
        </div>
      )}

      {bundle ? (
        <CaseWorkspace bundle={bundle} role="guest" />
      ) : (
        !error && (
          <div className="glass p-8 text-center">
            <p className="text-4xl">🔎</p>
            <p className="mt-3 text-sm text-white/55">
              کد رهگیری پرونده خود را وارد کنید تا تایم‌لاین، مدارک، گفتگو و وضعیت مالی را لحظه‌ای ببینید.
            </p>
            <p className="mt-2 text-[11px] text-white/35">
              کد نمونه برای تست: <span className="font-mono text-emerald-300">MH-2026-1042</span>
            </p>
          </div>
        )
      )}
    </div>
  );
}
