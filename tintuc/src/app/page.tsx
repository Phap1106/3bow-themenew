//app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";

/* Ảnh ≥ 2560x1440 để sắc nét (tạm dùng làm placeholder demo) */
import imgCam from "@/app/image/logo_nen/dovang.jpg";
import imgVang from "@/app/image/logo_nen/vangtim.jpg";
import imgXanhdam from "@/app/image/logo_nen/xanhtrang.jpg";
import imgMarketing from "@/app/image/logo_nen/hong.jpg";
import imgTim from "@/app/image/logo_nen/tim2.jpg";
import imgWelcome from "@/app/image/h3_slide/h3-slide-1-img-3.png";

//logo doi tac
import imgLogo1 from "@/app/image/logo_doitac/brg.png";
import imgLogo2 from "@/app/image/logo_doitac/cd.jpg";
import imgLogo3 from "@/app/image/logo_doitac/cd.jpg";
import imgLogo4 from "@/app/image/logo_doitac/cmc.png";
import imgLogo5 from "@/app/image/logo_doitac/d.png";
import imgLogo6 from "@/app/image/logo_doitac/dp.png";
import imgLogo7 from "@/app/image/logo_doitac/evl.jpg";
import imgLogo8 from "@/app/image/logo_doitac/gm.jpg";
import imgLogo9 from "@/app/image/logo_doitac/hc.png";
import imgLogo10 from "@/app/image/logo_doitac/lg.png";
import imgLogo11 from "@/app/image/logo_doitac/misu.png";
import imgLogo12 from "@/app/image/logo_doitac/pana.png";
import imgLogo13 from "@/app/image/logo_doitac/san.jpg";
import imgLogo14 from "@/app/image/logo_doitac/sm.png";
import imgLogo15 from "@/app/image/logo_doitac/ss.png";
import imgLogo16 from "@/app/image/logo_doitac/tko.png";
import imgLogo17 from "@/app/image/logo_doitac/vtb.png";
import imgLogo18 from "@/app/image/logo_doitac/w.png";
import imgLogo19 from "@/app/image/logo_doitac/wd.jpg";
import imgLogo20 from "@/app/image/logo_doitac/lion.jpg";

//dự án tiêu biểu
import imgDuAn1 from "@/app/image/logo_duantieubieu/cafe.jpg";
import imgDuAn2 from "@/app/image/logo_duantieubieu/cnbuy.jpg";
import imgDuAn4 from "@/app/image/logo_duantieubieu/doao.jpg";
import imgDuAn3 from "@/app/image/logo_duantieubieu/fbads.jpg";
import imgDuAn6 from "@/app/image/logo_duantieubieu/food.jpg";
import imgDuAn5 from "@/app/image/logo_duantieubieu/vali.jpg";



import bg1 from "@/app/image/slide_hero/home-3-background-img-4.jpg";
import bg2 from "@/app/image/slide_hero/home-3-background-img-5.jpg";
import bg3 from "@/app/image/slide_hero/home-3-background-img-6.jpg";

import deco1 from "@/app/image/slide_hero/h3-slide-1-img-2-2.png"; // khung ảnh lệch + vòng tròn
import deco2 from "@/app/image/slide_hero/h3-slide-2.png";        // mockup điện thoại
import deco3 from "@/app/image/slide_hero/h3-slide-3-img-2.png";  // minh hoạ khác



/* ===== SLIDER ===== */
type Slide = {
  bg: StaticImageData;
  title: string;
  accent: string;
  titleColor: string;
  accentGradient: [string, string];
    deco?: StaticImageData;         // ảnh minh hoạ chèn lên
  decoClass?: string;             // vị trí/kích thước mỗi ảnh
};

