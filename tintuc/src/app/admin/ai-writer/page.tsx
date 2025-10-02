//ai-writer/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  RotateCcw,
  Save,
  Image as ImgIcon,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { createArticle } from "@/lib/adminApi";
import type { PostInput } from "@/types/article";
import { slugifyVN } from "@/utils/slug";

// ---- helpers ----
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

// chặn ảnh mock
const isPlaceholder = (u?: string | null) =>
  !!u &&
  /dummyimage\.com|placehold\.co|via\.placeholder\.com|placeholder\.com|picsum\.photos|unsplash\.com/i.test(
    String(u),
  );

const DEFAULT_PROMPT =
  "Tạo 1 bài báo nói về xu hướng AI 2025 cho người mới, có số liệu và ví dụ ứng dụng.";

const getEmptyDraft = (): PostInput => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "3BOW AI",
  publishedAt: new Date().toISOString(),
});

// Bắt URL đầu tiên trong prompt
function extractUrlFromText(t: string): string | null {
  const m = String(t || "").match(/https?:\/\/[^\s)]+/i);
  return m ? m[0].replace(/[),.]+$/, "") : null;
}

function AiWriter() {
  const router = useRouter();

  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(localStorage.getItem("admin.sidebar.collapsed") === "1");
    }
  }, []);

  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [draft, setDraft] = React.useState<PostInput>(getEmptyDraft());
  const [sourceUrl, setSourceUrl] = React.useState<string>("");
  const [imgFetching, setImgFetching] = React.useState(false);

  const titleLen = draft.title.length;
  const excerptLen = (draft.excerpt || "").length;
  const contentLen = draft.content.length;

  // API: tìm ảnh theo keywords (ưu tiên tin tức)
  async function fetchImageByKeywords(
    keywords: string,
    seed = Date.now(),
  ): Promise<string> {
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
    } catch (e) {
      console.warn("[image] keywords fail:", e);
    }
    return "";
  }

  // API: lấy ảnh từ link bài gốc
  async function getImageFromSource(
    srcUrl: string,
    saveLocal = false,
  ): Promise<string> {
    try {
      const r = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: srcUrl.trim(), saveLocal }),
      });
      const data = await r.json();
      const url = String(data?.image || "");
      return isValidImageUrl(url) && !isPlaceholder(url) ? url : "";
    } catch {
      return "";
    }
  }

  // Button: lấy ảnh gốc
  async function pickCoverFromSource(saveLocal = false, urlOverride?: string) {
    const src = (urlOverride || sourceUrl || "").trim();
    if (!src) return;
    try {
      setImgFetching(true);
      const url = await getImageFromSource(src, saveLocal);
      if (!url) throw new Error("Không lấy được ảnh gốc");
      setDraft((d) => ({ ...d, image: url }));
    } catch (e: any) {
      setErr(e?.message || "Không lấy được ảnh từ link bài gốc");
    } finally {
      setImgFetching(false);
    }
  }

  // Generate bài viết
  async function generate() {
    try {
      setLoading(true);
      setErr(null);

      const r = await fetch("/api/ai/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, locale: "vi", model: "gpt-4.1-mini" }),
      });
      if (!r.ok) throw new Error(await r.text());
      const obj = await r.json();

      const title = obj.title ?? "";
      const excerpt = obj.excerpt ?? "";
      const content = obj.content ?? "";
      const author = obj.author ?? "3BOW AI";

      let finalImage: string =
        isValidImageUrl(obj.image) && !isPlaceholder(obj.image)
          ? String(obj.image).trim()
          : "";

      const urlInPrompt = extractUrlFromText(prompt);
      if (urlInPrompt) {
        setSourceUrl(urlInPrompt);
        const imgFromSource = await getImageFromSource(urlInPrompt, false);
        if (imgFromSource) finalImage = imgFromSource;
      }

      if (!finalImage) {
        const kw = `${title} ${excerpt}`.trim() || title || "ai";
        finalImage = await fetchImageByKeywords(kw);
      }

      setDraft({
        title,
        slug: slugifyVN(title),
        excerpt,
        content,
        image: finalImage, // có thể rỗng
        author,
        publishedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      console.error("[generate] error:", e);
      setErr(e?.message || "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  function makeSlugFromTitle() {
    setDraft((d) => ({ ...d, slug: slugifyVN(d.title) }));
  }

  async function autoImageByContent() {
    const kw = `${draft.title} ${draft.excerpt}`.trim() || draft.title || "ai";
    const url = await fetchImageByKeywords(kw);
    if (url) setDraft((d) => ({ ...d, image: url }));
  }

  async function shuffleImage() {
    const kw = `${draft.title} ${draft.excerpt}`.trim() || draft.title || "ai";
    const url = await fetchImageByKeywords(kw, Math.floor(Math.random() * 1e9));
    if (url) setDraft((d) => ({ ...d, image: url }));
  }

  async function autoImageByTitle() {
    const kw = `${draft.title} ${draft.excerpt}`.trim() || draft.title || "ai";
    const url = await fetchImageByKeywords(kw);
    if (url) setDraft((d) => ({ ...d, image: url }));
  }

  // Upload file helper (tránh forge event)
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function uploadFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setErr("File phải là ảnh");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErr("Ảnh quá lớn (tối đa 10MB)");
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      const url = String(j.url || "");
      if (isValidImageUrl(url)) setDraft((d) => ({ ...d, image: url }));
    } catch (e: any) {
      setErr(e?.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handlePickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  }

  function handleDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  }

  function handleReset() {
    setErr(null);
    setPrompt(DEFAULT_PROMPT);
    setDraft(getEmptyDraft());
    setSourceUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit() {
    try {
      setLoading(true);
      const payload: PostInput = {
        ...draft,
        slug: draft.slug?.trim() || slugifyVN(draft.title),
        image: toImagePath(draft.image ?? ""), // không ép ảnh mặc định
        publishedAt: draft.publishedAt || new Date().toISOString(),
      };
      await createArticle(payload);
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Lưu bài thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 mx-auto h-14 max-w-7xl">
          <h1 className="text-lg font-semibold tracking-tight">
            Admin · Viết nội dung bằng AI
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
            onAddPost={() => router.push("/admin")}
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
          <div className="grid items-start grid-cols-12 gap-6">
            {/* LEFT controls */}
            <section
              className={[
                "col-span-12",
                collapsed ? "lg:col-span-5 lg:pr-8" : "lg:col-span-4 lg:pr-6",
                "lg:border-r lg:border-zinc-200",
              ].join(" ")}
            >
              <div className="flex flex-col h-full">
                <header className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-zinc-700">Nhập yêu cầu</h2>
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                    GPT-4.1-mini
                  </span>
                </header>

                <textarea
                  className="min-h-[220px] w-full flex-1 resize-none rounded-xl border bg-white px-4 py-3 leading-6 outline-none focus:ring-2 focus:ring-zinc-200"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ví dụ: Viết bài giới thiệu xu hướng AI 2025 cho marketer, có số liệu, 700–1000 từ..."
                />

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-white bg-black rounded-xl hover:opacity-90 disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4" />
                    {loading ? "Đang tạo…" : "Tạo bản nháp"}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading || uploading}
                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                    title="Xoá bản nháp hiện tại"
                    aria-label="Reset draft"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {err && (
                  <div className="px-3 py-2 mt-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                    {err}
                  </div>
                )}

                <p className="pl-1 mt-4 text-xs leading-5 text-zinc-500">
                  Tip: mô tả rõ độc giả, mục tiêu, độ dài, phong cách, giọng điệu.
                </p>
              </div>
            </section>

            {/* RIGHT editor */}
            <section className={collapsed ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-8"}>
              <div className="p-5 border shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold">Bản nháp bài viết</h2>
                  <div className="text-xs text-zinc-500">
                    <span className="mr-3">Tiêu đề: {titleLen}/120</span>
                    <span className="mr-3">Mô tả: {excerptLen}/280</span>
                    <span>Nội dung: {contentLen} ký tự</span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Tiêu đề</label>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    className="w-full px-3 py-2 border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                    placeholder="Tiêu đề bài viết"
                  />
                </div>

                {/* Slug */}
                <div className="grid items-end grid-cols-12 gap-2 mb-4">
                  <div className="col-span-8">
                    <label className="block mb-1 text-sm font-medium">Slug</label>
                    <input
                      value={draft.slug}
                      onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                      className="w-full px-3 py-2 border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                      placeholder="vd: xu-huong-ai-2025"
                    />
                  </div>
                  <div className="col-span-4">
                    <button
                      type="button"
                      onClick={makeSlugFromTitle}
                      className="w-full h-10 mt-6 border rounded-xl hover:bg-zinc-50"
                    >
                      Tạo từ tiêu đề
                    </button>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Mô tả ngắn</label>
                  <textarea
                    value={draft.excerpt || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                    className="w-full h-24 px-3 py-2 border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                    placeholder="1–2 câu tóm tắt nội dung chính"
                  />
                </div>

                {/* Source URL */}
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    Link bài gốc (để lấy đúng ảnh bìa)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        className="w-full px-3 py-2 border outline-none pl-9 rounded-xl focus:ring-2 focus:ring-zinc-200"
                        placeholder="https://... bài viết gốc"
                      />
                      <LinkIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-zinc-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => pickCoverFromSource(false)}
                      disabled={!sourceUrl || imgFetching}
                      className="px-3 text-sm border h-9 rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                      title="Ưu tiên dùng og:image / json-ld của bài gốc"
                    >
                      {imgFetching ? "Đang lấy…" : "Lấy ảnh gốc"}
                    </button>
                    <button
                      type="button"
                      onClick={() => pickCoverFromSource(true)}
                      disabled={!sourceUrl || imgFetching}
                      className="px-3 text-sm border h-9 rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                      title="Tải ảnh gốc về /public/uploads"
                    >
                      Lấy & lưu nội bộ
                    </button>
                  </div>
                </div>

                {/* Image + upload */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Ảnh minh họa</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={autoImageByContent}
                        className="inline-flex items-center gap-2 px-3 text-sm border h-9 rounded-xl hover:bg-zinc-50"
                        title="Gợi ý ảnh theo nội dung hiện tại"
                      >
                        <ImgIcon className="w-4 h-4" />
                        Gợi ý
                      </button>
                      <button
                        type="button"
                        onClick={shuffleImage}
                        className="inline-flex items-center gap-2 px-3 text-sm border h-9 rounded-xl hover:bg-zinc-50"
                        title="Đổi ảnh khác cùng ngữ cảnh"
                      >
                        Đổi ảnh
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePickFile}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-3 text-sm border h-9 rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                        title="Tải ảnh từ máy"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Đang tải..." : "Tải ảnh"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <input
                      value={draft.image || ""}
                      onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                      className="w-full px-3 py-2 border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                      placeholder="Dán URL ảnh (https://...)"
                    />
                  </div>

                  {/* Preview: không dùng ảnh mặc định */}
                  {draft.image ? (
                    <div className="overflow-hidden border rounded-xl" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} title="Kéo thả ảnh để tải lên">
                      <img
                        src={draft.image}
                        alt="preview"
                        className="object-cover w-full h-48"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center h-48 border rounded-xl text-zinc-400"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      title="Kéo thả ảnh để tải lên"
                    >
                      <span className="text-sm">Chưa có ảnh minh họa</span>
                    </div>
                  )}

                  <p className="mt-1 text-xs text-zinc-500">
                    Hỗ trợ URL http(s) hoặc đường dẫn local <code>/uploads/...</code>. Có thể kéo-thả ảnh vào khung.
                  </p>
                </div>

                {/* Author */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Tác giả</label>
                  <input
                    value={draft.author || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
                    className="w-full px-3 py-2 border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                {/* Content */}
                <div className="mb-2">
                  <label className="block mb-1 text-sm font-medium">Nội dung (Markdown)</label>
                  <textarea
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    className="w-full px-3 py-3 font-mono text-sm border outline-none h-80 rounded-xl focus:ring-2 focus:ring-zinc-200"
                    placeholder="# Tiêu đề chính..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 mt-5 border-t">
                  <button
                    onClick={() => router.push("/admin")}
                    className="h-10 px-4 border rounded-xl hover:bg-zinc-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading || !draft.title || !draft.content || !draft.slug}
                    className="inline-flex items-center h-10 gap-2 px-4 text-white bg-black rounded-xl hover:opacity-90 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    Đăng bài
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Default export là React Component chuẩn Next
export default function Page() {
  return <AiWriter />;
}

