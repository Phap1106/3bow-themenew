import { NextResponse } from "next/server";
import { authHeaders } from "@/lib/server/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "20";

  const res = await fetch(`${API}/articles?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`, {
    headers: await authHeaders(),
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}

export async function POST(req: Request) {
  const res = await fetch(`${API}/articles`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(await authHeaders()) },
    body: await req.text(),
  });
  return new NextResponse(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
}
