import { NextResponse } from "next/server";
import { authHeaders } from "@/lib/server/auth";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/articles/${params.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...(await authHeaders()) },
    body: await req.text(),
  });
  return new NextResponse(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/articles/${params.id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  return new NextResponse(await res.text(), { status: res.status, headers: { "content-type": "application/json" } });
}
