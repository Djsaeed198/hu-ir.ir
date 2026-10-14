import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { getSessionUser } from "@/lib/auth";
import { createCase, getUserCases } from "@/lib/cases";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: false, error: "ابتدا وارد شوید" }, { status: 401 });
  const rows = await getUserCases(user.id);
  return Response.json({ ok: true, cases: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: false, error: "برای ثبت پرونده ابتدا وارد شوید" }, { status: 401 });
  await ensureSeed();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const slug = String(body.serviceSlug ?? "").trim();
  if (!slug) return Response.json({ ok: false, error: "خدمت انتخاب نشده است" }, { status: 400 });

  const [service] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (!service) return Response.json({ ok: false, error: "خدمت یافت نشد" }, { status: 404 });

  const created = await createCase({
    userId: user.id,
    serviceId: service.id,
    serviceTitle: service.titleFa,
    successScore: Math.min(97, service.successRate - 5),
    estimatedDays: service.durationLabel.includes("هفته")
      ? 40
      : service.durationLabel.includes("ماه")
        ? Number(service.durationLabel.replace(/[^۰-۹0-9]/g, "").slice(0, 1) || 4) * 30
        : 90,
  });

  return Response.json({ ok: true, code: created?.code, case: created });
}
