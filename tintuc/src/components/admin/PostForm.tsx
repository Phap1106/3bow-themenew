

"use client";

import * as React from "react";
import type { Post, PostInput } from "@/types/article";

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

  // Reset khi đổi bài đang chỉnh
  React.useEffect(() => {
    setTitle(initial?.title ?? "");
    setSlug(initial?.slug ?? "");
    setExcerpt(initial?.excerpt ?? "");
    setContent(initial?.content ?? "");
    setAuthor(initial?.author ?? "");
    setPublishedLocal(toLocalDatetime(initial?.publishedAt ?? null)); // ✅
    setImage(initial?.image ?? "");
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

  return (
    <div className="w-[min(720px,calc(100vw-2rem))] max-h-[80vh] flex flex-col">
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
          <label className="block mb-1 text-sm">Nội dung</label>
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
