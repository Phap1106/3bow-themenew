
// // src/lib/adminApi.ts
// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
// import type { Post, PostInput, Paginated } from "@/types/article";

// /** ===== Helpers ===== */
// function normalizeList<T>(data: any, fallback: { page: number; limit: number }): Paginated<T> {
//   const meta = data?.meta ?? {};
//   const items = (data?.items ?? data?.data ?? []) as T[];

//   const total = Number(meta.total ?? data?.total ?? meta.count ?? data?.count ?? 0);
//   const page = Number(meta.page ?? data?.page ?? fallback.page ?? 1);
//   const limit = Number(meta.limit ?? data?.limit ?? fallback.limit ?? 10);

//   return { items, total: Number.isFinite(total) ? total : 0, page, limit };
// }

// async function req(path: string, init?: RequestInit) {
//   const url = path.startsWith("http") ? path : `${API}${path}`;
//   const r = await fetch(url, {
//     credentials: "include",
//     cache: "no-store",
//     ...init,
//   });
//   if (r.status === 401 && typeof window !== "undefined") {
//     // token hết hạn / bị revoke -> đá ra login
//     window.location.href = "/login?expired=1";
//     throw new Error("Unauthorized");
//   }
//   if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);

//   const ct = r.headers.get("content-type") || "";
//   return ct.includes("application/json") ? r.json() : r.text();
// }

// /** ===== Expose generic callers (giữ tên để nơi khác dùng) ===== */
// export const apiGet = (path: string) => req(path);
// export const apiPost = (path: string, data?: any) =>
//   req(path, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: data ? JSON.stringify(data) : undefined,
//   });
// export const apiPatch = (path: string, data?: any) =>
//   req(path, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: data ? JSON.stringify(data) : undefined,
//   });
// export const apiDelete = (path: string) =>
//   req(path, { method: "DELETE" });

// /** ===== Articles APIs (giữ nguyên tên hàm cũ) ===== */
// export async function listArticles(page = 1, limit = 10, q = ""): Promise<Paginated<Post>> {
//   const data = await apiGet(
//     `/articles?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`
//   );
//   return normalizeList<Post>(data, { page, limit });
// }

// export async function createArticle(data: PostInput): Promise<Post> {
//   return apiPost(`/articles`, data);
// }

// export async function updateArticle(id: string, data: PostInput): Promise<Post> {
//   return apiPatch(`/articles/${id}`, data);
// }

// export async function deleteArticle(id: string): Promise<{ ok: boolean }> {
//   return apiDelete(`/articles/${id}`);
// }

// /** (tuỳ chọn) Logout dùng lại ở nơi khác nếu cần */
// export async function logout() {
//   try { await apiPost(`/auth/logout`, {}); } catch {}
//   if (typeof window !== "undefined") {
//     try { localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); } catch {}
//     window.location.href = "/login";
//   }
// }




// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
// import type { Post, PostInput, Paginated } from "@/types/article";
// import { slugifyVN } from "@/utils/slug";

// const FALLBACK_IMG = "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

// function normalizeList<T>(data: any, fallback: { page: number; limit: number }): Paginated<T> {
//   const meta = data?.meta ?? {};
//   const items = (data?.items ?? data?.data ?? []) as T[];
//   const total = Number(meta.total ?? data?.total ?? meta.count ?? data?.count ?? 0);
//   const page = Number(meta.page ?? data?.page ?? fallback.page ?? 1);
//   const limit = Number(meta.limit ?? data?.limit ?? fallback.limit ?? 10);
//   return { items, total: Number.isFinite(total) ? total : 0, page, limit };
// }

// async function req(path: string, init?: RequestInit) {
//   const r = await fetch(`${API}${path}`, {
//     credentials: "include",
//     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
//     ...init,
//   });
//   if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
//   return r.json();
// }

// export async function listArticles(page = 1, limit = 20, q = ""): Promise<Paginated<Post>> {
//   const data = await req(`/articles?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`);
//   return normalizeList<Post>(data, { page, limit });
// }

// export async function createArticle(input: PostInput) {
//   const now = new Date().toISOString();
//   const payload: PostInput = {
//     ...input,
//     title: input.title?.trim(),
//     slug: (input.slug?.trim() || slugifyVN(input.title))!,
//     image: input.image?.trim() || FALLBACK_IMG,
//     author: input.author?.trim() || "3BOW AI",
//     publishedAt: input.publishedAt ?? now,       // <-- auto set NOW
//   };
//   return req(`/articles`, { method: "POST", body: JSON.stringify(payload) });
// }

// export async function updateArticle(id: string, input: Partial<PostInput>) {
//   const payload = { ...input };
//   return req(`/articles/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
// }

// export async function deleteArticle(id: string) {
//   return req(`/articles/${id}`, { method: "DELETE" });
// }










// src/lib/adminApi.ts  (dùng fetch, không cần axios)
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type ReqInit = RequestInit & { baseUrl?: string };

async function request<T>(path: string, init: ReqInit = {}) {
  const url = `${init.baseUrl ?? API}${path}`;
  const headers: Record<string, string> = { ...(init.headers as any) };
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!isForm && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const res = await fetch(url, { ...init, headers, credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGet = <T = any>(u: string, i?: Omit<ReqInit, "method">) =>
  request<T>(u, { ...i, method: "GET" });
export const apiPost = <T = any>(u: string, d?: any, i?: Omit<ReqInit, "method" | "body">) =>
  request<T>(u, { ...i, method: "POST", body: d instanceof FormData ? d : d != null ? JSON.stringify(d) : undefined });
export const apiPut =  <T = any>(u: string, d?: any, i?: Omit<ReqInit, "method" | "body">) =>
  request<T>(u, { ...i, method: "PUT",  body: d instanceof FormData ? d : d != null ? JSON.stringify(d) : undefined });
export const apiDelete = <T = any>(u: string, i?: Omit<ReqInit, "method">) =>
  request<T>(u, { ...i, method: "DELETE" });

/* ====== API cụ thể dùng trong Admin ====== */
export const getMe = () => apiGet<{ id: string; role: string; email: string }>("/auth/me");
export const logout = () => apiPost("/auth/logout", {});

export const listArticles = (p: { page?: number; limit?: number; q?: string } = {}) => {
  const search = new URLSearchParams();
  if (p.page) search.set("page", String(p.page));
  if (p.limit) search.set("limit", String(p.limit));
  if (p.q) search.set("q", p.q);
  return apiGet<{ items: any[]; total: number }>(`/articles?${search.toString()}`);
};

export const createArticle = (data: any) => apiPost("/articles", data);
export const updateArticle = (id: string, data: any) => apiPut(`/articles/${id}`, data);
export const deleteArticle = (id: string) => apiDelete(`/articles/${id}`);
export const getArticle   = (id: string) => apiGet(`/articles/${id}`);

// giữ default cho code cũ
export default { apiGet, apiPost, apiPut, apiDelete, getMe, logout, listArticles, createArticle, updateArticle, deleteArticle, getArticle };