const SLIDES: Slide[] = [
  {
    bg: bg1,
    title: "WE ARE DIGITAL &",
    accent: "CREATIVE AGENCY",
    titleColor: "#FFFFFF",
    accentGradient: ["#ffffff", "#60a5fa"],
    deco: deco1,
    // Ảnh nghiêng ở giữa: mobile to, desktop ~44vw, nằm giữa, lệch -8deg
    decoClass:
      "left-1/2 -translate-x-1/2 bottom-[10%] md:bottom-[12%] " +
      "w-[86vw] md:w-[44vw] rotate-[-8deg]"
  },
  {
    bg: bg2,
    title: "DIGITAL",
    accent: "MARKETING",
    titleColor: "#F8FAFC",
    accentGradient: ["#fde68a", "#f472b6"],
    deco: deco2,
    // Mockup điện thoại: đứng bên phải, mobile ~62vw, desktop ~32vw
    decoClass:
      "right-[6%] md:right-[10%] bottom-[6%] md:bottom-[10%] " +
      "w-[62vw] md:w-[32vw]"
  },
  {
    bg: bg3,
    title: "EVENTS &",
    accent: "ACTIVATION",
    titleColor: "#FFFFFF",
    accentGradient: ["#a7f3d0", "#34d399"],
    deco: deco3,
    // Minh hoạ bên trái, mobile ~74vw, desktop ~40vw, nhích cao
    decoClass:
      "left-[6%] md:left-[12%] bottom-[10%] md:bottom-[14%] " +
      "w-[74vw] md:w-[40vw]"
  },
];

/* ===== DATA ===== */
type Service = {
  title: string;
  desc: string;
  href: string;
  color: string; // bg color class
};

const SERVICES: Service[] = [
  {
    title: "Truyền thông Marketing IMC",
    desc: "Lập kế hoạch & triển khai truyền thông tích hợp đa kênh, đo lường KPI rõ ràng.",
    href: "/list_page/imc",
    color: "bg-teal-800",
  },
  {
    title: "Tổ chức sự kiện",
    desc: "Event/Activation/Booth với quy trình an toàn – sáng tạo – đúng timeline.",
    href: "#",
    color: "bg-amber-400",
  },
  {
    title: "Thiết kế nhận diện thương hiệu",
    desc: "Logo, guideline, key visual, ấn phẩm… đồng bộ & dễ ứng dụng thực tế.",
    href: "/list_page/thiet_ke_thuong_hieu",
    color: "bg-rose-800",
  },
  {
    title: "Thiết kế Website",
    desc: "Website chuẩn SEO/Performance, UI/UX hiện đại, tích hợp phân tích dữ liệu.",
    href: "/list_page/website",
    color: "bg-amber-400",
  },
  {
    title: "Quản trị Fanpage",
    desc: "Nội dung, lịch đăng, xử lý comment/inbox và tối ưu chuyển đổi.",
    href: "/list_page/quan_ly_kenh_truyen_thong",
    color: "bg-amber-400",
  },
  {
    title: "Sản xuất Video",
    desc: "TVC/viral/short-form: tiền kỳ – hậu kỳ – animation theo brief mục tiêu.",
    href: "/list_page/san-xuat-video",
    color: "bg-rose-800",
  },
  {
    title: "Dịch vụ Seeding",
    desc: "Seeding đa nền tảng đúng ngữ cảnh, đảm bảo an toàn và hiệu quả.",
    href: "/list_page/seeding",
    color: "bg-amber-400",
  },
  {
    title: "Quảng cáo đa nền tảng",
    desc: "Facebook/Google/TikTok Ads… tối ưu CPA/ROAS theo phễu dữ liệu.",
    href: "/list_page/performance-ads",
    color: "bg-teal-800",
  },
];
// ===== DỰ ÁN TIÊU BIỂU =====
type Project = {
  title: string;
  cat: string;
  href: string;
  cover: StaticImageData;
};

