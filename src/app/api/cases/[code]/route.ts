import { eq } from "drizzle-orm";
import { db } from "@/db";
import { caseEvents, cases } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getCaseByCode } from "@/lib/cases";
import { stageLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { code } = await params;
  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده‌ای با این کد یافت نشد" }, { status: 404 });
  return Response.json({ ok: true, bundle });
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { code } = await params;
  const user = await getSessionUser();
  if (!user || (user.role !== "expert" && user.role !== "admin")) {
    return Response.json({ ok: false, error: "دسترسی فقط برای کارشناس و مدیر" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده یافت نشد" }, { status: 404 });

  const stage = typeof body.stage === "number" ? Math.min(7, Math.max(1, body.stage)) : bundle.info.stage;
  const progress =
    typeof body.progress === "number" ? Math.min(100, Math.max(0, body.progress)) : bundle.info.progress;
  const status = typeof body.status === "string" ? body.status : bundle.info.status;

  await db
    .update(cases)
    .set({ stage, progress, status, updatedAt: new Date() })
    .where(eq(cases.id, bundle.info.id));

  await db.insert(caseEvents).values({
    caseId: bundle.info.id,
    title: `به‌روزرسانی مرحله: ${stageLabel(stage)}`,
    note: typeof body.note === "string" && body.note ? body.note : `پیشرفت پرونده به ${progress}٪ رسید.`,
    stage,
    kind: "status",
    author: user.fullName,
  });

  return Response.json({ ok: true });
}
