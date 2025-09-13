


// app/news/_client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { getArticlesPaged, type Article } from "@/lib/api";
import { Search, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT = 6; // lưới 3x2
const FALLBACK_IMG =
  "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

// danh sách trang gọn + chống NaN
function buildPageList(curr: number, max: number) {
  const M = Number.isFinite(max) && max > 0 ? Math.floor(max) : 1;
  const C = Math.min(Math.max(1, curr || 1), M);
  const out: (number | string)[] = [];
  const add = (a: number, b: number) => {
    for (let i = a; i <= b; i++) out.push(i);
  };
  if (M <= 7) add(1, M);
  else if (C <= 4) {
    add(1, 5);
    out.push("…", M);
  } else if (C >= M - 3) {
    out.push(1, "…");
    add(M - 4, M);
  } else {
    out.push(1, "…", C - 1, C, C + 1, "…", M);
  }
  return out;
}

export default function NewsClient() {
  const [items, setItems] = React.useState<Article[]>([]);
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const pages = React.useMemo(() => {
    const t = Number.isFinite(total) ? total : 0;
    const n = Math.ceil(t / LIMIT);
    return n >= 1 ? n : 1;
  }, [total]);

  async function load(p = 1, keyword = "") {
    try {
      setLoading(true);
      setErr(null);
      const r = await getArticlesPaged(p, LIMIT, keyword);
      const items = (r as any).items ?? [];
      const totalRaw =
        (r as any).total ?? (r as any).count ?? (r as any).meta?.total ?? 0;

      setItems(items);
      setTotal(Number.isFinite(totalRaw) ? Number(totalRaw) : 0);
      setPage(p);
    } catch (e: any) {
      setErr(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load(1, "");
  }, []);

  const pageList = React.useMemo(
    () => buildPageList(page, pages),
    [page, pages]
  );

  return (
    <main className="px-4 py-10 container-max">
      <h1 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl">
        Tin tức <span className="text-violet-600">3BOW</span>
      </h1>

      {/* Search */}
      <form
        className="flex items-center w-full max-w-2xl gap-2 mx-auto mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          load(1, q.trim());
        }}
      >
       <div className="relative w-full">
  <Search className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none left-4 top-1/2 text-zinc-400" />
  <input
    className="w-full pl-12 pr-3 text-sm transition bg-white border rounded-lg outline-none h-11 border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    placeholder="Tìm tiêu đề, nội dung, tác giả..."
    value={q}
    onChange={(e) => setQ(e.target.value)}
  />
</div>

        <button
          type="submit"
          className="btn btn-primary btn-raise h-11"
          disabled={loading}
        >
          Tìm
        </button>
      </form>

      {/* States */}
      {err && (
        <p className="max-w-2xl px-3 py-2 mx-auto mt-4 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
          {err}
        </p>
      )}
      {loading && (
        <p className="mt-6 text-sm text-center text-zinc-500">Đang tải…</p>
      )}

      {/* Grid */}
      {!loading && items.length === 0 && (
        <p className="mt-6 text-sm text-center text-zinc-500">
          Không có bài viết.
        </p>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="grid gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="overflow-hidden transition bg-white group rounded-2xl ring-1 ring-zinc-200 hover:shadow-sm"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={a.image || FALLBACK_IMG}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-semibold line-clamp-2">{a.title}</h2>
                  {a.excerpt && (
                    <p className="mt-1 text-sm line-clamp-3 text-zinc-600">
                      {a.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                    <span className="inline-flex items-center min-w-0 gap-1 truncate">
                      <User className="h-3.5 w-3.5" />
                      <span className="truncate">{a.author || "—"}</span>
                    </span>
                    <time
                      className="inline-flex items-center gap-1"
                      dateTime={a.publishedAt || undefined}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(a.publishedAt)}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <>
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  className="px-3 btn btn-secondary h-9 disabled:opacity-50"
                  disabled={page <= 1 || loading}
                  onClick={() => load(page - 1, q)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </button>

                {pageList.map((p, i) =>
                  typeof p === "number" ? (
                    <button
                      key={i}
                      className={`h-9 rounded-lg px-3 ring-1 ring-zinc-200 ${
                        p === page
                          ? "bg-[#1677ff] text-white"
                          : "bg-white hover:bg-zinc-50"
                      }`}
                      disabled={loading}
                      onClick={() => load(p, q)}
                    >
                      {String(p)}
                    </button>
                  ) : (
                    <span key={i} className="px-2 text-zinc-500">
                      {p}
                    </span>
                  )
                )}

                <button
                  className="px-3 btn btn-secondary h-9 disabled:opacity-50"
                  disabled={page >= pages || loading}
                  onClick={() => load(page + 1, q)}
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <p className="mt-2 text-xs text-center text-zinc-500">
                Trang {page}/{pages} • {total} bài
              </p>
            </>
          )}
        </>
      )}
    </main>
  );
}
