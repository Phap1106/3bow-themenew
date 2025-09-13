"use client";
import * as React from "react";
import { Search, Eye, Pencil, Trash2, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import PostForm from "@/components/admin/PostForm";
import {
  listArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/adminApi";
import Pagination from "@/components/ui/Pagination";
import type { Post, PostInput } from "@/types/article";

const LIMIT = 10;

export type PostsPanelHandle = { openCreate: () => void };

export default React.forwardRef<PostsPanelHandle, {}>(function PostsPanel(
  _,
  ref
) {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<Post[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [showView, setShowView] = React.useState(false);
  const [viewing, setViewing] = React.useState<Post | null>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      openCreate: () => {
        setEditing(null);
        setShowForm(true);
      },
    }),
    []
  );

  async function load(p = 1, keyword = "") {
    setLoading(true);
    setError(null);
    try {
      const r = await listArticles(p, LIMIT, keyword);
      setItems(r.items);
      setTotal(r.total);
      setPage(r.page); // ✅ phải nhận từ API
    } catch (e: any) {
      setError(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load(1, "");
  }, []);

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

  async function onSubmit(input: PostInput) {
    setLoading(true);
    try {
      if (editing) await updateArticle(editing.id, input);
      else await createArticle(input);
      setShowForm(false);
      setEditing(null);
      await load(page, q);
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function doDelete(p: Post) {
    if (!confirm(`Xoá "${p.title}"?`)) return;
    setLoading(true);
    try {
      await deleteArticle(p.id);
      await load(page, q);
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-full max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tiêu đề / slug / tác giả…"
            className="w-full h-10 pl-10 pr-3 bg-white border shadow-sm rounded-xl border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
          />
          <Search
            className="absolute -translate-y-1/2 text-zinc-400 left-3 top-1/2"
            size={18}
          />
        </div>
        <button
          className="h-10 px-4 border shadow-sm rounded-xl border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
          onClick={() => load(1, q.trim())}
          disabled={loading}
        >
          Tìm
        </button>
        <button
          className="h-10 px-4 text-white bg-indigo-600 shadow-sm rounded-xl hover:bg-indigo-700"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Thêm bài viết
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
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
                          {p.image && (
                            <img
                              src={p.image}
                              alt=""
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-zinc-500 line-clamp-1">
                            {p.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.slug}</td>
                    <td className="px-4 py-3">{p.author}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${st.cls}`}
                      >
                        {st.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setViewing(p);
                            setShowView(true);
                          }}
                          className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(p);
                            setShowForm(true);
                          }}
                          className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => doDelete(p)}
                          className="p-2 text-red-600 border rounded-lg border-zinc-200 hover:bg-red-50 dark:border-zinc-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!items.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    Không có bài viết
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pager */}
      <div className="mt-6">
        <Pagination
          page={page}
          total={total}
          limit={LIMIT}
          loading={loading}
          onPageChange={(p) => load(p, q)}
        />
        <p className="mt-2 text-xs text-center text-zinc-500">
          Trang {page}/{Math.max(1, Math.ceil((total || 0) / LIMIT))} • {total}{" "}
          bài
        </p>
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
          onSubmit={onSubmit}
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
              <button
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => setShowView(false)}
              >
                <X size={18} />
              </button>
            </div>
            {viewing.image && (
              <img
                src={viewing.image}
                alt=""
                className="object-cover w-full h-48 rounded-xl"
              />
            )}
            <div className="font-medium">{viewing.title}</div>
            <div className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-300">
              {viewing.excerpt}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
});
