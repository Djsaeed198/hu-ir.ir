import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { caseEvents, documents } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getCaseByCode } from "@/lib/cases";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ code: string }> };

const ALLOWED_STATUS = ["pending", "approved", "rejected"];

export async function POST(request: Request, { params }: Ctx) {
  const { code } = await params;
  const user = await getSessionUser();
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  if (!name) return Response.json({ ok: false, error: "نام مدرک الزامی است" }, { status: 400 });

  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده یافت نشد" }, { status: 404 });

  const isStaff = user?.role === "expert" || user?.role === "admin";
  const isOwner = user && user.id === bundle.info.userId;
  if (!isStaff && !isOwner) {
    return Response.json({ ok: false, error: "دسترسی مجاز نیست" }, { status: 403 });
  }

  const [created] = await db
    .insert(documents)
    .values({
      caseId: bundle.info.id,
      name,
      category: String(body.category ?? "عمومی"),
      status: "pending",
      note: typeof body.note === "string" ? body.note : null,
    })
    .returning();

  await db.insert(caseEvents).values({
    caseId: bundle.info.id,
    title: `بارگذاری مدرک: ${name}`,
    note: "مدرک در صف بررسی کارشناس قرار گرفت. OCR و ترجمه خودکار فعال شد.",
    stage: bundle.info.stage,
    kind: "doc",
    author: user?.fullName ?? bundle.applicantName,
  });

  return Response.json({ ok: true, document: created });
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { code } = await params;
  const user = await getSessionUser();
  if (!user || (user.role !== "expert" && user.role !== "admin")) {
    return Response.json({ ok: false, error: "دسترسی فقط برای کارشناس" }, { status: 403 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.documentId);
  const status = String(body.status ?? "");
  if (!id || !ALLOWED_STATUS.includes(status)) {
    return Response.json({ ok: false, error: "پارامتر نامعتبر" }, { status: 400 });
  }

  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده یافت نشد" }, { status: 404 });

  await db
    .update(documents)
    .set({ status, note: typeof body.note === "string" ? body.note : undefined })
    .where(and(eq(documents.id, id), eq(documents.caseId, bundle.info.id)));

  await db.insert(caseEvents).values({
    caseId: bundle.info.id,
    title: `بررسی مدرک: ${bundle.docs.find((d) => d.id === id)?.name ?? "مدرک"}`,
    note: status === "approved" ? "مدرک تأیید شد." : status === "rejected" ? "مدرک نیاز به اصلاح دارد." : "در انتظار بررسی.",
    stage: bundle.info.stage,
    kind: "doc",
    author: user.fullName,
  });

  return Response.json({ ok: true });
}
