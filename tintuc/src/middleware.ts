// // middleware.ts
// import { NextResponse, type NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname, search } = req.nextUrl;
//   // chỉ chạy cho /admin và /login
//   if (!pathname.startsWith("/admin") && pathname !== "/login") {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("access_token")?.value;

//   // bảo vệ /admin
//   if (pathname.startsWith("/admin") && !token) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     url.searchParams.set("next", pathname + (search || ""));
//     return NextResponse.redirect(url);
//   }

//   // đã login thì khỏi vào /login
//   if (pathname === "/login" && token) {
//     const url = req.nextUrl.clone();
//     url.pathname = "/admin";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/login"], // tránh chạy trên _next, assets, API
// };


import { NextRequest, NextResponse } from "next/server";

function decodeJwt(token?: string): any {
  if (!token) return null;
  const p = token.split(".")[1];
  if (!p) return null;
  // base64url -> JSON
  const json = Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  try { return JSON.parse(json); } catch { return null; }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;
  const role = decodeJwt(token)?.role as "ADMIN" | "SUPPORT_ADMIN" | undefined;

  const isAdmin = pathname.startsWith("/admin");
  const isSupport = pathname.startsWith("/supportAdmin");
  const isLogin = pathname === "/login";

  // chưa login => về /login
  if ((isAdmin || isSupport) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${pathname}${search || ""}`;
    return NextResponse.redirect(url);
  }

  // login rồi vào đúng trang theo role
  if (isLogin && token && role) {
    const url = req.nextUrl.clone();
    url.pathname = role === "ADMIN" ? "/admin" : "/supportAdmin";
    return NextResponse.redirect(url);
  }

  // RBAC: /admin chỉ ADMIN
  if (isAdmin && role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/supportAdmin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/supportAdmin/:path*", "/login"] };
