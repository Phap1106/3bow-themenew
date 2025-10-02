const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function http(path: string, init?: RequestInit) {
  const r = await fetch(`${API}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (r.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?expired=1"; // đá ra đăng nhập
    throw new Error("Unauthorized");
  }
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}
