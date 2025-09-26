// src/app/list_page/quan_ly_kenh_truyen_thong/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  ThumbsUp,
  Youtube,
  MessagesSquare,
  ShieldCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Tận dụng ảnh sẵn có trong repo để tránh lỗi domain
import imc1 from "@/app/image/ktt/ktt01.jpg";
import imc2 from "@/app/image/ktt/ktt02.jpg";
import imc3 from "@/app/image/ktt/ktt03.jpg";
import imcNguoi from "@/app/image/ktt/ktt04.jpg";
import lapKeHoach from "@/app/image/ktt/ktt05.jpg";

/* ---------------- helpers ---------------- */
const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-28">{children}</section>
);

const H2 = ({ children, k }: { children: React.ReactNode; k?: string }) => (
  <div className="mb-6">
    {k && <div className="mb-2 text-xs font-semibold tracking-widest text-amber-600">{k}</div>}
    <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
      {children}
      <>
        <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
        <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
      </>
    </h2>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2.5 py-1 rounded-full text-xs bg-white/20 text-white/90 border border-white/30">
    {children}
  </span>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="pl-2 relative before:content-['•'] before:absolute before:-left-3 before:text-amber-500">
    {children}
  </li>
);

const Feature = ({
  icon: Icon,
  title,
  desc,
}: { icon: any; title: string; desc: string }) => (
  <div className="h-full p-5 overflow-hidden transition bg-white border group rounded-xl hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="p-2 border rounded-lg bg-amber-50 shrink-0">
        <Icon className="size-5 text-amber-600" />
      </div>
      <h3 className="font-semibold leading-tight">{title}</h3>
    </div>
    <p className="pr-1 mt-2 text-sm leading-6 break-words whitespace-normal text-zinc-600 hyphens-auto">
      {desc}
    </p>
    <div className="inline-flex items-center mt-3 text-xs text-zinc-500 group-hover:text-zinc-700">
      Tìm hiểu thêm <ChevronRight className="ml-1 size-4" />
    </div>
  </div>
);

/* ---------------- Carousel (ô vuông bên phải) ---------------- */
type Slide = { img: any; title: string; desc: string };