// Dùng đúng ảnh bạn đã import ở trên
const PROJECTS: Project[] = [
  {
    title: "Coffee House – Local Branding",
    cat: "Branding • Social",
    href: "/portfolio/coffee-house",
    cover: imgDuAn1,
  },
  {
    title: "CNBuy – Performance Ads",
    cat: "E-commerce • Ads",
    href: "/portfolio/cnbuy-performance",
    cover: imgDuAn2,
  },
  {
    title: "Đồ áo – Visual Identity",
    cat: "Branding • KV",
    href: "/portfolio/doao-identity",
    cover: imgDuAn4,
  },
  {
    title: "Facebook Ads Campaign",
    cat: "Performance • Optimization",
    href: "/portfolio/facebook-ads-campaign",
    cover: imgDuAn3,
  },
  {
    title: "Food Brand Shooting",
    cat: "Content • Photo/Video",
    href: "/portfolio/food-shooting",
    cover: imgDuAn6,
  },
  {
    title: "Vali Launch Campaign",
    cat: "Launch • KOL/KOC",
    href: "/portfolio/vali-launch",
    cover: imgDuAn5,
  },
];

type ClientLogo = {
  alt: string;
  src: StaticImageData; // thay bằng import ảnh 147x147 của bạn
};

const CLIENTS: ClientLogo[] = [
  { alt: "BRG Group", src: imgLogo1 },
  { alt: "Cường Duyên Ceramics", src: imgLogo2 },
  { alt: "Cường Duyên Ceramics (Alt)", src: imgLogo3 }, // nếu không cần trùng, có thể bỏ dòng này
  { alt: "CMC CMS", src: imgLogo4 },
  { alt: "D’Capitale", src: imgLogo5 },
  { alt: "Đạt Phương", src: imgLogo6 },
  { alt: "Eiviva", src: imgLogo7 },
  { alt: "Gangnam", src: imgLogo8 },
  { alt: "HC", src: imgLogo9 },
  { alt: "LG", src: imgLogo10 },
  { alt: "Mitsubishi Electric", src: imgLogo11 },
  { alt: "Panasonic", src: imgLogo12 },
  { alt: "SanDisk", src: imgLogo13 },
  { alt: "Vinhomes Smart City", src: imgLogo14 },
  { alt: "Samsung", src: imgLogo15 },
  { alt: "Tokyo Deli", src: imgLogo16 },
  { alt: "VietinBank", src: imgLogo17 },
  { alt: "Western Digital", src: imgLogo18 },
  { alt: "Vinhomes", src: imgLogo19 },
  { alt: "Lion Group", src: imgLogo20 },
];

// tách chuỗi thành từng từ, giữ khoảng trắng bằng &nbsp;
const renderWords = (str: string, extraClass = "") => {
  const parts = str.split(" ");
  return parts.map((w, i) => (
    <span key={i} className={`hero-word ${extraClass}`}>
      {w}
      {i < parts.length - 1 && "\u00A0"}
    </span>
  ));
};

