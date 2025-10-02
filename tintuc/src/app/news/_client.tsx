// app/news/_client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, X, Calendar, User, Tag,
  ChevronLeft, ChevronRight, RefreshCw
} from "lucide-react";
import { getArticlesPaged, type Article } from "@/lib/api";

const LIMIT = 12;

type PagedAny<T> = {
  items?: T[];
  data?: T[];
  meta?: { total?: number };
  total?: number;
  count?: number;
};

export default function NewsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const pageFromUrl = Math.max(1, Number(params.get("page") || 1));
  const qFromUrl = params.get("q") || "";

  const [page, setPage] = React.useState<number>(pageFromUrl);
  const [q, setQ] = React.useState<string>(qFromUrl);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [items, setItems] = React.useState<Article[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // debounce search
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
  function onChangeSearch(v: string) {
    setQ(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      pushUrl(1, v);
    }, 400);
  }

  function pushUrl(nextPage: number, nextQ: string) {
    const s = new URLSearchParams();
    if (nextQ) s.set("q", nextQ);
    if (nextPage > 1) s.set("page", String(nextPage));
    router.push(`/news?${s.toString()}`);
  }

  // Load data
  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // ⚠️ GIỮ CHỮ KÝ HÀM CŨ: (page, limit, q)
        const res = (await getArticlesPaged(
          Number.isFinite(page) ? Number(page) : 1,
          LIMIT,
          q?.trim() || undefined
        )) as unknown as PagedAny<Article>;

        if (!mounted) return;

        const list =
          (Array.isArray(res.items) && res.items) ||
          (Array.isArray(res.data) && res.data) ||
          [];

        const totalVal =
          Number(res.meta?.total ?? res.total ?? res.count ?? list.length) || 0;

        setItems(list as Article[]);
        setTotal(totalVal);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Không tải được dữ liệu");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [page, q]);

  // Sync khi user đổi URL
  React.useEffect(() => {
    setPage(pageFromUrl);
    setQ(qFromUrl);
  }, [pageFromUrl, qFromUrl]);

  function goPage(next: number) {
    const p = Math.min(Math.max(1, next), totalPages);
    setPage(p);
    pushUrl(p, q);
  }

  return (
    <div className="w-full">
   {/* Header LIGHT để nhìn sáng mắt hơn */}
{/* Header ORANGE */}
<div className="w-full bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400">
  <div className="px-4 py-10 pt-[145px] mx-auto text-white max-w-7xl lg:px-6">
    <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
      Tin tức • Marketing • Quảng cáo
    </h1>
    <p className="mt-1 text-sm md:text-base text-orange-50">
      Cập nhật kiến thức, xu hướng & case study truyền thông.
    </p>

    <div className="mt-6">
      <div className="relative">
        <Search className="absolute text-orange-500 -translate-y-1/2 left-3 top-1/2 size-5" />
        <input
          value={q}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Tìm bài viết, chủ đề, tác giả…"
          className="w-full h-12 pr-12 transition bg-white outline-none pl-11 rounded-xl text-zinc-900 placeholder-zinc-500 ring-1 ring-orange-300 focus:ring-2 focus:ring-orange-500"
        />
        {q ? (
          <button
            onClick={() => onChangeSearch("")}
            className="absolute p-2 -translate-y-1/2 rounded-lg right-2 top-1/2 hover:bg-orange-100"
            aria-label="Xóa tìm kiếm"
          >
            <X className="text-orange-500 size-5" />
          </button>
        ) : null}
      </div>
      <div className="w-full h-px mt-3 bg-orange-200/70" />
    </div>
  </div>
</div>

      {/* Content */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="inline-block w-1 h-4 rounded-full bg-amber-400" />
              <span>
                Tổng cộng <b className="text-zinc-900">{total}</b> bài
              </span>
            </div>
            <button
              onClick={() => goPage(1)}
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
              disabled={loading}
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
          </div>

          <div className="w-full h-px bg-zinc-200" />

          <div className="py-6">
            {error ? (
              <ErrorBox message={error} onRetry={() => goPage(page)} />
            ) : loading ? (
              <SkeletonGrid />
            ) : items.length === 0 ? (
              <EmptyState query={q} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a, i) => (
                  <ArticleCard key={(a as any).slug || i} a={a} />
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-zinc-200" />

          {/* Pagination */}
          <div className="flex items-center justify-between py-6">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg border-zinc-200 hover:bg-zinc-50 disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-600">Trang</span>
              <b className="px-2 py-1 rounded-md bg-zinc-100">{page}</b>
              <span className="text-zinc-600">/ {totalPages}</span>
            </div>

            <button
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg border-zinc-200 hover:bg-zinc-50 disabled:opacity-50"
            >
              Trang sau
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Sub components ---------- */

function ArticleCard({ a }: { a: Article }) {
  const anyA = a as any;

  const href = `/news/${anyA.slug || anyA.id || ""}`;
  const cover =
    anyA.coverImage || anyA.image || anyA.cover || anyA.thumbnail || "/placeholder-1280x720.png";
  const author = anyA.author || anyA.authorName || anyA.createdBy || "Ẩn danh";
  const category = anyA.category || anyA.categoryName || (Array.isArray(anyA.tags) ? anyA.tags[0] : undefined);
  const published = anyA.publishedAt || anyA.createdAt || anyA.updatedAt;

  return (
    <Link
      href={href}
      className="block overflow-hidden transition-shadow bg-white group rounded-2xl hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={anyA.title || "cover"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="px-4 pt-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-4" />
            {formatDate(published)}
          </span>
          {author ? (
            <span className="inline-flex items-center gap-1">
              <User className="size-4" />
              {author}
            </span>
          ) : null}
          {category ? (
            <span className="inline-flex items-center gap-1">
              <Tag className="size-4" />
              {category}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-tight group-hover:underline">
          {anyA.title}
        </h3>
        {anyA.excerpt ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600">{anyA.excerpt}</p>
        ) : null}
      </div>

      <div className="w-full h-px mt-4 bg-zinc-200" />
      <div className="px-4 py-3 text-sm font-medium text-amber-600">Đọc bài →</div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="overflow-hidden bg-white animate-pulse rounded-2xl">
          <div className="aspect-[16/9] bg-zinc-200/70" />
          <div className="p-4">
            <div className="h-3 rounded w-28 bg-zinc-200" />
            <div className="w-3/4 h-4 mt-2 rounded bg-zinc-200" />
            <div className="w-full h-3 mt-2 rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-4 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
      <p className="font-semibold">Lỗi tải dữ liệu</p>
      <p className="mt-1 break-all">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-3 py-2 mt-3 border border-red-300 rounded-lg hover:bg-red-100"
      >
        <RefreshCw className="size-4" />
        Thử lại
      </button>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="p-8 text-center bg-white border rounded-xl border-zinc-200">
      <p className="text-lg font-semibold">Chưa có bài phù hợp</p>
      <p className="mt-1 text-zinc-600">
        {query ? <>Không tìm thấy kết quả cho <b>{query}</b>.</> : "Hãy quay lại sau khi có bài viết mới."}
      </p>
    </div>
  );
}

function formatDate(d?: string | Date | null) {
  if (!d) return "Chưa rõ";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "Chưa rõ";
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
