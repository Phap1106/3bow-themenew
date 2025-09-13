// //src/app/api/image/route.ts
// export const runtime = "nodejs";

// type Body = { keywords: string[] | string; seed?: number };

// const FALLBACK_IMG =
//   "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

// async function fromUnsplash(query: string, seed = 0) {
//   const key = process.env.UNSPLASH_ACCESS_KEY;
//   if (!key) return null;
//   const url =
//     "https://api.unsplash.com/search/photos?" +
//     new URLSearchParams({
//       query,
//       per_page: "12",
//       orientation: "landscape",
//       content_filter: "high",
//     });
//   const r = await fetch(url, {
//     headers: { Authorization: `Client-ID ${key}` },
//     cache: "no-store",
//   });
//   if (!r.ok) return null;
//   const data = await r.json();
//   const list: any[] = data?.results || [];
//   if (!list.length) return null;
//   const i = Math.abs(seed) % list.length;
//   const raw = list[i]?.urls?.raw || list[i]?.urls?.regular;
//   return raw ? `${raw}&w=1200&h=630&fit=crop` : null;
// }

// async function fromPexels(query: string, seed = 0) {
//   const key = process.env.PEXELS_API_KEY;
//   if (!key) return null;
//   const url =
//     "https://api.pexels.com/v1/search?" +
//     new URLSearchParams({
//       query,
//       per_page: "12",
//       orientation: "landscape",
//       size: "large",
//     });
//   const r = await fetch(url, {
//     headers: { Authorization: key },
//     cache: "no-store",
//   });
//   if (!r.ok) return null;
//   const data = await r.json();
//   const list: any[] = data?.photos || [];
//   if (!list.length) return null;
//   const i = Math.abs(seed) % list.length;
//   const src =
//     list[i]?.src?.landscape ||
//     list[i]?.src?.large2x ||
//     list[i]?.src?.large;
//   return src || null;
// }

// function fromSourceUnsplash(query: string, seed = Date.now()) {
//   return `https://source.unsplash.com/1200x630/?${encodeURIComponent(
//     query
//   )}&sig=${seed}`;
// }

// export async function POST(req: Request) {
//   try {
//     const { keywords, seed = Date.now() } = (await req.json()) as Body;
//     const query =
//       Array.isArray(keywords)
//         ? keywords.filter(Boolean).join(", ")
//         : String(keywords || "").trim();
//     if (!query) return Response.json({ image: FALLBACK_IMG });

//     const u = (await fromUnsplash(query, seed)) ||
//       (await fromPexels(query, seed)) ||
//       fromSourceUnsplash(query, seed);

//     return Response.json({ image: u || FALLBACK_IMG, query });
//   } catch (e) {
//     return Response.json({ image: FALLBACK_IMG }, { status: 200 });
//   }
// }
































// src/app/api/image/route.ts
export const runtime = "nodejs";

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

type Body = {
  keywords?: string | string[];
  sourceUrl?: string;
  saveLocal?: boolean;
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari";

// hosts/định dạng cần loại bỏ
const BAD_HOSTS = [
  /source\.unsplash\.com/i,
  /images\.unsplash\.com/i,
  /dummyimage\.com/i,
  /placehold/i,
  /picsum\.photos/i,
  /gravatar\.com/i,
];

const IMG_EXT_OK = /\.(jpe?g|png|webp|gif|bmp|jfif)(\?|$)/i;

const isHttp = (u?: string | null) => !!u && /^https?:\/\//i.test(u || "");
const isBadHost = (u: string) => BAD_HOSTS.some((rx) => rx.test(u));

/* ----------------------- utils ----------------------- */
const absUrl = (u: string, base?: string): string => {
  try {
    return new URL(u, base).toString();
  } catch {
    return "";
  }
};

async function fetchText(url: string): Promise<string> {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`fetch ${r.status}`);
  return r.text();
}

function parseSrcset(srcset: string, base?: string): string {
  const items = srcset
    .split(",")
    .map((s) => s.trim())
    .map((s) => {
      const m = s.match(/^(\S+)\s+(\d+)(w|x)?$/) || s.match(/^(\S+)$/);
      if (!m) return null;
      const url = absUrl(m[1], base);
      const w = m[2] ? parseInt(m[2], 10) : 0;
      return { url, w: Number.isFinite(w) ? w : 0 };
    })
    .filter(Boolean) as { url: string; w: number }[];
  if (!items.length) return "";
  items.sort((a, b) => b.w - a.w);
  return items[0].url;
}