export default function Page() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setTimeout(
      () => setIdx((i) => (i + 1) % SLIDES.length),
      6500
    );
  };
  const stopAuto = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const prev = () => {
    // ⬅️ sửa
    stopAuto();
    setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    // ⬅️ sửa
    stopAuto();
    setIdx((i) => (i + 1) % SLIDES.length);
  };

  const slide = SLIDES[idx];

  return (
    <SiteShell>
      {/* ================= HERO ================= */}
      <section
        className="relative min-h-[100svh] overflow-hidden group"
        onMouseEnter={() => {
          stopAuto();
        }}
        onMouseLeave={() => {
          startAuto();
        }}
      >
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <Image
            key={i}
            src={s.bg}
            alt={`slide-${i}`}
            fill
            priority={i === 0}
            placeholder="blur"
            quality={100}
            sizes="100vw"
            // ⬇️ đổi dòng className
            className={`absolute inset-0 object-cover object-center transition-opacity duration-1000 ${
              i === idx ? "opacity-100 animate-kenburns" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 pointer-events-none bg-black/10" />

       {/* ⬇️ Ảnh 'welcome' mờ, ẩn sau H1 */}
       <div className="hero-welcome-img">
  <Image src={imgWelcome} alt="welcome" priority sizes="100vw" className="h-auto" />
</div>

{/* Ảnh minh hoạ theo từng slide */}
<div className="hero-illustration">
  {SLIDES.map((s, i) =>
    s.deco ? (
      <Image
        key={`deco-${i}`}
        src={s.deco}
        alt={`deco-${i}`}
        width={1800} height={1200}
        priority={i === 0}
        className={`absolute transition-opacity duration-700 ${s.decoClass} ${i === idx ? "opacity-100" : "opacity-0"}`}
      />
    ) : null
  )}
</div>

        {/* Title */}
        <div className="relative z-10 mx-auto flex h-[100svh] max-w-7xl items-center px-4">
          <div className="w-full md:w-[56%] mx-auto text-center md:text-left px-6 sm:px-10 md:px-0">
            {/* ⬇️ thay toàn bộ <h1>... </h1> */}
            <h1
              key={idx} // remount để animation vào lại mỗi khi đổi slide
              className="hero-title uppercase tracking-[-0.02em] drop-shadow-[0_6px_18px_rgba(0,0,0,.18)]"
            >
              <span
                className="hero-line block font-black text-[32px] sm:text-[42px] md:text-[64px] lg:text-[80px]"
                style={{ color: slide.titleColor, animationDelay: "120ms" }}
              >
                {renderWords(slide.title)}
              </span>

              <span
                className="hero-line hero-accent gradient-accent block font-black text-[32px] sm:text-[42px] md:text-[64px] lg:text-[80px]"
                style={
                  {
                    ["--from" as any]: slide.accentGradient[0],
                    ["--to" as any]: slide.accentGradient[1],
                    animationDelay: "260ms",
                  } as any
                }
              >
                {renderWords(slide.accent, "hero-word-accent")}
              </span>
            </h1>
          </div>
        </div>

        {/* Arrows */}
        <button
          aria-label="Prev"
          onClick={prev}
          className="hero-btn left-1.5 sm:left-3 md:left-4"
        >
          <span className="arrow-icon">‹</span>
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="hero-btn right-1.5 sm:right-3 md:right-4"
        >
          <span className="arrow-icon">›</span>
        </button>

        {/* Scroll Down */}
        <a
          href="#services"
          className="absolute z-10 -translate-x-1/2 bottom-8 left-1/2"
        >
          <div className="scroll-badge">Scroll Down</div>
          <svg
            className="w-5 h-5 mx-auto mt-2 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </a>
      </section>

      {/* ================= DỊCH VỤ ================= */}
      <section
        id="services"
        className="scroll-mt-[90px] md:scroll-mt-[110px] bg-white py-16 md:py-20"
      >
        <div className="px-4 mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="tracking-[0.2em] text-sm text-gray-500">
              DỊCH VỤ MARKETING TRỌN GÓI
            </p>
            <h2
              className="section-title"
              style={{ ["--accent" as any]: "#14b8a6" /* teal-500 */ }}
            >
              Astar Marketing
            </h2>
            <p className="mt-4 text-gray-600">
              Chúng tôi cung cấp các giải pháp online/offline phù hợp ngân sách,
              đội ngũ đa kinh nghiệm và quy trình đo lường minh bạch.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl ${s.color} text-white aspect-square flex items-center justify-center px-6`}
              >
                {/* Title center */}
                <h3 className="text-2xl font-extrabold leading-snug text-center">
                  {s.title}
                </h3>

                {/* Hover overlay (desktop) */}
                <div className="absolute inset-0 hidden p-6 transition-opacity opacity-0 md:flex rounded-2xl bg-black/55 backdrop-blur-sm group-hover:opacity-100">
                  <div className="m-auto text-center">
                    <p className="text-base/6">{s.desc}</p>
                    <Link
                      href={s.href}
                      className="inline-flex items-center justify-center h-10 px-4 mt-4 font-medium text-gray-900 rounded-md bg-white/90 hover:bg-white"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>

                {/* Mobile content (luôn hiện) */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:hidden">
                  <div className="px-4 py-3 rounded-xl bg-black/40 backdrop-blur">
                    <p className="text-sm/6">{s.desc}</p>
                    <Link
                      href={s.href}
                      className="inline-flex items-center justify-center px-3 mt-3 text-sm font-medium text-gray-900 rounded-md h-9 bg-white/95"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DỰ ÁN TIÊU BIỂU ================= */}
      <section id="portfolio" className="py-16 bg-gray-50 md:py-20">
        {/* Header */}
        <div className="max-w-3xl px-4 mx-auto text-center">
          <p className="tracking-[0.2em] text-sm text-gray-500">
            GIẢI PHÁP MARKETING TOÀN DIỆN
          </p>
          <h2
            className="section-title"
            style={{ ["--accent" as any]: "#6366f1" }}
          >
            Dự án tiêu biểu
          </h2>
          <p className="mt-4 text-gray-600">
            Những case đã triển khai thành công, mang lại sự tin tưởng từ khách
            hàng.
          </p>
        </div>

        {/* Desktop/Tablet ≥ md: 1 hàng 4 ảnh, full-bleed rộng */}
        <div className="hidden mt-10 md:block bleed">
          <div className="mx-auto max-w-[1500px] px-4">
            <div className="grid grid-cols-4 gap-6">
              {PROJECTS.slice(0, 4).map((p, i) => (
                <Link
                  key={i}
                  href={p.href}
                  className="relative block overflow-hidden group rounded-2xl"
                >
                  <div className="aspect-[16/10] w-full">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      priority={i < 2}
                      sizes="(min-width:1024px) 24vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>

                  {/* overlay on hover */}
                  <div className="absolute inset-0 flex items-end transition-opacity opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100">
                    <div className="w-full p-5 text-white">
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="text-sm opacity-90">{p.cat}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile < md: slider ngang 4 ảnh, snap, gọn – tránh quá nhiều ảnh */}
        <div className="mt-8 md:hidden">
          <div className="flex gap-4 px-3 -mx-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {PROJECTS.slice(0, 4).map((p, i) => (
              <Link
                key={i}
                href={p.href}
                className="relative shrink-0 w-[82%] snap-start rounded-2xl overflow-hidden"
              >
                <div className="aspect-[16/10] w-full">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    priority={i < 2}
                    sizes="80vw"
                    className="object-cover"
                  />
                </div>

                {/* caption nhẹ trên ảnh để người dùng biết nội dung */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-base font-semibold leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs opacity-90">{p.cat}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA xem thêm */}
        <div className="mt-8 text-center">
          <Link href="/portfolio" className="btn btn-secondary btn-raise">
            Xem tất cả dự án
          </Link>
        </div>
      </section>

      {/* ================= KHÁCH HÀNG ================= */}
      <section id="clients" className="py-16 bg-white md:py-20">
        {/* Header vẫn giữ trong container trung tâm */}
        <div className="px-4 mx-auto max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="tracking-[0.2em] text-sm text-gray-500">
              KHÁCH HÀNG TIÊU BIỂU
            </p>
            <h2
              className="section-title"
              style={{ ["--accent" as any]: "#f59e0b" /* amber-500 */ }}
            >
              Khách hàng của chúng tôi
            </h2>
            <p className="mt-4 text-gray-600">
              Cảm ơn Quý khách hàng đã tin tưởng sử dụng dịch vụ của chúng tôi!
            </p>
          </div>
        </div>

        {/* Hàng logo TRÀN MÀN HÌNH */}
        <div className="bleed">
          <div className="mx-auto max-w-[1800px] px-4 md:px-8">
            <div className="grid grid-cols-2 place-items-center gap-x-10 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {CLIENTS.map((c, i) => (
                <div
                  key={i}
                  className="w-[180px] h-[120px] flex items-center justify-center p-2"
                  title={c.alt}
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={180}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                    priority={i < 5}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
