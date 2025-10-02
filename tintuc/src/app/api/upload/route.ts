// src/app/api/upload/route.ts
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return new Response("Missing file", { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Giới hạn 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return new Response("File quá lớn", { status: 413 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".png";
    const name = `${crypto.randomBytes(16).toString("hex")}${ext}`;
    const filepath = path.join(uploadsDir, name);
    await fs.writeFile(filepath, buffer);

    // ⚡ trả về đường dẫn tương đối để dùng trực tiếp trong Next.js
    return new Response(
      JSON.stringify({
        url: `/uploads/${name}`, // ví dụ: /uploads/abc123.png
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[upload] error:", e);
    return new Response("Upload failed", { status: 500 });
  }
}