async function validateImageUrl(u: string): Promise<string | null> {
  if (!isHttp(u) || isBadHost(u)) return null;
  try {
    // nhiều CDN chặn HEAD -> thử HEAD trước, rớt thì GET 1 byte
    const h = await fetch(u, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" },
    });
    if (h.ok && (h.headers.get("content-type") || "").startsWith("image/"))
      return u;
  } catch {}
  try {
    const g = await fetch(u, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "User-Agent": UA,
        Accept: "image/*,*/*;q=0.8",
        Range: "bytes=0-0",
      },
    });
    if (g.ok && (g.headers.get("content-type") || "").startsWith("image/"))
      return u;
  } catch {}
  return null;
}

/* --------- trích ảnh từ chính trang bài viết --------- */
function pickFromMeta(html: string, base?: string): string {
  const metas = [
    ...html.matchAll(
      /<meta\s[^>]*?(?:property|name)=["']([^"']+)["'][^>]*?content=["']([^"']+)["'][^>]*?>/gi,
    ),
  ].map((m) => [m[1].toLowerCase(), absUrl(m[2].trim(), base)] as const);
  const get = (k: string) => metas.find(([key]) => key === k)?.[1] || "";
  return (
    get("og:image") ||
    get("og:image:secure_url") ||
    get("twitter:image") ||
    get("twitter:image:src") ||
    ""
  );
}
function pickFromLinkTag(html: string, base?: string): string {
  const m = html.match(
    /<link[^>]+rel=["']image_src["'][^>]*href=["']([^"']+)["'][^>]*>/i,
  );
  return m ? absUrl(m[1], base) : "";
}
function pickFromJsonLD(html: string, base?: string): string {
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  for (const s of scripts) {
    try {
      const j = JSON.parse(s[1]);
      const arr = Array.isArray(j) ? j : [j];
      for (const node of arr) {
        const cand =
          typeof node?.image === "string"
            ? node.image
            : Array.isArray(node?.image)
            ? node.image[0]
            : node?.image?.url;
        if (isHttp(cand)) return absUrl(String(cand), base);

        if (Array.isArray(node?.["@graph"])) {
          for (const g of node["@graph"]) {
            const gi =
              typeof g?.image === "string"
                ? g.image
                : Array.isArray(g?.image)
                ? g.image[0]
                : g?.image?.url;
            if (isHttp(gi)) return absUrl(String(gi), base);
          }
        }
      }
    } catch {}
  }
  return "";
}
function pickFromPictureAndImg(html: string, base?: string): string {
  const sources = [
    ...html.matchAll(/<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi),
  ];
  for (const s of sources) {
    const best = parseSrcset(s[1], base);
    if (isHttp(best)) return best;
  }
  const imgs = [...html.matchAll(/<img([^>]+)>/gi)].map((m) => m[1]);
  for (const attrs of imgs) {
    const get = (name: string) => {
      const re = new RegExp(`${name}=["']([^"']+)["']`, "i");
      const m = attrs.match(re);
      return m ? absUrl(m[1], base) : "";
    };
    const srcset = get("srcset");
    if (srcset) {
      const best = parseSrcset(srcset, base);
      if (isHttp(best)) return best;
    }
    const cand =
      get("src") || get("data-src") || get("data-original") || get("data-lazy");
    if (isHttp(cand)) return cand;
  }
  return "";
}

async function extractImageFromSource(sourceUrl: string): Promise<string | null> {
  const base = sourceUrl;
  const html = await fetchText(sourceUrl);
  const ordered = [
    pickFromMeta(html, base),
    pickFromLinkTag(html, base),
    pickFromJsonLD(html, base),
    pickFromPictureAndImg(html, base),
  ].filter(Boolean) as string[];

  for (const u of ordered) {
    if (isBadHost(u)) continue;
    // bắt buộc đúng định dạng hoặc content-type ảnh
    if (IMG_EXT_OK.test(u)) {
      const ok = await validateImageUrl(u);
      if (ok) return ok;
    } else {
      const ok = await validateImageUrl(u);
      if (ok) return ok;
    }
  }
  return null;
}

/* ----------------- search web lấy ảnh ----------------- */
// Bing Images: lấy nhiều murl
async function fromBingImagesMany(q: string): Promise<string[]> {
  const url =
    "https://www.bing.com/images/search?q=" +
    encodeURIComponent(q) +
    "&form=HDRSC2";
  const html = await fetchText(url);
  const raws = [
    ...html.matchAll(/"murl":"(https?:\\\/\\\/[^"]+)"/g),
  ].map((m) => m[1].replace(/\\\//g, "/"));
  const uniq = Array.from(new Set(raws));
  return uniq.filter((u) => isHttp(u) && !isBadHost(u));
}

// Bing Web: lấy nhiều link bài báo
async function fromBingWebPages(q: string): Promise<string[]> {
  const url = "https://www.bing.com/search?q=" + encodeURIComponent(q);
  const html = await fetchText(url);
  const links = [
    ...html.matchAll(/<h2[^>]*><a[^>]*href="(https?:\/\/[^"]+)"/gi),
    ...html.matchAll(/<li class="b_algo"[\s\S]*?<a href="(https?:\/\/[^"]+)"/gi),
  ].map((m) => m[1]);
  return Array.from(new Set(links)).filter((u) => isHttp(u));
}

/* ---------------------- lưu local ---------------------- */
async function downloadToPublic(url: string): Promise<string> {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`img ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const ct = r.headers.get("content-type") || "";
  let ext = ".jpg";
  if (ct.includes("png")) ext = ".png";
  else if (ct.includes("webp")) ext = ".webp";
  else if (ct.includes("gif")) ext = ".gif";
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const name = crypto.randomBytes(16).toString("hex") + ext;
  await fs.writeFile(path.join(uploadsDir, name), buf);
  return `/uploads/${name}`;
}

/* ----------------------- ROUTE ----------------------- */
export async function POST(req: Request): Promise<Response> {
  try {
    const { keywords, sourceUrl, saveLocal = false } =
      (await req.json()) as Body;

    // 1) Có link bài gốc -> ưu tiên
    if (sourceUrl) {
      try {
        const found = await extractImageFromSource(sourceUrl);
        if (found) {
          const finalUrl = saveLocal ? await downloadToPublic(found) : found;
          return Response.json({ image: finalUrl, via: "source", page: sourceUrl });
        }
      } catch (e) {
        console.warn("[image] extract fail:", (e as any)?.message || e);
      }
    }

    // 2) Theo từ khoá: chỉ lấy ảnh thật (tin tức), không dùng ảnh stock
    const query =
      Array.isArray(keywords)
        ? keywords.filter(Boolean).join(", ")
        : String(keywords || "").trim();

    if (query) {
      // tăng độ chính xác: ưu tiên cụm tìm kiếm tin tức
      const queries = [
        query,
        `${query} bài báo`,
        `${query} tin tức`,
        `${query} site:vnexpress.net OR site:tuoitre.vn OR site:thanhnien.vn OR site:zingnews.vn OR site:dantri.com.vn`,
      ];

      // 2.a) Ảnh trực tiếp từ Bing Images
      for (const q of queries) {
        try {
          const candidates = await fromBingImagesMany(q);
          for (const u of candidates) {
            // nếu ko có đuôi mở rộng vẫn thử vì nhiều CDN ẩn đuôi
            const ok = await validateImageUrl(u);
            if (ok) {
              const finalUrl = saveLocal ? await downloadToPublic(ok) : ok;
              return Response.json({ image: finalUrl, via: "bing_images", q });
            }
          }
        } catch {}
      }

      // 2.b) Lấy trang bài báo -> trích og:image
      for (const q of queries) {
        try {
          const pages = await fromBingWebPages(q);
          for (const p of pages.slice(0, 6)) {
            const img = await extractImageFromSource(p);
            if (img) {
              const finalUrl = saveLocal ? await downloadToPublic(img) : img;
              return Response.json({ image: finalUrl, via: "bing_web", page: p, q });
            }
          }
        } catch {}
      }
    }

    // 3) Không tìm được -> trả rỗng, KHÔNG có ảnh mặc định
    return Response.json({ image: "", via: "none" });
  } catch (e) {
    console.error("[/api/image] error:", e);
    return Response.json({ image: "", via: "error" }, { status: 200 });
  }
}
