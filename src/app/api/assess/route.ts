import { db } from "@/db";
import { assessments } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { getSessionUser } from "@/lib/auth";
import { assess, type AssessInput } from "@/lib/advisor";

export const dynamic = "force-dynamic";

const AGES = ["18-24", "25-34", "35-44", "45+"] as const;
const EDU = ["diploma", "bachelor", "master", "phd"] as const;
const CAP = ["lt10k", "10-50k", "50-150k", "gt150k"] as const;
const LANG = ["beginner", "intermediate", "advanced"] as const;
const PURPOSE = ["work", "study", "invest", "business", "family", "treatment"] as const;
const TIME = ["now", "3m", "6m+"] as const;

export async function POST(request: Request) {
  await ensureSeed();
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }

  const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;

  const input: AssessInput = {
    age: pick(raw.age, AGES, "25-34"),
    education: pick(raw.education, EDU, "bachelor"),
    capital: pick(raw.capital, CAP, "10-50k"),
    language: pick(raw.language, LANG, "intermediate"),
    purpose: pick(raw.purpose, PURPOSE, "work"),
    timeline: pick(raw.timeline, TIME, "3m"),
    jobOffer: Boolean(raw.jobOffer),
    family: Boolean(raw.family),
  };

  const result = assess(input);
  const user = await getSessionUser();

  await db.insert(assessments).values({
    userId: user?.id ?? null,
    fullName: typeof raw.fullName === "string" ? raw.fullName : null,
    phone: typeof raw.phone === "string" ? raw.phone : null,
    inputs: input as unknown as Record<string, string>,
    score: result.score,
    verdict: result.verdict,
    paths: result.paths,
    risks: result.risks,
  });

  return Response.json({ ok: true, result });
}
