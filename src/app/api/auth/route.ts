import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { hashPassword, setSession, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Body = {
  action?: "login" | "register";
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  city?: string;
};

export async function POST(request: Request) {
  await ensureSeed();
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر است" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || password.length < 5) {
    return Response.json(
      { ok: false, error: "ایمیل و رمز عبور (حداقل ۵ کاراکتر) الزامی است" },
      { status: 400 },
    );
  }

  if (body.action === "register") {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing[0]) {
      return Response.json({ ok: false, error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
    }
    const [created] = await db
      .insert(users)
      .values({
        fullName: (body.fullName ?? "").trim() || "متقاضی جدید",
        email,
        phone: body.phone ?? null,
        city: body.city ?? null,
        passwordHash: hashPassword(password),
        role: "applicant",
      })
      .returning();
    if (!created) {
      return Response.json({ ok: false, error: "ثبت‌نام انجام نشد" }, { status: 500 });
    }
    await setSession(created.id);
    return Response.json({ ok: true, user: { id: created.id, fullName: created.fullName, role: created.role } });
  }

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ ok: false, error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
  }
  await setSession(user.id);
  return Response.json({ ok: true, user: { id: user.id, fullName: user.fullName, role: user.role } });
}
