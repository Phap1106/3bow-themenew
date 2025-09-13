// import { NextResponse } from "next/server";
// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// const get = (o:any,p:string)=>p.split(".").reduce((a,k)=>a?.[k],o);
// function normRole(r:any){
//   const s = String(r ?? "").toLowerCase();
//   if (["admin","administrator","role_admin","1"].includes(s)) return "admin";
//   if (["supportadmin","support","role_support","2"].includes(s)) return "supportAdmin";
//   return s || "user";
// }
// function parseTokenFromSetCookie(setCookie: string[] | null): string | null {
//   if (!setCookie?.length) return null;
//   const keys = ["session","access_token","authorization","auth","Authentication","token","jwt"];
//   for (const one of setCookie) for (const k of keys) {
//     const m = new RegExp(`${k}=([^;]+)`,"i").exec(one);
//     if (m) return m[1];
//   }
//   return null;
// }

// export async function POST(req: Request) {
//   const upstream = await fetch(`${API}/auth/login`, {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: await req.text(),
//   });

//   const text = await upstream.text();
//   let data:any = {}; try { data = JSON.parse(text) } catch {}

//   if (!upstream.ok) {
//     return NextResponse.json({ error: data?.message || text || "Login failed" }, { status: upstream.status });
//   }

//   let token =
//     get(data,"access_token") || get(data,"token") || get(data,"accessToken") || get(data,"jwt") ||
//     get(data,"data.access_token") || get(data,"data.token");

//   // từ Set-Cookie
//   if (!token) {
//     const arr = (upstream.headers as any).getSetCookie?.() as string[] | undefined;
//     token = parseTokenFromSetCookie(arr ?? null) ?? undefined;
//   }
//   if (!token) return NextResponse.json({ error: "Token missing from backend", backend: data || text }, { status: 500 });

//   const role = normRole(get(data,"user.role") || data?.role || get(data,"data.user.role"));

//   const res = NextResponse.json({ ok: true, role });
//   res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*7 });
//   res.cookies.set("role", role, { sameSite: "lax", path: "/", maxAge: 60*60*24*7 });
//   return res;
// }


import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL!; // ví dụ http://localhost:4000/api

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  // Backend trả { access_token, user:{id,email,role} }
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const r = NextResponse.json(data, { status: 200 });
  // cookie trên domain :3000 để proxy đọc được
  r.cookies.set("session", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  r.cookies.set("role", data.user?.role ?? "user", {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return r;
}
