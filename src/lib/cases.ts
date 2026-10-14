import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  caseEvents,
  cases,
  documents,
  invoices,
  messages,
  users,
  type CaseEvent,
  type CaseRow,
  type DocumentRow,
  type Invoice,
  type MessageRow,
} from "@/db/schema";
import { ensureSeed } from "@/db/seed";

export type CaseBundle = {
  info: CaseRow;
  applicantName: string;
  applicantEmail: string;
  expertName: string | null;
  events: CaseEvent[];
  docs: DocumentRow[];
  chat: MessageRow[];
  bills: Invoice[];
};

export async function getCaseByCode(code: string): Promise<CaseBundle | null> {
  await ensureSeed();
  const rows = await db
    .select()
    .from(cases)
    .where(eq(cases.code, code.trim().toUpperCase()))
    .limit(1);
  const info = rows[0];
  if (!info) return null;

  const [applicant] = await db.select().from(users).where(eq(users.id, info.userId)).limit(1);
  const [expert] = info.expertId
    ? await db.select().from(users).where(eq(users.id, info.expertId)).limit(1)
    : [undefined];

  const [events, docs, chat, bills] = await Promise.all([
    db.select().from(caseEvents).where(eq(caseEvents.caseId, info.id)).orderBy(caseEvents.createdAt),
    db.select().from(documents).where(eq(documents.caseId, info.id)).orderBy(desc(documents.createdAt)),
    db.select().from(messages).where(eq(messages.caseId, info.id)).orderBy(messages.createdAt),
    db.select().from(invoices).where(eq(invoices.caseId, info.id)).orderBy(invoices.createdAt),
  ]);

  return {
    info,
    applicantName: applicant?.fullName ?? "متقاضی",
    applicantEmail: applicant?.email ?? "—",
    expertName: expert?.fullName ?? null,
    events,
    docs,
    chat,
    bills,
  };
}

export async function getUserCases(userId: number): Promise<CaseRow[]> {
  await ensureSeed();
  return db.select().from(cases).where(eq(cases.userId, userId)).orderBy(desc(cases.createdAt));
}

export async function generateCaseCode(): Promise<string> {
  const year = new Date().getFullYear();
  const rows = await db.select({ id: cases.id }).from(cases).orderBy(desc(cases.id)).limit(1);
  const next = (rows[0]?.id ?? 1000) + 1043;
  return `MH-${year}-${next}`;
}

export async function createCase(params: {
  userId: number;
  serviceTitle: string;
  serviceId?: number | null;
  expertId?: number | null;
  priority?: string;
  successScore?: number;
  estimatedDays?: number;
}): Promise<CaseRow> {
  await ensureSeed();
  const code = await generateCaseCode();
  const [created] = await db
    .insert(cases)
    .values({
      code,
      userId: params.userId,
      serviceId: params.serviceId ?? null,
      serviceTitle: params.serviceTitle,
      expertId: params.expertId ?? null,
      priority: params.priority ?? "normal",
      successScore: params.successScore ?? 72,
      estimatedDays: params.estimatedDays ?? 90,
      stage: 1,
      progress: 8,
    })
    .returning();

  if (created) {
    await db.insert(caseEvents).values({
      caseId: created.id,
      title: "پرونده در سامانه هوشمند ثبت شد",
      note: `خدمت انتخابی: ${params.serviceTitle}. کارشناس پرونده به‌زودی تخصیص می‌یابد.`,
      stage: 1,
      kind: "status",
      author: "سامانه",
    });
    await db.insert(messages).values({
      caseId: created.id,
      authorRole: "system",
      authorName: "دستیار هوشمند مجارنشین",
      body: "خوش آمدید! چک‌لیست هوشمند مدارک شما فعال شد. پاسپورت، مدارک تحصیلی و پرینت حساب را بارگذاری کنید تا کارشناس بررسی را آغاز کند.",
    });
  }

  return created;
}

export async function findCaseForUser(code: string, userId: number): Promise<CaseRow | null> {
  const rows = await db
    .select()
    .from(cases)
    .where(and(eq(cases.code, code.toUpperCase()), eq(cases.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getExpertCases(expertId: number): Promise<CaseRow[]> {
  await ensureSeed();
  return db.select().from(cases).where(eq(cases.expertId, expertId)).orderBy(desc(cases.updatedAt));
}
