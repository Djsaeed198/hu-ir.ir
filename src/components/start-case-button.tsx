"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartCaseButton({ serviceSlug }: { serviceSlug: string }) {
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  async function start() {
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string; error?: string };
      if (res.status === 401) {
        router.push(`/login?next=/services/${serviceSlug}`);
        return;
      }
      if (!data.ok || !data.code) {
        setError(data.error ?? "ثبت پرونده انجام نشد");
        setState("idle");
        return;
      }
      router.push(`/dashboard?code=${data.code}`);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      setState("idle");
    }
  }

  return (
    <>
      <button onClick={start} disabled={state === "loading"} className="btn btn-primary w-full !py-2.5 !text-xs">
        {state === "loading" ? "در حال ثبت…" : "✚ ثبت پرونده در سامانه"}
      </button>
      {error && <p className="mt-2 text-[11px] text-rose-300">{error}</p>}
    </>
  );
}
