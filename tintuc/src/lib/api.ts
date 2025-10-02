// // lib/api.ts
// import type { News } from "@/lib/newsApi";

// /** Trả về News[] để NewsClient dùng y hệt UI cũ */
// export async function getArticles(): Promise<News[]> {
//   const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
//   const r = await fetch(`${BASE}/articles`, { cache: "no-store" });
//   if (!r.ok) throw new Error("Failed to fetch articles");
//   const data = await r.json(); // { items, page, ... }
//   return data.items as News[];
// }










// import type { Article } from "@/types/article";

// const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

// async function req<T>(path: string, init?: RequestInit): Promise<T> {
//   const r = await fetch(API + path, { cache: "no-store", ...init });
//   if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
//   return r.json();
// }

// /** Đúng thứ tự tham số: (page, limit, q) */
// export function getArticlesPaged(
//   page: number = 1,
//   limit: number = 12,
//   q: string = ""
// ): Promise<{ items: Article[]; total: number; page: number; limit: number }> {
//   return req(
//     `/articles?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
//   );
// }










// src/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string | null;
  publishedAt?: string | null;
};

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

type AnyPaged<T> =
  | { items: T[]; total?: number; page?: number; limit?: number }
  | { items: T[]; meta: { total: number; page: number; limit: number } };

function normalizePaged<T>(
  data: AnyPaged<T>,
  fallbackPage: number,
  fallbackLimit: number
): Paged<T> {
  const items = (data as any).items ?? [];
  const meta = (data as any).meta ?? {};
  const total = Number((data as any).total ?? meta.total ?? (data as any).count ?? 0);
  const page = Number((data as any).page ?? meta.page ?? fallbackPage);
  const limit = Number((data as any).limit ?? meta.limit ?? fallbackLimit);
  return {
    items,
    total: Number.isFinite(total) ? total : 0,
    page: Number.isFinite(page) ? page : fallbackPage,
    limit: Number.isFinite(limit) ? limit : fallbackLimit,
  };
}

export async function getArticlesPaged(
  page = 1,
  limit = 12,
  q = ""
): Promise<Paged<Article>> {
  const url = `${API}/articles?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();
  return normalizePaged<Article>(data, page, limit);
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const r = await fetch(`${API}/articles/${slug}`, { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// (tuỳ chọn) để tương thích chỗ cũ còn dùng News
export type News = Article;
