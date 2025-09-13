// // src/app/news/[slug]/page.tsx
// import SiteShell from "@/components/siteHeaderFooter";
// import { notFound } from "next/navigation";
// import { getArticles, getArticleBySlug } from "@/lib/newsApi";
// import Markdown from "@/components/Markdown";

// const FALLBACK_IMG =
//   "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

// export async function generateStaticParams() {
//   const { items } = await getArticles(undefined, 1, 100);
//   return items.map((n) => ({ slug: n.slug }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   try {
//     const a = await getArticleBySlug(params.slug);
//     return {
//       title: `${a.title} • 3BOW`,
//       description: a.excerpt ?? "Chi tiết bài viết",
//       openGraph: {
//         title: a.title,
//         description: a.excerpt ?? "",
//         images: [{ url: a.image || FALLBACK_IMG }],
//       },
//     };
//   } catch {
//     return { title: "Bài viết • 3BOW", description: "Chi tiết bài viết" };
//   }
// }

// function formatDate(v?: string | null) {
//   if (!v) return "—";
//   try {
//     return new Intl.DateTimeFormat("vi-VN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date(v));
//   } catch {
//     return v ?? "—";
//   }
// }

// export default async function NewsDetailPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const a = await getArticleBySlug(params.slug).catch(() => null);
//   if (!a) return notFound();

//   return (
//     <SiteShell>
//       <article className="max-w-3xl px-4 py-8 mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold md:text-4xl">{a.title}</h1>
//           <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
//             <span>{a.author || "—"}</span> •{" "}
//             <time dateTime={a.publishedAt ?? undefined}>
//               {formatDate(a.publishedAt)}
//             </time>
//           </div>
//         </div>

//         <div className="overflow-hidden border rounded-2xl border-zinc-200/60 dark:border-zinc-800">
//           <img
//             src={a.image || FALLBACK_IMG}
//             alt={a.title}
//             className="object-cover w-full"
//           />
//         </div>

//         <div className="mt-6">
//           <Markdown>{a.content || ""}</Markdown>
//         </div>
//       </article>
//     </SiteShell>
//   );
// }
// src/app/news/[slug]/page.tsx
import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import { notFound } from "next/navigation";
import { getArticles, getArticleBySlug } from "@/lib/newsApi";
import Markdown from "@/components/Markdown";
import { Calendar, User, ChevronRight, ArrowLeft, Clock } from "lucide-react";

const FALLBACK_IMG =
  "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

export async function generateStaticParams() {
  const { items } = await getArticles(undefined, 1, 100);
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const a = await getArticleBySlug(params.slug);
    return {
      title: `${a.title} • 3BOW`,
      description: a.excerpt ?? "Chi tiết bài viết",
      openGraph: {
        title: a.title,
        description: a.excerpt ?? "",
        images: [{ url: a.image || FALLBACK_IMG }],
      },
    };
  } catch {
    return { title: "Bài viết • 3BOW", description: "Chi tiết bài viết" };
  }
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(v));
  } catch {
    return v ?? "—";
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const a = await getArticleBySlug(params.slug).catch(() => null);
  if (!a) return notFound();

  const { items: latest } = await getArticles(undefined, 1, 6);
  const more = latest.filter((x) => x.slug !== a.slug).slice(0, 4);

  return (
    <SiteShell>
      {/* breadcrumb */}
      <section className="bg-[#F7FBFF] border-b border-zinc-200">
        <div className="flex items-center gap-2 py-3 text-sm container-max">
          <Link href="/news" className="text-zinc-600 hover:underline">
            Tin tức
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
          <span className="font-medium line-clamp-1">{a.title}</span>
        </div>
      </section>

      <article className="container-max grid gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Nội dung */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {a.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-1">
              <User className="w-4 h-4" />
              {a.author || "3BOW"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={a.publishedAt ?? undefined}>
                {formatDate(a.publishedAt)}
              </time>
            </span>
            {"readingMinutes" in a && (a as any).readingMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {(a as any).readingMinutes} phút đọc
              </span>
            ) : null}
          </div>

          {/* Ảnh hero: dùng <img> để không bị chặn domain */}
          <div className="relative mt-6 overflow-hidden rounded-3xl ring-1 ring-zinc-200">
            <img
              src={a.image || FALLBACK_IMG}
              alt={a.title}
              width={1600}
              height={900}
              loading="eager"
              className="object-cover w-full h-auto"
            />
          </div>

          {/* Nội dung markdown */}
          <div className="mt-6 prose prose-zinc max-w-none">
            <Markdown>{a.content || ""}</Markdown>
          </div>

          <div className="mt-8">
            <Link href="/news" className="btn btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại Tin tức
            </Link>
          </div>
        </div>

        {/* Sidebar: bài viết mới */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="p-4 bg-white border rounded-2xl border-zinc-200">
            <h3 className="font-semibold">Bài viết mới</h3>
            <ul className="mt-3 space-y-3">
              {more.map((post) => (
                <li key={post.slug} className="flex gap-3">
                  <div className="relative w-24 h-16 overflow-hidden rounded-lg ring-1 ring-zinc-200">
                    <img
                      src={post.image || FALLBACK_IMG}
                      alt={post.title}
                      loading="lazy"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/news/${post.slug}`}
                      className="font-medium line-clamp-2 hover:underline"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </article>

      {/* Liên quan dưới cùng */}
      {more.length > 0 && (
        <section className="px-4 pb-16 container-max">
          <h3 className="text-xl font-bold">Bài liên quan</h3>
          <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-4">
            {more.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="block overflow-hidden bg-white group rounded-2xl ring-1 ring-zinc-200"
              >
                <div className="relative aspect-[16/10]">
                  <img
                    src={post.image || FALLBACK_IMG}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold line-clamp-2">{post.title}</h4>
                  {post.excerpt ? (
                    <p className="mt-1 text-sm line-clamp-2 text-zinc-600">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
