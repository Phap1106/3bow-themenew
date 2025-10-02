
// import Link from "next/link";
// import SiteShell from "@/components/siteHeaderFooter";
// import { notFound } from "next/navigation";
// import { getArticles, getArticleBySlug } from "@/lib/newsApi";
// import Markdown from "@/components/Markdown";
// import { Calendar, User, ChevronRight, ArrowLeft, Clock } from "lucide-react";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// const FALLBACK_IMG = "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   try {
//     const a = await getArticleBySlug(params.slug);
//     return {
//       title: `${a.title} • 3BOW`,
//       description: a.excerpt ?? "Chi tiết bài viết",
//       openGraph: { title: a.title, description: a.excerpt ?? "", images: [{ url: a.image || FALLBACK_IMG }] },
//     };
//   } catch {
//     return { title: "Bài viết • 3BOW", description: "Chi tiết bài viết" };
//   }
// }

// const fmt = (v?: string | null) =>
//   !v ? "—" : new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));

// export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
//   const a = await getArticleBySlug(params.slug).catch(() => null);
//   if (!a) return notFound();

//   const { items: latest } = await getArticles(undefined, 1, 6);
//   const more = latest.filter((x) => x.slug !== a.slug).slice(0, 4);

//   return (
//     <SiteShell>
//       {/* spacer tránh header chèn */}
//       <div className="h-[84px] md:h-[96px]" aria-hidden />

//       {/* breadcrumb */}
//       <section className="border-b border-zinc-200 bg-[#F7FBFF]">
//         <div className="flex items-center gap-2 px-4 py-3 text-sm container-max">
//           <Link href="/news" className="text-zinc-600 hover:underline">Tin tức</Link>
//           <ChevronRight className="w-4 h-4 text-zinc-400" />
//           <span className="font-medium line-clamp-1">{a.title}</span>
//         </div>
//       </section>

//       <article className="container-max grid gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
//         {/* content */}
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{a.title}</h1>
//           <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-600">
//             <span className="inline-flex items-center gap-1"><User className="w-4 h-4" />{a.author || "3BOW"}</span>
//             <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /><time dateTime={a.publishedAt ?? undefined}>{fmt(a.publishedAt)}</time></span>
//             {"readingMinutes" in a && (a as any).readingMinutes
//               ? <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4"/>{(a as any).readingMinutes} phút đọc</span>
//               : null}
//           </div>

//           <div className="relative mt-6 overflow-hidden rounded-3xl ring-1 ring-zinc-200">
//             <img src={a.image || FALLBACK_IMG} alt={a.title} width={1600} height={900} loading="eager" className="object-cover w-full h-auto" />
//           </div>

//           <div className="mt-6 prose prose-zinc max-w-none">
//             <Markdown>{a.content || ""}</Markdown>
//           </div>

//           <div className="mt-8">
//             <Link href="/news" className="btn btn-secondary">
//               <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại Tin tức
//             </Link>
//           </div>
//         </div>

//         {/* sidebar */}
//         <aside className="h-fit lg:sticky lg:top-[112px]">
//           <div className="p-4 bg-white border rounded-2xl border-zinc-200">
//             <h3 className="font-semibold">Bài viết mới</h3>
//             <ul className="mt-3 space-y-3">
//               {more.map((post) => (
//                 <li key={post.slug} className="flex gap-3">
//                   <div className="relative w-24 h-16 overflow-hidden rounded-lg ring-1 ring-zinc-200">
//                     <img src={post.image || FALLBACK_IMG} alt={post.title} loading="lazy" className="object-cover w-full h-full" />
//                   </div>
//                   <div className="min-w-0">
//                     <Link href={`/news/${post.slug}`} className="font-medium line-clamp-2 hover:underline">
//                       {post.title}
//                     </Link>
//                     <div className="mt-1 text-xs text-zinc-500">{fmt(post.publishedAt)}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>
//       </article>

