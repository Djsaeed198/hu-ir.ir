import { db } from "@/db";
import { messages } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getCaseByCode } from "@/lib/cases";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { code } = await params;
  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده یافت نشد" }, { status: 404 });
  return Response.json({ ok: true, chat: bundle.chat });
}

export async function POST(request: Request, { params }: Ctx) {
  const { code } = await params;
  const user = await getSessionUser();
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const text = String(body.body ?? "").trim();
  if (!text) return Response.json({ ok: false, error: "متن پیام خالی است" }, { status: 400 });

  const bundle = await getCaseByCode(code);
  if (!bundle) return Response.json({ ok: false, error: "پرونده یافت نشد" }, { status: 404 });

  const isStaff = user?.role === "expert" || user?.role === "admin";
  const isOwner = user && user.id === bundle.info.userId;
  if (!isStaff && !isOwner) {
    return Response.json({ ok: false, error: "برای ارسال پیام وارد حساب خود شوید" }, { status: 403 });
  }

  const [created] = await db
    .insert(messages)
    .values({
      caseId: bundle.info.id,
      authorRole: isStaff ? "expert" : "applicant",
      authorName: user?.fullName ?? bundle.applicantName,
      body: text,
    })
    .returning();

  return Response.json({ ok: true, message: created });
}
