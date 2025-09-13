// app/news/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h2 className="text-xl md:text-2xl font-semibold">Bài viết không tồn tại</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">Vui lòng quay lại danh sách tin.</p>
    </div>
  );
}
