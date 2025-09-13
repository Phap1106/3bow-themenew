"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  RotateCcw,
  Save,
  CheckSquare,
  Square,
  Shuffle,
  Trash2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";
import { createArticle } from "@/lib/adminApi";
import { slugifyVN } from "@/utils/slug";
import type { PostInput } from "@/types/article";

// ----- helpers -----
const uid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    (`u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`));

const toImagePath = (u?: string | null): string => {
  if (!u) return "";
  const s = String(u).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/uploads/")) return s;
  return "";
};

const isValidImageUrl = (u?: string | null) => {
  if (!u) return false;
  const s = String(u).trim();
  return /^https?:\/\//i.test(s) || s.startsWith("/uploads/");
};

const isPlaceholder = (u?: string | null) =>
  !!u &&
  /dummyimage\.com|placehold\.co|via\.placeholder\.com|placeholder\.com|picsum\.photos|unsplash\.com/i.test(
    String(u),
  );

// ----- types -----
type DraftEx = PostInput & {
  id: string;
  selected: boolean;
  status?: "ok" | "dupTitle" | "dupImage" | "error";
  errorMsg?: string;
};

// ----- component -----
export default function Page() {
  const router = useRouter();

  // sidebar collapse
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(localStorage.getItem("admin.sidebar.collapsed") === "1");
    }
  }, []);

  // form states
  const [prompt, setPrompt] = React.useState(
    "Tạo 1 loạt bài báo về xu hướng AI 2025 cho người mới, có số liệu và ví dụ ứng dụng."
  );
  const [count, setCount] = React.useState(3);
  const [loading, setLoading] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  // drafts
  const [drafts, setDrafts] = React.useState<DraftEx[]>([]);

  const selectedCount = drafts.filter((d) => d.selected).length;

  // ---- API helpers ----
  async function fetchImageByKeywords(keywords: string, seed = Date.now()) {
    try {
      const r = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, seed, preferNews: true }),
      });
      if (r.ok) {
        const j = await r.json();
        const url = (j.image as string) || "";
        return isValidImageUrl(url) && !isPlaceholder(url) ? url : "";
      }
    } catch {}
    return "";
  }

  async function genOneVariant(i: number, takenTitles: Set<string>, takenImgs: Set<string>) {
    // khuếch đại prompt để AI tạo biến thể
    const promptEnhanced = `${prompt}\n\nYÊU CẦU BIẾN THỂ #${i + 1}: Viết khác biệt, tiêu đề độc nhất, không trùng lặp các bài khác.`;
    const seed = Math.floor(Math.random() * 1e9);

    // gọi AI
    const r = await fetch("/api/ai/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptEnhanced,
        locale: "vi",
        model: "gpt-4.1-mini",
      }),
    });

    if (!r.ok) throw new Error(await r.text());
    const obj = await r.json();

    let title: string = (obj.title || "").trim();
    let excerpt: string = (obj.excerpt || "").trim();
    let content: string = (obj.content || "").trim();
    let author: string = (obj.author || "3BOW AI").trim();

    // tiêu đề không được rỗng
    if (!title) title = `Bài viết AI #${i + 1}`;

    // Ảnh: dùng của AI nếu hợp lệ, nếu không thì tìm theo keywords
    const kw = `${title} ${excerpt}`.trim() || title;
    let image: string =
      isValidImageUrl(obj.image) && !isPlaceholder(obj.image)
        ? String(obj.image).trim()
        : "";

    if (!image) image = await fetchImageByKeywords(kw, seed);

    // ---- uniqueness enforcement ----
    // unique title
    const norm = (s: string) => slugifyVN(s || "").trim();
    let normTitle = norm(title);
    if (takenTitles.has(normTitle) || !normTitle) {
      // thử làm mới 2 lần bằng cách thêm hậu tố khác nhau
      let tries = 0;
      while (tries < 2 && (takenTitles.has(normTitle) || !normTitle)) {
        title = `${title.replace(/\s*\(Bản.*\)$/, "")} (Bản ${i + 1}-${tries + 1})`;
        normTitle = norm(title);
        tries++;
      }
      if (takenTitles.has(normTitle) || !normTitle) {
        throw new Error("dup-title"); // để vòng lặp bên ngoài sinh lại
      }
    }
    takenTitles.add(normTitle);

    // unique image
    let safeImage = image;
    let imgTries = 0;
    while ((!safeImage || takenImgs.has(safeImage)) && imgTries < 4) {
      safeImage = await fetchImageByKeywords(kw, Math.floor(Math.random() * 1e9));
      imgTries++;
    }
    if (!safeImage || takenImgs.has(safeImage)) throw new Error("dup-image");
    takenImgs.add(safeImage);

    const d: DraftEx = {
      id: uid(),
      selected: true,
      title,
      slug: slugifyVN(title),
      excerpt,
      content,
      image: safeImage,
      author,
      publishedAt: new Date().toISOString(),
      status: "ok",
    };
    return d;
  }

  // sinh nhiều bài
  async function generateBatch() {
    const N = Math.max(1, Math.min(12, Number.isFinite(count) ? count : 1)); // chặn max 12
    setLoading(true);
    setErr(null);
    setDrafts([]);

    const takenTitles = new Set<string>();
    const takenImgs = new Set<string>();
    const out: DraftEx[] = [];

    for (let i = 0; i < N; i++) {
      let ok = false;
      let tries = 0;
      while (!ok && tries < 4) {
        try {
          const d = await genOneVariant(i, takenTitles, takenImgs);
          out.push(d);
          ok = true;
        } catch (e: any) {
          tries++;
          if (tries >= 4) {
            out.push({
              id: uid(),
              selected: false,
              title: `Bản lỗi #${i + 1}`,
              slug: `ban-loi-${i + 1}`,
              excerpt: "",
              content: "",
              image: "",
              author: "3BOW AI",
              publishedAt: new Date().toISOString(),
              status: "error",
              errorMsg:
                e?.message === "dup-title"
                  ? "Trùng tiêu đề, thử lại thất bại"
                  : e?.message === "dup-image"
                  ? "Trùng ảnh, thử lại thất bại"
                  : "Sinh bài lỗi",
            });
          }
        }
      }
    }

    setDrafts(out);
    setLoading(false);
  }

  // đổi ảnh 1 bài (không trùng)
  async function shuffleImageOne(id: string) {
    const idx = drafts.findIndex((d) => d.id === id);
    if (idx < 0) return;
    const d = drafts[idx];
    const takenImgs = new Set(drafts.map((x) => x.image).filter(Boolean));
    takenImgs.delete(d.image);

    let newImg = "";
    let tries = 0;
    const kw = `${d.title} ${d.excerpt}`.trim() || d.title || "ai";
    while ((!newImg || takenImgs.has(newImg)) && tries < 5) {
      newImg = await fetchImageByKeywords(kw, Math.floor(Math.random() * 1e9));
      tries++;
    }
    if (newImg && !takenImgs.has(newImg)) {
      const next = [...drafts];
      next[idx] = { ...d, image: newImg, status: "ok" };
      setDrafts(next);
    }
  }

  // chọn tất cả / bỏ chọn tất cả
  function toggleAll(sel: boolean) {
    setDrafts((arr) => arr.map((d) => ({ ...d, selected: sel })));
  }

  // xóa các bài đã chọn khỏi danh sách (chỉ xóa bản nháp cục bộ)
  function removeSelected() {
    setDrafts((arr) => arr.filter((d) => !d.selected));
  }

  // đăng loạt bài đã chọn
  async function publishSelected() {
    const list = drafts.filter((d) => d.selected && d.status !== "error");
    if (list.length === 0) return;

    setPublishing(true);
    setErr(null);

    try {
      // tuần tự để tránh đụng slug/image xử lý phía server
      for (const d of list) {
        const payload: PostInput = {
          title: d.title,
          slug: d.slug?.trim() || slugifyVN(d.title),
          excerpt: d.excerpt,
          content: d.content,
          image: toImagePath(d.image),
          author: d.author || "3BOW AI",
          publishedAt: d.publishedAt || new Date().toISOString(),
        };
        await createArticle(payload);
      }
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Đăng loạt bài thất bại");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 mx-auto h-14 max-w-7xl">
          <h1 className="text-lg font-semibold tracking-tight">
            Admin · Tạo nhiều bài đăng
          </h1>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-4 py-6 mx-auto max-w-7xl">
        {/* Sidebar */}
        <aside className={collapsed ? "col-span-12 md:col-span-1" : "col-span-12 md:col-span-3"}>
          <AdminSidebar
            active="posts"
            onGoPosts={() => router.push("/admin")}
            onAddPost={() => router.push("/admin/ai-writer")}
            onGoUsers={() => router.push("/admin")}
            onAddSupport={() => router.push("/admin")}
            collapsed={collapsed}
            onToggleCollapsed={() => {
              setCollapsed((s) => {
                const nx = !s;
                localStorage.setItem("admin.sidebar.collapsed", nx ? "1" : "0");
                return nx;
              });
            }}
          />
        </aside>

        {/* Main */}
        <main className={collapsed ? "col-span-12 md:col-span-11" : "col-span-12 md:col-span-9"}>
          <div className="space-y-5">
            {/* Control bar */}
            <div className="p-4 border rounded-2xl">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8">
                  <label className="block mb-1 text-sm font-medium">Yêu cầu (prompt)</label>
                  <textarea
                    className="w-full h-[120px] px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-zinc-200"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Mô tả chủ đề, góc nhìn, độ dài, giọng điệu..."
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="block mb-1 text-sm font-medium">Số bài muốn tạo</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    step={1}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
                    className="w-full px-3 border outline-none h-11 rounded-xl focus:ring-2 focus:ring-zinc-200"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={generateBatch}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-3 text-white bg-black h-11 rounded-xl hover:opacity-90 disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4" />
                      {loading ? "Đang tạo…" : "Tạo nhiều bài"}
                    </button>
                    <button
                      onClick={() => {
                        setDrafts([]);
                        setErr(null);
                      }}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-3 border h-11 rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {err && (
                <div className="px-3 py-2 mt-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                  {err}
                </div>
              )}
            </div>

            {/* Bulk actions */}
            {drafts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleAll(true)}
                  className="inline-flex items-center h-10 gap-2 px-3 border rounded-xl hover:bg-zinc-50"
                >
                  <CheckSquare className="w-4 h-4" /> Chọn tất cả
                </button>
                <button
                  onClick={() => toggleAll(false)}
                  className="inline-flex items-center h-10 gap-2 px-3 border rounded-xl hover:bg-zinc-50"
                >
                  <Square className="w-4 h-4" /> Bỏ chọn tất cả
                </button>
                <button
                  onClick={removeSelected}
                  disabled={drafts.every((d) => !d.selected)}
                  className="inline-flex items-center h-10 gap-2 px-3 border rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" /> Xóa các bài đã chọn
                </button>
                <div className="ml-auto text-sm text-zinc-600">
                  Đã chọn: {selectedCount}/{drafts.length}
                </div>
              </div>
            )}

            {/* Grid of drafts */}
            {drafts.length > 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {drafts.map((d) => (
                    <article key={d.id} className="overflow-hidden border rounded-2xl">
                      <div className="relative aspect-[16/9] bg-zinc-100">
                        {d.image ? (
                          <img
                            src={d.image}
                            alt={d.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs text-zinc-400">
                            Chưa có ảnh
                          </div>
                        )}
                        {/* checkbox */}
                        <label className="absolute inline-flex items-center gap-2 px-2 py-1 rounded left-2 top-2 bg-white/90">
                          <input
                            type="checkbox"
                            checked={d.selected}
                            onChange={(e) =>
                              setDrafts((arr) =>
                                arr.map((x) => (x.id === d.id ? { ...x, selected: e.target.checked } : x))
                              )
                            }
                          />
                          <span className="text-xs">Chọn</span>
                        </label>
                      </div>

                      <div className="p-4 space-y-2">
                        <input
                          className="w-full font-semibold outline-none"
                          value={d.title}
                          onChange={(e) =>
                            setDrafts((arr) =>
                              arr.map((x) =>
                                x.id === d.id
                                  ? {
                                      ...x,
                                      title: e.target.value,
                                      slug: slugifyVN(e.target.value),
                                    }
                                  : x
                              )
                            )
                          }
                        />
                        <textarea
                          className="w-full h-16 text-sm outline-none text-zinc-600"
                          value={d.excerpt}
                          onChange={(e) =>
                            setDrafts((arr) =>
                              arr.map((x) => (x.id === d.id ? { ...x, excerpt: e.target.value } : x))
                            )
                          }
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => shuffleImageOne(d.id)}
                            className="inline-flex items-center gap-2 px-3 border h-9 rounded-xl hover:bg-zinc-50"
                            title="Đổi ảnh khác"
                          >
                            <Shuffle className="w-4 h-4" />
                            Đổi ảnh
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDrafts((arr) => arr.filter((x) => x.id !== d.id))
                            }
                            className="inline-flex items-center gap-2 px-3 border h-9 rounded-xl hover:bg-zinc-50"
                            title="Xóa bản nháp này"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>

                        {d.status === "error" && (
                          <p className="text-xs text-red-600">
                            {d.errorMsg || "Không thể sinh bài này."}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Publish bar */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={publishSelected}
                    disabled={publishing || drafts.every((d) => !d.selected || d.status === "error")}
                    className="inline-flex items-center h-10 gap-2 px-4 text-white bg-black rounded-xl hover:opacity-90 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {publishing ? "Đang đăng…" : `Đăng ${selectedCount} bài đã chọn`}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


































