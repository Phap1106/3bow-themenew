

"use client";

import * as React from "react";
import type { Post, PostInput } from "@/types/article";
import Modal from "@/components/ui/Modal";
import { Wand2, Loader2, Clipboard, Replace, Send, CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  initial?: Post;
  onSubmit: (input: PostInput) => void | Promise<void>;
  onCancel: () => void;
};

export default function PostForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = React.useState(initial?.excerpt ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [author, setAuthor] = React.useState(initial?.author ?? "");
  const [publishedLocal, setPublishedLocal] = React.useState<string>(
    toLocalDatetime(initial?.publishedAt ?? null) // ✅ không còn lỗi
  );
  const [image, setImage] = React.useState(initial?.image ?? "");
  const [saving, setSaving] = React.useState(false);

  // AI Rewrite modal state
  const [showAI, setShowAI] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [aiResult, setAiResult] = React.useState("");
  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  function showToast(t: { type: "success" | "error"; message: string }) {
    setToast(t);
    setTimeout(() => setToast(null), 2000);
  }

  // Reset khi đổi bài đang chỉnh
  React.useEffect(() => {
    setTitle(initial?.title ?? "");
    setSlug(initial?.slug ?? "");
    setExcerpt(initial?.excerpt ?? "");
    setContent(initial?.content ?? "");
    setAuthor(initial?.author ?? "");
    setPublishedLocal(toLocalDatetime(initial?.publishedAt ?? null)); // ✅
    setImage(initial?.image ?? "");
    setAiPrompt("");
    setAiError(null);
    setAiResult("");
  }, [initial]);

  function makeSlug() {
    setSlug(
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  }

  async function submit() {
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim() || !author.trim() || !image.trim()) {
      alert("Vui lòng điền đủ các trường bắt buộc.");
      return;
    }

    const payload: PostInput = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      image: image.trim(),
      // toISO trả string | undefined -> tương thích với PostInput (string | null | undefined)
      publishedAt: publishedLocal ? toISO(publishedLocal) : undefined,
    };

    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  }

  async function callAIRewrite(instruction: string) {
    setAiError(null);
    setAiLoading(true);
    try {
      const r = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, instruction }),
      });
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setAiResult(String(j.content || ""));
      showToast({ type: "success", message: "AI đã trả kết quả" });
    } catch (e: any) {
      setAiError(e?.message || "AI xử lý thất bại");
      showToast({ type: "error", message: "AI xử lý thất bại" });
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="w-[min(720px,calc(100vw-2rem))] max-h-[80vh] flex flex-col">
      {toast && (
        <div className="fixed right-4 top-4 z-50">
          <div className={["px-4 py-2 rounded-xl shadow border text-sm",
            toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700",
          ].join(" ")}
          >
            {toast.type === "success" ? <CheckCircle2 className="inline-block w-4 h-4 mr-2" /> : <AlertCircle className="inline-block w-4 h-4 mr-2" />}
            {toast.message}
          </div>
        </div>
      )}
      <div className="flex-1 pr-1 space-y-4 overflow-y-auto">
        <div>
          <label className="block mb-1 text-sm">Tiêu đề</label>
          <input className="w-full h-10 px-3 border rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm">Slug</label>
          <div className="flex gap-2">
            <input className="w-full h-10 px-3 border rounded-xl" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <button type="button" onClick={makeSlug} className="px-3 border rounded-xl">Tạo từ tiêu đề</button>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm">Mô tả ngắn</label>
          <textarea className="w-full px-3 py-2 border rounded-xl resize-y min-h-[96px]" rows={3}
            value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm">Nội dung</label>
            <button
              type="button"
              onClick={() => setShowAI(true)}
              className="inline-flex items-center gap-2 h-8 px-3 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              title="Bạn có muốn dùng AI để viết lại nội dung không"
            >
              <Wand2 className="w-4 h-4" /> Dùng AI viết lại
            </button>
          </div>
          <textarea
            className="w-full px-3 py-2 border rounded-xl resize-y min-h-[160px] font-mono text-sm"
            placeholder="Plain text… (xuống dòng sẽ được giữ nguyên)"
            value={content} onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm">Tác giả</label>
            <input className="w-full h-10 px-3 border rounded-xl" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 text-sm">Publish (datetime)</label>
            <input type="datetime-local" className="w-full h-10 px-3 border rounded-xl"
              value={publishedLocal} onChange={(e) => setPublishedLocal(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm">Ảnh bìa (URL)</label>
          <input className="w-full h-10 px-3 border rounded-xl" value={image} onChange={(e) => setImage(e.target.value)} />
          {image && <img src={image} alt="" className="object-cover w-full h-40 mt-2 rounded-xl" />}
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-2 px-1 pt-3 mt-4 -mx-1 border-t bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-zinc-200 dark:border-zinc-800">
        <button onClick={onCancel} className="h-10 px-4 border rounded-xl">Hủy</button>
        <button onClick={submit} disabled={saving} className="h-10 px-4 text-white bg-black rounded-xl disabled:opacity-60">
          {saving ? "Đang lưu…" : initial ? "Lưu thay đổi" : "Thêm mới"}
        </button>
      </div>

      {/* AI Rewrite Modal */}
      <Modal
        open={showAI}
        onClose={() => setShowAI(false)}
        title="Dùng AI viết lại nội dung"
        size="md"
      >
        <div className="space-y-3">
          <p className="text-sm text-zinc-600">Nhập yêu cầu cho AI. Nội dung hiện tại sẽ được gửi kèm để AI viết lại theo yêu cầu của bạn.</p>
          <textarea
            className="w-full px-3 py-2 border rounded-xl resize-y min-h-[96px]"
            placeholder="Ví dụ: Rút gọn, giữ số liệu, thêm bullet points, giọng điệu thân thiện…"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => callAIRewrite(aiPrompt.trim())}
              disabled={aiLoading || !aiPrompt.trim()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Gửi AI
            </button>
            {aiError && <span className="text-sm text-red-600">{aiError}</span>}
          </div>

          <div className="p-3 border rounded-xl bg-zinc-50">
            <div className="text-xs font-medium text-zinc-600 mb-1">Kết quả</div>
            <div className="max-h-[30vh] overflow-auto whitespace-pre-wrap text-sm leading-relaxed bg-white p-3 rounded-lg border">
              {aiResult || <span className="text-zinc-400">Chưa có kết quả</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                onClick={async () => {
                  if (!aiResult) return;
                  await navigator.clipboard.writeText(aiResult);
                  showToast({ type: "success", message: "Đã sao chép" });
                }}
                disabled={!aiResult}
                className="inline-flex items-center gap-2 h-9 px-3 border rounded-xl disabled:opacity-60 hover:bg-zinc-50"
              >
                <Clipboard className="w-4 h-4" /> Sao chép
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!aiResult) return;
                  setContent(aiResult);
                  setShowAI(false);
                  showToast({ type: "success", message: "Thay thế thành công" });
                }}
                disabled={!aiResult}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
              >
                <Replace className="w-4 h-4" /> Thay thế nội dung
              </button>
              <button
                type="button"
                onClick={() => aiResult && callAIRewrite(`${aiPrompt}\n\nYêu cầu bổ sung:`.trim())}
                disabled={!aiResult || aiLoading}
                className="inline-flex items-center gap-2 h-9 px-3 border rounded-xl disabled:opacity-60 hover:bg-zinc-50"
              >
                Yêu cầu khác
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/** ISO -> 'YYYY-MM-DDTHH:mm' cho input datetime-local */
function toLocalDatetime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 'YYYY-MM-DDTHH:mm' -> ISO */
function toISO(local: string) {
  const dt = new Date(local);
  return isNaN(dt.getTime()) ? undefined : dt.toISOString();
}