function SquareCarousel({ slides, interval = 2000 }: { slides: Slide[]; interval?: number }) {
  const [idx, setIdx] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const hoverRef = React.useRef(false);

  const next = React.useCallback(() => setIdx((i) => (i + 1) % slides.length), [slides.length]);
  const prev = React.useCallback(() => setIdx((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  React.useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!hoverRef.current) next();
    }, interval);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [next, interval]);

  return (
    <div
      className="relative w-full overflow-hidden border aspect-square rounded-xl group bg-zinc-50"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== idx}
        >
          <Image src={s.img} alt={s.title} fill className="object-cover" priority={i === 0} />
          {/* overlay caption: hover hiện nội dung */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="px-3 py-2 text-white rounded-lg bg-amber-500/90">
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="text-xs transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {s.desc}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute inline-flex items-center justify-center -translate-y-1/2 border rounded-full left-2 top-1/2 size-8 bg-white/90 hover:bg-white"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute inline-flex items-center justify-center -translate-y-1/2 border rounded-full right-2 top-1/2 size-8 bg-white/90 hover:bg-white"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* dots */}
      <div className="absolute left-0 right-0 flex items-center justify-center gap-2 bottom-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`size-2.5 rounded-full ${i === idx ? "bg-zinc-900" : "bg-white/70 border"} `}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Page() {
  const slides: Slide[] = [
    { img: imcNguoi, title: "", desc: "" },
    { img: imc2,     title: "", desc: "" },
    { img: imc3,     title: "",     desc: "" },
    { img: imc1,     title: "", desc: "" },
    { img: lapKeHoach, title: "",  desc: "" },
  ];

  return (
    <SiteShell>
      {/* HERO */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>SLA phản hồi 15–30′</Chip>
              <Chip>Lịch nội dung 30 ngày</Chip>
              <Chip>Dashboard realtime</Chip>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,.2)]">
              QUẢN LÝ KÊNH TRUYỀN THÔNG
            </h1>
            <p className="max-w-full mt-2 overflow-hidden text-sm md:text-base text-white/90 md:max-w-none md:whitespace-nowrap text-ellipsis">
              Vận hành Fanpage, Youtube và các kênh social một cách **bài bản – đo lường – tối ưu liên tục**.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-12 lg:col-span-8">
          {/* 1. Tổng quan */}
          <Section id="tong-quan">
            <H2 k="PHẦN 1">Chúng tôi làm gì?</H2>
            <p className="leading-7 text-zinc-700">
              3BOW vận hành trọn gói các kênh truyền thông doanh nghiệp: lập kế hoạch nội dung,
              sản xuất đa định dạng, quản trị cộng đồng, chạy ads hỗ trợ tăng trưởng, và báo cáo KPI rõ ràng.
              Mục tiêu là **đúng khách hàng – đúng thông điệp – đúng thời điểm**.
            </p>
            <ul className="mt-4 space-y-2 text-zinc-700">
              <Bullet>Lịch nội dung 2–4 tuần; bám tuyến & chiến dịch.</Bullet>
              <Bullet>Template phối – đăng – đo lường nhất quán giữa các kênh.</Bullet>
              <Bullet>Chu trình review & A/B test tuần → tối ưu ER/CTR/CPA.</Bullet>
            </ul>
          </Section>

          {/* 2. Hạng mục dịch vụ */}
          <Section id="hang-muc">
            <H2 k="PHẦN 2">Các hạng mục chính</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <Feature icon={ThumbsUp} title="Quản trị Fanpage"
                desc="Kế hoạch nội dung, viết bài, thiết kế KV, đăng lịch, phản hồi bình luận/inbox theo SLA." />
              <Feature icon={Youtube} title="Quản trị Youtube"
                desc="Kịch bản video, quay/dựng cơ bản, tối ưu SEO (title, tags, chapters), tối ưu watchtime." />
              <Feature icon={MessagesSquare} title="Seeding & Cộng đồng"
                desc="Seeding group/diễn đàn hợp lệ, quản lý mini-game, KOL/KOC UGC." />
              <Feature icon={BarChart3} title="Ads hỗ trợ tăng trưởng"
                desc="Meta/Google/TikTok; mục tiêu Reach, Traffic, Lead, Sales; gắn UTM & chuyển đổi." />
              <Feature icon={ShieldCheck} title="Moderation & Khủng hoảng nhỏ"
                desc="Bộ kịch bản phản hồi, phân loại sentiment, escalate rule nhiều cấp." />
              <Feature icon={CalendarClock} title="Báo cáo định kỳ"
                desc="Dashboard realtime; báo cáo tuần/tháng; khuyến nghị tối ưu & roadmap quý." />
            </div>
          </Section>

          {/* 3. Quy trình */}
          <Section id="quy-trinh">
            <H2 k="PHẦN 3">Quy trình vận hành</H2>
            <ol className="grid gap-4 md:grid-cols-2">
              {[
                "Onboarding & Audit: hiện trạng kênh, persona, mục tiêu.",
                "Plan: content calendar, guideline visual & tone of voice.",
                "Produce: viết bài, thiết kế/biên tập, chuẩn SEO social.",
                "Publish: lịch đăng đa kênh, cross-posting có kiểm soát.",
                "Engage: phản hồi, seeding, xử lý phàn nàn theo SLA.",
                "Measure & Optimize: A/B test, báo cáo tuần/tháng.",
              ].map((t, i) => (
                <li key={i} className="relative py-4 pl-10 bg-white border rounded-xl">
                  <span className="absolute inline-flex items-center justify-center text-xs font-bold text-white rounded-full left-3 top-4 size-6 bg-amber-500">
                    {i + 1}
                  </span>
                  <p className="text-zinc-700">{t}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* 4. Cam kết */}
          <Section id="cam-ket">
            <H2 k="PHẦN 4">Cam kết & chuẩn bàn giao</H2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feature icon={CheckCircle2} title="SLA rõ ràng"
                desc="Phản hồi bình luận/inbox trong 15–30 phút khung giờ 8h–22h (có thể mở rộng theo hợp đồng)." />
              <Feature icon={Sparkles} title="Bộ tài liệu đầy đủ"
                desc="Calendar, guideline, bộ post template, báo cáo tuần/tháng & file nguồn thiết kế." />
            </div>
          </Section>
        </div>

        {/* SIDEBAR (ô vuông carousel + TOC + CTA) */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Ô vuông carousel */}
            <SquareCarousel slides={slides} interval={2000} />

            {/* TOC */}
            <nav className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Mục lục</p>
              <ul className="space-y-2 text-sm">
                {[
                  ["#tong-quan", "Chúng tôi làm gì?"],
                  ["#hang-muc", "Hạng mục dịch vụ"],
                  ["#quy-trinh", "Quy trình"],
                  ["#cam-ket", "Cam kết & bàn giao"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a className="hover:underline text-zinc-700" href={href as string}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA */}
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h3 className="m-0 text-lg font-bold">Cần đội ngũ quản trị kênh chuyên nghiệp?</h3>
              <p className="mt-2 text-sm text-zinc-700">
                Nhận demo lịch nội dung & dashboard mẫu trong 24h.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 text-white transition bg-black rounded-lg hover:opacity-90"
              >
                Nhận tư vấn miễn phí
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA cuối trang (giữ pattern headline gạch chân) */}
      <section className="bg-white border-t">
        <div className="max-w-6xl px-4 py-12 mx-auto">
          <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
            Tối ưu kênh ngay hôm nay
            <>
              <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
              <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
            </>
          </h2>
          <p className="max-w-3xl mt-2 text-zinc-600">
            Hãy để 3BOW đồng hành vận hành kênh social bền vững, có quy trình & số liệu minh bạch.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-5 py-2 mt-5 font-medium text-white transition bg-black rounded-lg hover:opacity-90"
          >
            Liên hệ đội ngũ 3BOW
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
