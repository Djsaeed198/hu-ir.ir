import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeed();
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (fullName.length < 3 || phone.length < 8) {
    return Response.json({ ok: false, error: "نام و شماره تماس معتبر وارد کنید" }, { status: 400 });
  }

  const user = await getSessionUser();
  const scoreBase = typeof body.score === "number" ? body.score : 55;
  const priorityBoost = String(body.serviceSlug ?? "").includes("golden") ? 25 : 0;

  const [created] = await db
    .insert(leads)
    .values({
      fullName,
      phone,
      email: body.email ? String(body.email) : user?.email ?? null,
      serviceSlug: body.serviceSlug ? String(body.serviceSlug) : null,
      city: body.city ? String(body.city) : user?.city ?? null,
      message: body.message ? String(body.message) : null,
      score: Math.min(99, scoreBase + priorityBoost),
    })
    .returning();

  return Response.json({
    ok: true,
    lead: created,
    message: "درخواست شما ثبت شد. کارشناس ما حداکثر تا ۲ ساعت کاری تماس می‌گیرد.",
  });
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || (user.role !== "admin" && user.role !== "expert")) {
    return Response.json({ ok: false, error: "دسترسی مجاز نیست" }, { status: 403 });
  }
  await ensureSeed();
  const status = new URL(request.url).searchParams.get("status");
  const rows = status
    ? await db.select().from(leads).where(eq(leads.status, status)).orderBy(desc(leads.createdAt)).limit(100)
    : await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
  return Response.json({ ok: true, leads: rows });
}
