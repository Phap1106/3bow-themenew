// // // lib/newsApi.ts
// // export type News = {
// //   id: string;
// //   slug: string;
// //   title: string;
// //   excerpt: string;
// //   content: string;
// //   author: string;
// //   publishedAt: string; // ISO
// //   image: string;
// // };

// // const BASE = process.env.NEXT_PUBLIC_API_URL!;
// // export const getArticleBySlug = getArticle;
// // export async function getArticles(q?: string, page = 1, limit = 12) {
// //   const url = new URL(`${BASE}/articles`);
// //   if (q) url.searchParams.set("q", q);
// //   url.searchParams.set("page", String(page));
// //   url.searchParams.set("limit", String(limit));
// //   const r = await fetch(url.toString(), { next: { revalidate: 30 } }); // SSG + ISR 30s
// //   if (!r.ok) throw new Error("Failed to fetch articles");
// //   return (await r.json()) as { items: News[]; page: number; limit: number; total: number };
// // }

// // export async function getArticle(slug: string) {
// //   const r = await fetch(`${BASE}/articles/${slug}`, { next: { revalidate: 60 } });
// //   if (!r.ok) throw new Error("Article not found");
// //   return (await r.json()) as News;
// // }


// const API = process.env.NEXT_PUBLIC_API_URL!; // http://localhost:4000/api

// export type Article = {
//   id: string;
//   title: string;
//   slug: string;
//   author: string;
//   excerpt?: string;
//   image?: string;
//   publishedAt?: string | null;
// };

// export async function getArticles(q = "", page = 1, limit = 10): Promise<{ items: Article[]; total: number }> {
//   const res = await fetch(`${API}/articles?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`, {
//     cache: "no-store",
//   });
//   if (!res.ok) throw new Error("Failed to fetch articles");
//   return res.json();
// }

// export async function getArticle(id: string): Promise<Article> {
//   const res = await fetch(`${API}/articles/${id}`, { cache: "no-store" });
//   if (!res.ok) throw new Error("Article not found");
//   return res.json();
// }



// src/lib/newsApi.ts
// const API = process.env.NEXT_PUBLIC_API_URL!; // ví dụ: http://localhost:4000/api
// export type { Article as News } from "@/types/article";

// export type Article = {
//   id: string;
//   title: string;
//   slug: string;
//   author: string;
//   excerpt?: string;
//   image?: string;
//   publishedAt?: string | null;
// };

// // List + phân trang
// export async function getArticles(
//   q = "",
//   page = 1,
//   limit = 10
// ): Promise<{ items: Article[]; total: number }> {
//   const res = await fetch(
//     `${API}/articles?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
//     { cache: "no-store" }
//   );
//   if (!res.ok) throw new Error(`Failed to fetch articles (${res.status})`);
//   return res.json();
// }

// // Lấy chi tiết theo slug (backend của bạn đã map /api/articles/:slug)
// export async function getArticleBySlug(slug: string): Promise<Article> {
//   const res = await fetch(`${API}/articles/${encodeURIComponent(slug)}`, {
//     cache: "no-store",
//   });
//   if (!res.ok) throw new Error(`Article not found (${res.status})`);
//   return res.json();
// }









// src/lib/newsApi.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  author?: string | null;
  publishedAt?: string | null;
};

export async function getArticles(
  q?: string,
  page = 1,
  limit = 10
): Promise<{ items: Article[]; total: number }> {
  const url = new URL(`${API}/articles`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load articles");
  return r.json();
}

// Chi tiết bài viết theo slug (thử /articles/slug/:slug, fallback /articles/:slug)
export async function getArticleBySlug(slug: string): Promise<Article> {
  let r = await fetch(`${API}/articles/slug/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!r.ok) {
    r = await fetch(`${API}/articles/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
  }
  if (!r.ok) throw new Error("Article not found");
  return r.json();
}
