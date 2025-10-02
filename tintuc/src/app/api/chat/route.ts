// src/app/api/chat/route.ts
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";         // dùng Node runtime
export const dynamic = "force-dynamic";  // tránh cache

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    };

    // Gọi OpenAI (đơn giản, không stream)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",          // có thể đổi model
      temperature: 0.3,
      messages,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ??
      "Xin lỗi, tôi chưa có câu trả lời.";

    return Response.json({ answer });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: "Chat API failed", detail: String(err?.message || err) }),
      { status: 500 }
    );
  }
}
