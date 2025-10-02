// src/app/portfolio/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import { Play, ExternalLink, X, Images, Film, Sparkles } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

// 2 ảnh fallback riêng cho video
import fallbackLocal from "@/app/image/safe_img/1280_800.jpg";
import fallbackLocal2 from "@/app/image/safe_img/1280_800_2.jpg";

/* ===================== DỮ LIỆU MẪU ===================== */
type Item = {
  id: string;
  title: string;
  cover: string | StaticImageData;        // ảnh hiển thị ở grid
  type: "image" | "video";
  src?: string | StaticImageData;         // ảnh lớn hoặc URL video
  w: number;
  h: number;
  tags: string[];
  client?: string;
  /** fallback cover khi ảnh lỗi (per-item) */
  fallbackCover?: string | StaticImageData;
};

const ITEMS: Item[] = [
  {
    id: "1",
    title: "LIXIBOX 7th Birthday Campaign",
    cover:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop",
    type: "image",
    src:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=2400&auto=format&fit=crop",
    w: 1600,
    h: 1000,
    tags: ["IMC", "Kích hoạt", "Retail"],
    client: "LIXIBOX",
  },
  {
    id: "2",
    title: "Home Credit | MC Thu Trang Livestream",
    cover:
      "https://images.unsplash.com/photo-1541660994081-8f7b0cbd9317?q=80&w=1600&auto=format&fit=crop",
    type: "video",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    w: 1600,
    h: 900,
    tags: ["Livestream", "KOL", "TV/Online"],
    client: "Home Credit",
    fallbackCover: fallbackLocal,        // ẢNH FALLBACK #1
  },
  {
    id: "3",
    title: "TV Commercial – Kitchen Series",
    cover:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=1600&auto=format&fit=crop",
    type: "image",
    src:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2400&auto=format&fit=crop",
    w: 1600,
    h: 1100,
    tags: ["TVC", "Sản xuất"],
    client: "KitchenPro",
  },
  {
    id: "4",
    title: "Event – Grand Opening",
    cover:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    type: "image",
    src:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2400&auto=format&fit=crop",
    w: 1600,
    h: 1200,
    tags: ["Sự kiện", "Activation"],
    client: "MegaMall",
  },
  {
    id: "5",
    title: "OOH Key Visual – YUNA",
    cover:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop",
    type: "image",
    src:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2400&auto=format&fit=crop",
    w: 1600,
    h: 1600,
    tags: ["Design", "KV", "OOH"],
    client: "ITZY x Dispatch",
  },
  {
    id: "6",
    title: "Factory Documentary",
    cover:
      "https://images.unsplash.com/photo-1542452255191-c85a98f2c5da?q=80&w=1600&auto=format&fit=crop",
    type: "video",
    src: "https://player.vimeo.com/video/76979871?autoplay=1&title=0&byline=0",
    w: 1600,
    h: 900,
    tags: ["Phim doanh nghiệp", "Sản xuất"],
    client: "Ceramics VN",
    fallbackCover: fallbackLocal2,       // ẢNH FALLBACK #2
  },
  {
    id: "7",
    title: "Web Design Showcase",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    type: "image",
    src:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2400&auto=format&fit=crop",
    w: 1600,
    h: 1000,
    tags: ["Website", "UI/UX"],
    client: "3BOW x FPT Software",
  },
];

/* ===================== TIỆN ÍCH ===================== */
const TAGS = [
  "Tất cả",
  "IMC",
  "Livestream",
  "TVC",
  "Sự kiện",
  "Design",
  "Website",
  "Phim doanh nghiệp",
  "Retail",
  "KOL",
  "KV",
  "OOH",
  "UI/UX",
  "Sản xuất",
  "Activation",
  "TV/Online",
];

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function toUrl(v?: string | StaticImageData) {
  if (!v) return "";
  return typeof v === "string" ? v : v.src;
}

