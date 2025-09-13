


// src/app/supportAdmin/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import PostForm from "@/components/admin/PostForm";
import { listArticles, createArticle, updateArticle } from "@/lib/adminApi";
import LogoutButton from "@/components/common/LogoutButton";
import type { Post, PostInput } from "@/types/article";

type Role = "ADMIN" | "SUPPORT_ADMIN";
const DEFAULT_LIMIT = 10;
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function statusOf(p: Post) {
  if (!p.publishedAt)
    return {
      text: "Nháp",
      cls: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200",
    };
  const pub = new Date(p.publishedAt).getTime();
  if (pub > Date.now())
    return {
      text: "Lên lịch",
      cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };
  return {
    text: "Đã đăng",
    cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  };
}

export default function SupportAdminPage() {
  const router = useRouter();

  // === Auth ===
  const [role, setRole] = React.useState<Role | null>(null);
  const [me, setMe] = React.useState<{ id: string; email: string; role: Role } | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
        if (!r.ok) throw new Error("unauth");
        const _me = await r.json(); // { id, email, role }
        if (_me.role !== "ADMIN" && _me.role !== "SUPPORT_ADMIN") {
          router.replace("/login?next=/supportAdmin");
          return;
        }
        if (mounted) {
          setRole(_me.role);
          setMe(_me);
        }
      } catch {
        router.replace("/login?next=/supportAdmin");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  // === Posts state ===
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<Post[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [showView, setShowView] = React.useState(false);
  const [viewing, setViewing] = React.useState<Post | null>(null);

  async function loadPosts(p = 1, keyword = "") {
    setLoading(true);
    setError(null);
    try {
      // ✅ ĐÚNG THỨ TỰ: (page, limit, q) — và đọc meta trả về
      const r = await listArticles(p, DEFAULT_LIMIT, keyword);
      setItems(r.items);
      setTotal(r.total);
      setPage(r.page);
      setLimit(r.limit ?? DEFAULT_LIMIT);
    } catch (e: any) {
      setError(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    loadPosts(1, "");
  }, []);

  // === actions ===
  function onCreate() {
    setEditing(null);
    setShowForm(true);
  }
  function onEdit(p: Post) {
    setEditing(p);
    setShowForm(true);
  }
  function onView(p: Post) {
    setViewing(p);
    setShowView(true);
  }

  async function handleSubmit(input: PostInput) {
    try {
      setLoading(true);
      // Nếu support admin không nhập author thì gán email của mình
      const payload: PostInput = {
        ...input,
        author: input.author?.trim() || me?.email || "support-admin",
      };
      if (editing) await updateArticle(editing.id, payload);
      else await createArticle(payload);
      setShowForm(false);
      setEditing(null);
      await loadPosts(page, q);
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  // === Pagination util ===
  const pages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const pageList = (curr: number, max: number) => {
    const out: (number | string)[] = [];
    const add = (a: number, b: number) => {
      for (let i = a; i <= b; i++) out.push(i);
    };
    if (max <= 7) add(1, max);
    else if (curr <= 4) {
      add(1, 5);
      out.push("…", max);
    } else if (curr >= max - 3) {
      out.push(1, "…");
      add(max - 4, max);
    } else {
      out.push(1, "…", curr - 1, curr, curr + 1, "…", max);
    }
    return out;
  };

  if (authLoading) return <div className="p-8 text-sm text-center text-zinc-500">Đang xác thực…</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/70 backdrop-blur">
        <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
          <h1 className="text-xl font-semibold">Support Admin — Quản lý bài viết</h1>
          <div className="text-sm text-zinc-500">{me?.email}</div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-6xl px-4 py-6 mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative w-full max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tiêu đề / slug / tác giả…"
              className="w-full h-10 pl-10 pr-3 bg-white border rounded-xl dark:bg-zinc-900 dark:border-zinc-800"
            />
            <Search className="absolute -translate-y-1/2 text-zinc-400 left-3 top-1/2" size={18} />
          </div>
          <button className="h-10 px-4 border rounded-xl" onClick={() => loadPosts(1, q.trim())} disabled={loading}>
            Tìm
          </button>
          <button className="h-10 px-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700" onClick={onCreate}>
            + Thêm bài viết
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
          {error && <div className="p-4 text-sm text-red-600">{error}</div>}
          {loading && <div className="p-4 text-sm text-zinc-500">Đang tải…</div>}
          {!loading && (
            <table className="min-w-full text-sm">
              <thead className="text-left border-b text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 w-[36%]">Bài viết</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Tác giả</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Publish</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const st = statusOf(p);
                  return (
                    <tr
                      key={p.id}
                      className="border-b last:border-b-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            {p.image && <img src={p.image} alt="" className="object-cover w-full h-full" />}
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{p.title}</div>
                            <div className="text-zinc-500 line-clamp-1">{p.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{p.slug}</td>
                      <td className="px-4 py-3">{p.author}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${st.cls}`}>{st.text}</span>
                      </td>
                      <td className="px-4 py-3">{p.publishedAt ? new Date(p.publishedAt).toLocaleString() : "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onView(p)}
                            className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                            title="Xem"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => onEdit(p)}
                            className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                            title="Sửa"
                          >
                            <Pencil size={18} />
                          </button>
                          {/* Support Admin: KHÔNG xóa; nếu cần xóa, dùng trang /admin */}
                          {role !== "ADMIN" && (
                            <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                              Không có quyền xóa
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!items.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      Không có bài viết
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <button
              className="px-3 border rounded h-9 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => loadPosts(page - 1, q)}
            >
              ← Trước
            </button>
            {pageList(page, pages).map((p, i) =>
              typeof p === "number" ? (
                <button
                  key={i}
                  className={`h-9 px-3 border rounded ${
                    p === page ? "bg-indigo-600 text-white border-indigo-600" : "hover:bg-zinc-50 dark:border-zinc-800"
                  }`}
                  disabled={loading}
                  onClick={() => loadPosts(p, q)}
                >
                  {p}
                </button>
              ) : (
                <span key={i} className="px-2 text-zinc-500">
                  …
                </span>
              )
            )}
            <button
              className="px-3 border rounded h-9 disabled:opacity-50"
              disabled={page >= pages || loading}
              onClick={() => loadPosts(page + 1, q)}
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        title={editing ? "Sửa bài viết" : "Thêm bài viết"}
        size="md"
      >
        <PostForm
          initial={editing ?? undefined}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={showView}
        onClose={() => {
          setShowView(false);
          setViewing(null);
        }}
        title="Xem bài viết"
        size="sm"
      >
        {viewing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-500">ID: {viewing.id}</div>
              <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setShowView(false)}>
                <X size={18} />
              </button>
            </div>
            {viewing.image && <img src={viewing.image} alt="" className="object-cover w-full h-48 rounded-xl" />}
            <div className="font-medium">{viewing.title}</div>
            <div className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">{viewing.excerpt}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
