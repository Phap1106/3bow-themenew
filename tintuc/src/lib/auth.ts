// import { cookies } from "next/headers";

// export async function authHeaders(): Promise<Record<string, string>> {
//   const token = (await cookies()).get("session")?.value;
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }



// src/lib/auth.ts
"use server";
import "server-only";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type Me = {
  id: string;
  email: string;
  role: "ADMIN" | "SUPPORT_ADMIN";
  firstName?: string;
  lastName?: string;
};

export async function getMe(): Promise<Me | null> {
  // Next 15: cookies() trả Promise<ReadonlyRequestCookies>
  const store = await cookies();
  const token = store.get("access_token")?.value;
  if (!token) return null;

  const r = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) return null;
  return r.json();
}