//       {more.length>0 && (
//         <section className="px-4 pb-16 container-max">
//           <h3 className="text-xl font-bold">Bài liên quan</h3>
//           <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-4">
//             {more.map((post)=>(
//               <Link key={post.slug} href={`/news/${post.slug}`} className="block overflow-hidden bg-white group rounded-2xl ring-1 ring-zinc-200">
//                 <div className="relative aspect-[16/10] overflow-hidden">
//                   <img src={post.image || FALLBACK_IMG} alt={post.title} loading="lazy"
//                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
//                 </div>
//                 <div className="p-4">
//                   <h4 className="font-semibold line-clamp-2">{post.title}</h4>
//                   {post.excerpt && <p className="mt-1 text-sm line-clamp-2 text-zinc-600">{post.excerpt}</p>}
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
//     </SiteShell>
//   );
// }

















import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import { notFound } from "next/navigation";
import { getArticles, getArticleBySlug } from "@/lib/newsApi";
import Markdown from "@/components/Markdown";
import { Calendar, User, ChevronRight, ArrowLeft, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_IMG =
  "https://dummyimage.com/1200x630/e5e7eb/9ca3af&text=3BOW+News";

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

const fmt = (v?: string | null) =>
  !v
    ? "—"
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(v));

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
      {/* ===== HERO HEADER (màu xanh dương–cyan) ===== */}
      <header className="w-full text-white bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500">
        {/* thêm padding-top 145px để tránh đè header cũ */}
        <div className="mx-auto max-w-7xl px-4 lg:px-6 pt-[145px] pb-10">
          {/* breadcrumb */}
          <nav className="flex items-center gap-2 text-sm/6 text-white/90">
            <Link href="/news" className="hover:underline">
              Tin tức
            </Link>
            <ChevronRight className="w-4 h-4 opacity-70" />
            <span className="font-medium line-clamp-1">{a.title}</span>
          </nav>

          {/* title + meta */}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            {a.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/90">
            <span className="inline-flex items-center gap-1">
              <User className="w-4 h-4" />
              {a.author || "3BOW"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={a.publishedAt ?? undefined}>
                {fmt(a.publishedAt)}
              </time>
            </span>
            {"readingMinutes" in a && (a as any).readingMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {(a as any).readingMinutes} phút đọc
              </span>
            ) : null}
          </div>

          {/* đường line mảnh */}
          <div className="w-full h-px mt-6 bg-white/30" />
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <article className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
        {/* content */}
        <div>
          <div className="relative mt-2 overflow-hidden rounded-3xl ring-1 ring-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.image || FALLBACK_IMG}
              alt={a.title}
              width={1600}
              height={900}
              loading="eager"
              className="object-cover w-full h-auto"
            />
          </div>

          <div className="mt-6 prose prose-zinc max-w-none">
            <Markdown>{a.content || ""}</Markdown>
          </div>

          <div className="mt-8">
            <Link
              href="/news"
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Tin tức
            </Link>
          </div>
        </div>

        {/* sidebar */}
        <aside className="h-fit lg:sticky lg:top-[112px]">
          <div className="p-4 bg-white border rounded-2xl border-zinc-200">
            <h3 className="font-semibold">Bài viết mới</h3>
            <ul className="mt-3 space-y-3">
              {more.map((post) => (
                <li key={post.slug} className="flex gap-3">
                  <div className="relative w-24 h-16 overflow-hidden rounded-lg ring-1 ring-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      {fmt(post.publishedAt)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </article>

      {/* related */}
      {more.length > 0 && (
        <section className="w-full px-4 pb-16 mx-auto max-w-7xl lg:px-6">
          <h3 className="text-xl font-bold">Bài liên quan</h3>
          <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-4">
            {more.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="block overflow-hidden bg-white group rounded-2xl ring-1 ring-zinc-200"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image || FALLBACK_IMG}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold line-clamp-2">{post.title}</h4>
                  {post.excerpt && (
                    <p className="mt-1 text-sm line-clamp-2 text-zinc-600">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
