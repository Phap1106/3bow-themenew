export const runtime = "nodejs";

import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_COMPAT_API_KEY;
const BASE_URL = process.env.OPENAI_BASE_URL;

const openai = createOpenAI({ apiKey: API_KEY as string, baseURL: BASE_URL });

const ArticleSchema = z.object({
  title: z.string().min(10).max(120),
  excerpt: z.string().min(30).max(280),
  content: z.string().min(300),
  image: z.string().url().optional().nullable(),
  imageKeywords: z.array(z.string()).optional(),   // NEW
  author: z.string().default("3BOW AI"),
});

const FALLBACK_IMG =
  "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

const STOP = new Set([
  "và","hoặc","là","những","các","về","năm","trong","của","ai","công","nghệ",
  "the","a","an","of","for","to","on","with","in","and"
]);

function extractKeywords(title = "", content = "", limit = 6) {
  const h1 = (content.match(/^#{1,3}\s+(.+)$/gim) || [])
    .map((l) => l.replace(/^#{1,3}\s+/,""));
  const src = (title + " " + h1.join(" ")).toLowerCase();
  const tokens = src
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/đ/g,"d")
    .split(/[^a-z0-9]+/g)
    .filter((w) => w.length > 2 && !STOP.has(w));
  const uniq: string[] = [];
  for (const t of tokens) if (!uniq.includes(t)) uniq.push(t);
  return uniq.slice(0, limit);
}

async function imageByKeywords(keywords: string[]) {
  const seed = Date.now();
  const query = keywords.join(" ");
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/media/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: query, seed }),
      cache: "no-store",
    });
    if (r.ok) {
      const j = await r.json();
      return j.image as string;
    }
  } catch {}
  return FALLBACK_IMG;
}

function withTimeout<T>(p: Promise<T>, ms = 30000) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("ai-timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const { prompt, locale = "vi", model = "gpt-4.1-mini" } = await req.json();

    const aiCall = generateObject({
      model: openai(model),
      schema: ArticleSchema,
      system: [
        "Bạn là biên tập viên báo chí chuyên nghiệp.",
        "Xuất ra DUY NHẤT JSON đúng schema.",
        "content là markdown có heading, bullet, kết luận.",
        "imageKeywords: liệt kê 3-6 từ khóa ngắn liên quan ảnh minh họa.",
        `Ngôn ngữ: ${locale === "vi" ? "Tiếng Việt" : "English"}`,
      ].join("\n"),
      prompt: [
        "Yêu cầu người dùng:",
        prompt,
        "Trả về đủ: title, excerpt, content (>=300 từ), image (URL nếu có), author, imageKeywords[].",
      ].join("\n"),
      temperature: 0.7,
    });

    const { object } = await withTimeout(aiCall, 35000);

    const kw =
      (object.imageKeywords && object.imageKeywords.length
        ? object.imageKeywords
        : extractKeywords(object.title, object.content)) || [];

    const img = await imageByKeywords(kw);

    return Response.json({ ...object, image: img });
  } catch (e: any) {
    // Map invalid key to clearer message for UI
    const msg = typeof e?.message === "string" ? e.message : "AI failed";
    if (msg.includes("invalid_api_key") || msg.toLowerCase().includes("incorrect api key")) {
      return new Response("Invalid OPENAI_API_KEY", { status: 500 });
    }
    if (msg === "ai-timeout") {
      return new Response("AI timeout", { status: 504 });
    }
    console.error("[/api/ai/article] error:", e);
    return new Response("AI failed", { status: 500 });
  }
}
