export const runtime = "nodejs";

import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_COMPAT_API_KEY;
const BASE_URL = process.env.OPENAI_BASE_URL;
const openai = createOpenAI({ apiKey: API_KEY as string, baseURL: BASE_URL });

const OutSchema = z.object({ content: z.string().min(30) });

function withTimeout<T>(p: Promise<T>, ms = 30000) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("ai-timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) return new Response("Missing OPENAI_API_KEY", { status: 500 });
    const { content, instruction, model = "gpt-4.1-mini", locale = "vi" } = await req.json();
    if (!content || !instruction) return new Response("Invalid input", { status: 400 });

    const sys = [
      "Bạn là biên tập viên giỏi, viết lại nội dung rõ ràng, mạch lạc, đúng ngữ pháp.",
      `Ngôn ngữ: ${locale === "vi" ? "Tiếng Việt" : "English"}`,
      "Chỉ trả về JSON đúng schema.",
    ].join("\n");

    const prompt = [
      "Nội dung gốc:",
      content,
      "\n\nYêu cầu viết lại:",
      instruction,
      "\n\nTrả về { content } là nội dung sau khi viết lại (có thể giữ markdown).",
    ].join("\n");

    const { object } = await withTimeout(generateObject({
      model: openai(model),
      schema: OutSchema,
      system: sys,
      prompt,
      temperature: 0.5,
    }), 35000);

    return Response.json(object);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "AI failed";
    if (msg.includes("invalid_api_key") || msg.toLowerCase().includes("incorrect api key")) {
      return new Response("Invalid OPENAI_API_KEY", { status: 500 });
    }
    if (msg === "ai-timeout") return new Response("AI timeout", { status: 504 });
    console.error("[/api/ai/rewrite] error:", e);
    return new Response("AI failed", { status: 500 });
  }
}