/* ===================== PAGE ===================== */
export default function PortfolioPage() {
  const [tag, setTag] = React.useState<string>("Tất cả");
  const [q, setQ] = React.useState("");
  const [lightbox, setLightbox] = React.useState<null | {
    type: "image" | "video";
    url: string;
    title: string;
  }>(null);

  const filtered = React.useMemo(
    () =>
      ITEMS.filter(
        (it) =>
          (tag === "Tất cả" || it.tags.includes(tag)) &&
          (q ? it.title.toLowerCase().includes(q.toLowerCase()) : true),
      ),
    [tag, q],
  );

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative h-[62vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2400&auto=format&fit=crop"
          alt="Portfolio Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-16 mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-amber-300">
            <span className="inline-block h-[3px] w-14 bg-amber-300 rounded-full" />
            <span className="uppercase tracking-[0.2em] text-xs md:text-sm">
              Các dự án tiêu biểu
            </span>
          </div>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Portfolio
          </h1>
          <p className="max-w-2xl mt-3 text-white/80">
            Tập hợp dự án IMC, Livestream, TVC, Thiết kế & Website đã thực hiện.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#works" className="inline-flex items-center gap-2 px-5 py-3 font-medium bg-white text-zinc-900 rounded-2xl hover:bg-zinc-100">
              <Sparkles className="w-4 h-4" /> Xem dự án
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 font-medium text-white border border-white/40 rounded-2xl hover:bg-white/10">
              Liên hệ báo giá
            </Link>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-6 py-3 mx-auto max-w-7xl">
          <div className="items-center hidden xl:flex text-zinc-500">
            <Images className="w-4 h-4 mr-2" /> {filtered.length} dự án
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-fit">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={cx(
                    "px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap",
                    t === tag ? "bg-black text-white border-black" : "hover:bg-zinc-100",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-6 mx-1 bg-zinc-200" />
          <input
            placeholder="Tìm dự án…"
            className="w-56 px-3 text-sm border rounded-lg h-9 focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* GALLERY */}
      <section id="works" className="max-w-[1600px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-4 [column-fill:_balance]">
          {filtered.map((it) => (
            <figure key={it.id} className="relative mb-4 overflow-hidden shadow-sm break-inside-avoid rounded-2xl group">
              <SafeImage
                src={it.cover}
                alt={it.title}
                width={it.w}
                height={it.h}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-zinc-100"
                priority={it.id === "1"}
                fallbackSrc={it.type === "video" ? it.fallbackCover || fallbackLocal2 : fallbackLocal}
              />
              <figcaption className="absolute inset-0 transition opacity-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    {it.type === "video" ? <Film className="w-4 h-4" /> : <Images className="w-4 h-4" />}
                    <span className="truncate">{it.client || "Project"}</span>
                    <span>•</span>
                    <span className="truncate">{it.tags.join(" / ")}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{it.title}</h3>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        setLightbox({
                          type: it.type,
                          url: it.type === "video" ? toUrl(it.src) : (toUrl(it.src) || toUrl(it.cover)),
                          title: it.title,
                        })
                      }
                      className="inline-flex items-center gap-2 bg-white text-zinc-900 rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-zinc-100"
                    >
                      {it.type === "video" ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />} Xem
                    </button>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-amber-400">
        <div className="flex flex-col gap-6 px-6 py-12 mx-auto max-w-7xl md:py-16 md:flex-row md:items-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Cần team sản xuất & triển khai chiến dịch ngay?</h2>
          <div className="flex-1" />
          <div className="flex gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 font-medium text-white bg-black rounded-2xl hover:opacity-90">
              Bắt đầu dự án
            </Link>
            <a href="mailto:3bowdigital@gmail.com" className="inline-flex items-center gap-2 px-5 py-3 font-medium border border-black rounded-2xl hover:bg-black/5">
              Gửi email
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-0 -top-10 text-white/80 hover:text-white" onClick={() => setLightbox(null)} aria-label="Đóng">
              <X className="w-8 h-8" />
            </button>
            {lightbox.type === "video" ? (
              <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-2xl">
                <iframe src={lightbox.url} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen; picture-in-picture" loading="lazy" />
              </div>
            ) : (
              <div className="relative overflow-hidden shadow-2xl rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lightbox.url} alt={lightbox.title} className="w-full h-auto" />
              </div>
            )}
            <div className="mt-3 text-center text-white/80">{lightbox.title}</div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
