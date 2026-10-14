import { db } from "@/db";
import { knowledge, services } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { LAW_KNOWLEDGE_2026 } from "@/lib/upgrade-content";

export type ChatSource = { title: string; slug: string; category: string };

export type ChatAnswer = {
  reply: string;
  sources: ChatSource[];
  suggestions: string[];
  engine: "llm" | "retrieval";
};

const FALLBACK_SUGGESTIONS = [
  "هزینه اقامت کاری چقدر است؟",
  "گلدن ویزا چیست؟",
  "شرایط پذیرش پزشکی؟",
  "چه مدارکی لازم است؟",
];

function normalize(text: string): string {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[؟?.,!؛;:()[\]{}"'«»]/g, " ")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokenize(text: string): string[] {
  const base = normalize(text).split(" ").filter((w) => w.length > 1);
  const out = new Set<string>();
  for (const word of base) {
    out.add(word);
    // stemming ساده فارسی: حذف پسوندهای رایج
    for (const suffix of ["ها", "هایی", "های", "تر", "ترین", "ای", "ام", "ات"]) {
      if (word.length > suffix.length + 2 && word.endsWith(suffix)) {
        out.add(word.slice(0, -suffix.length));
      }
    }
  }
  return [...out];
}

async function retrieve(query: string) {
  await ensureSeed();
  const [kb, svc] = await Promise.all([db.select().from(knowledge), db.select().from(services)]);
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return { kb, svc, ranked: [] as { row: { question: string; answer: string }; score: number }[] };

  // ترکیب پایگاه دانش دیتابیس با دانش ثابت قوانین ۲۰۲۶ (اولویت بالاتر)
  const combined: { question: string; answer: string; keywords: string[]; category: string; boost: number }[] = [
    ...LAW_KNOWLEDGE_2026.map((k) => ({ ...k, boost: 1.35 })),
    ...kb.map((k) => ({ question: k.question, answer: k.answer, keywords: k.keywords ?? [], category: k.category, boost: 1 })),
  ];

  const ranked = combined
    .map((row) => {
      const kwSet = new Set(tokenize(row.keywords.join(" ")));
      const qSet = new Set(tokenize(`${row.question} ${row.category}`));
      const bodyTokens = tokenize(row.answer);

      const match = (set: Set<string>, weight: number) => {
        let s = 0;
        for (const token of qTokens) {
          if (set.has(token)) s += weight;
          else if ([...set].some((h) => h.length > 2 && (h.includes(token) || token.includes(h)))) s += weight / 2;
        }
        return s;
      };

      let score = match(kwSet, 5) + match(qSet, 3);
      for (const token of qTokens) {
        if (bodyTokens.some((h) => h === token)) score += 1;
      }
      score *= row.boost;
      return { row, score: Math.round(score * 10) / 10 };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { kb, svc, ranked };
}

function pickServices(query: string, svc: (typeof services.$inferSelect)[]): ChatSource[] {
  const qTokens = tokenize(query);
  return svc
    .map((s) => {
      const hay = tokenize(`${s.titleFa} ${s.titleEn} ${s.summary} ${s.category} ${s.slug}`);
      const set = new Set(hay);
      let score = 0;
      for (const t of qTokens) if (set.has(t)) score += 4;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => ({ title: x.s.titleFa, slug: x.s.slug, category: x.s.category }));
}

async function askLlm(query: string, context: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "تو «دستیار هوشمند مجارنشین» هستی؛ مشاور مهاجرت ایران-مجارستان. فقط فارسی، دقیق، کوتاه و با لیست شماره‌دار پاسخ بده. اگر اطلاعات کافی نیست، کاربر را به مشاوره با کارشناس ارجاع بده. اطلاعات پایه:\n" +
              context,
          },
          { role: "user", content: query },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function answerQuestion(query: string): Promise<ChatAnswer> {
  const { svc, ranked } = await retrieve(query);
  const context = ranked
    .map((r, i) => `${i + 1}. ${r.row.question}\n${r.row.answer}`)
    .join("\n\n");

  const sources = pickServices(query, svc);

  if (context) {
    const llm = await askLlm(query, context);
    if (llm) {
      return { reply: llm, sources, suggestions: FALLBACK_SUGGESTIONS, engine: "llm" };
    }
    const top = ranked[0];
    const extra = ranked.slice(1).map((r) => `- ${r.row.question}`).join("\n");
    const reply = `${top.row.answer}${
      sources.length
        ? `\n\nخدمات مرتبط ما: ${sources.map((s) => `«${s.title}»`).join(" ، ")}`
        : ""
    }${extra ? `\n\nسوالات مرتبط:\n${extra}` : ""}\n\nبرای ارزیابی دقیق‌تر پرونده، صفحه «ارزیابی هوشمند» را کامل کنید یا درخواست مشاوره ثبت کنید.`;
    return { reply, sources, suggestions: FALLBACK_SUGGESTIONS, engine: "retrieval" };
  }

  return {
    reply:
      "سوال شما را کامل متوجه نشدم، اما می‌توانم در این زمینه‌ها کمکتان کنم:\n• اقامت کاری و جاب‌آفر\n• پذیرش تحصیلی و بورسیه\n• گلدن ویزا و سرمایه‌گذاری\n• ثبت شرکت و امور مالیاتی\n• خرید ملک و خدمات پس از ورود\n\nیکی از موضوع‌های بالا را بنویسید یا برای اتصال به کارشناس، فرم درخواست مشاوره را پر کنید.",
    sources: [],
    suggestions: FALLBACK_SUGGESTIONS,
    engine: "retrieval",
  };
}
