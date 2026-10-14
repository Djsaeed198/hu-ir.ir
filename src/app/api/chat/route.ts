import { answerQuestion } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let query = "";
  try {
    const body = (await request.json()) as { query?: string };
    query = (body.query ?? "").trim();
  } catch {
    return Response.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
  if (!query) {
    return Response.json({ ok: false, error: "متن سوال خالی است" }, { status: 400 });
  }
  const answer = await answerQuestion(query);
  return Response.json({ ok: true, ...answer });
}
