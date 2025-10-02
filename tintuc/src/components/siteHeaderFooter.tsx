//src/components/siteHeaderFooter.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, Grid3X3, Heart, ChevronDown, Menu, X } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import logo3bow2 from "@/app/image/logo3bow-removebg-preview.png";

import { Facebook, Youtube } from "lucide-react";
import type { SVGProps } from "react";

// Fallback TikTok icon (đồng bộ style với Lucide)
function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* logo tiktok đơn giản dạng note + hook */}
      <path d="M14 3v10.5a4.5 4.5 0 1 1-3-4.243" />
      <path d="M14 6a5 5 0 0 0 5 5" />
    </svg>
  );
}

const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com/", Icon: Facebook },
  { name: "TikTok", href: "https://tiktok.com/", Icon: TiktokIcon },
  { name: "YouTube", href: "https://youtube.com/", Icon: Youtube },
];
const mont = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-mont",
});

// ====== ROUTE MAP CHO DỊCH VỤ ======
const SERVICES: { label: string; href: string }[] = [
  { label: "Truyền thông IMC", href: "/list_page/imc" },
  // { label: "Tổ chức sự kiện", href: "/list_page/su_kien" },
  { label: "Thiết kế thương hiệu", href: "/list_page/thiet_ke_thuong_hieu" },
  { label: "Thiết kế Website", href: "/list_page/website" },
  { label: "Quản trị Fanpage", href: "/list_page/quan_ly_kenh_truyen_thong" },
  { label: "Sản xuất Video", href: "/list_page/video" },
  { label: "Seeding / KOLs", href: "#" },
  { label: "Quảng cáo FB/Google", href: "#" },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className={`${mont.className} relative`}>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [mobileSvcOpen, setMobileSvcOpen] = useState(false);

  // refs
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const searchBtnRef = useRef<HTMLButtonElement | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng search khi click ngoài (desktop)
  useEffect(() => {
    if (!openSearch) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      const insideWrap =
        !!searchWrapRef.current && searchWrapRef.current.contains(t);
      const onBtn = !!searchBtnRef.current && searchBtnRef.current.contains(t);
      if (!insideWrap && !onBtn) setOpenSearch(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openSearch]);

  // Không để search & menu chồng nhau
  useEffect(() => {
    if (openMobile) setOpenSearch(false);
  }, [openMobile]);
  useEffect(() => {
    if (openSearch) setOpenMobile(false);
  }, [openSearch]);

  // Hover control for services
  const keepOpen = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenServices(true);
  };
  const softClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenServices(false), 160);
  };

  // ===== Brand ticker text =====
  const TICKER = [
    "Cam kết hiệu suất & minh bạch",
    "300+ dự án triển khai thành công",
    "Hỗ trợ 24/7 — luôn đồng hành",
    "Kế hoạch dựa trên dữ liệu thực",
    "Bảo mật thông tin khách hàng",
    "Không phí ẩn – hợp đồng rõ ràng",
    "Báo cáo KPI realtime trên dashboard",
    "Đội ngũ senior 7+ năm kinh nghiệm",
    "Đối tác Meta/Google được chứng nhận",
    "Ý tưởng sáng tạo, hiệu quả đo lường",
    "Quy trình Agile, bám sát deadline",
    "Tư vấn & audit hiện trạng miễn phí",
    "Nghiên cứu thị trường in-house",
    "Tối ưu ngân sách theo ROAS/CPA",
    "Bảo hành chiến dịch sau triển khai",
    "Tỉ lệ hài lòng 98% từ khách hàng",
  ];
  const [tickA, setTickA] = useState<string[]>([]);
  const [tickB, setTickB] = useState<string[]>([]);
  useEffect(() => {
    const shuffled = [...TICKER].sort(() => Math.random() - 0.5);
    const off = Math.ceil(shuffled.length / 2);
    const b = [...shuffled.slice(off), ...shuffled.slice(0, off)];
    setTickA(shuffled);
    setTickB(b);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-[70] transition-all duration-300",
        scrolled
          ? "bg-white/95 text-gray-900 shadow-md backdrop-blur"
          : "bg-transparent text-white",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[72px] md:h-[88px] max-w-7xl items-center justify-between px-3 md:px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 min-w-[180px] md:min-w-[220px]"
        >
          <Image
            src={logo3bow2}
            alt="3BOW Digital"
            priority
            sizes="(min-width:1536px) 360px, (min-width:1280px) 320px, (min-width:1024px) 300px, (min-width:768px) 240px, 200px"
            className="shrink-0 select-none object-contain w-auto h-[60px] sm:h-[70px] md:h-[100px] lg:h-[130px]"
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-9 text-[12px] xl:text-[13px] font-bold uppercase tracking-wide">
            <li>
              <Link className="nav-link" href="/about">
                Về chúng tôi
              </Link>
            </li>

            {/* Dịch vụ */}
            <li className="relative">
              <button
                className="menu-link"
                aria-haspopup="true"
                aria-expanded={openServices}
                aria-controls="services-popover"
                onMouseEnter={keepOpen}
                onMouseLeave={softClose}
                onFocus={keepOpen}
                onBlur={softClose}
              >
                <span>Dịch vụ</span>
                <Heart className="text-red-500 icon" />
                <ChevronDown className="icon" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[88vw] max-w-[620px] z-[90]">
                <div
                  id="services-popover"
                  className={[
                    "origin-top rounded-2xl border border-black/5 bg-white/95 p-4 sm:p-5 text-gray-900 shadow-xl backdrop-blur transition duration-200",
                    openServices
                      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
                      : "pointer-events-none opacity-0 -translate-y-2 scale-[0.98]",
                  ].join(" ")}
                  onMouseEnter={keepOpen}
                  onMouseLeave={softClose}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[13px] font-semibold normal-case">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="px-3 py-2 rounded-lg hover:bg-black/5"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <Link className="nav-link" href="/portfolio">
                Portfolio
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/security">
                BẢO MẬT
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/news">
                Blog
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/contact">
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side (desktop) */}
        <div className="items-center hidden gap-2 lg:flex xl:gap-3">
          <div
            ref={searchWrapRef}
            className="relative flex items-center transition-all duration-300"
            style={{ width: openSearch ? 280 : 0 }}
          >
            <input
              aria-label="Search"
              placeholder="Tìm kiếm…"
              className={[
                "absolute right-10 h-10 w-[260px] rounded-full px-4 pr-10",
                "bg-white/95 text-gray-900 placeholder:text-gray-500 shadow-sm ring-1 ring-black/10",
                "transition-all duration-300",
                openSearch ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            />
          </div>
          <button
            ref={searchBtnRef}
            className={`icon-btn ${
              openSearch ? "ring-2 ring-blue-400/50" : ""
            }`}
            aria-label="Search"
            onClick={() => setOpenSearch((v) => !v)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button className="icon-btn" aria-label="Apps">
            <Grid3X3 className="w-5 h-5" />
          </button>
        </div>

        {/* Right side (mobile) */}
        <div className="flex lg:hidden items-center gap-1.5">
          <button
            ref={searchBtnRef}
            className={`icon-btn ${
              openSearch ? "ring-2 ring-blue-400/50" : ""
            }`}
            aria-label="Search"
            onClick={() => setOpenSearch((v) => !v)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2"
            onClick={() => setOpenMobile(true)}
            aria-label="Open menu"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* ===== Brand Ticker ===== */}
      <div
        className={`relative z-[40] border-y border-white/10 ${
          scrolled
            ? "bg-gradient-to-r from-emerald-600 to-teal-600"
            : "bg-black/35"
        }`}
      >
        <div className="ticker">
          <div className="ticker-fade left" />
          <div className="ticker-track">
            <ul className="ticker-list">
              {tickA.map((t, i) => (
                <li key={`a-${i}`}>
                  <span className="ticker-pill">{t}</span>
                </li>
              ))}
            </ul>
            <ul className="ticker-list">
              {tickB.map((t, i) => (
                <li key={`b-${i}`}>
                  <span className="ticker-pill">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ticker-fade right" />
        </div>
      </div>

      {/* Mobile search */}
      <div
        className={[
          "lg:hidden fixed left-0 right-0 z-[68] px-3 transition-all duration-300",
          openSearch
            ? "top-[72px] opacity-100"
            : "top-0 -translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div ref={mobileSearchRef} className="py-2 mx-auto max-w-7xl">
          <div className="text-white shadow-md rounded-xl bg-neutral-800/90 backdrop-blur ring-1 ring-white/10">
            <input
              aria-label="Search mobile"
              placeholder="Tìm kiếm..."
              className="w-full px-4 bg-transparent h-11 placeholder:text-neutral-300 focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Overlay đóng search khi tap ngoài */}
      {openSearch && (
        <button
          aria-label="Close search overlay"
          className="fixed inset-0 z-[66] bg-transparent lg:hidden"
          onClick={() => setOpenSearch(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-[69] w-[86%] max-w-[380px] transform text-white transition-transform duration-300 lg:hidden ${
          openMobile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/95 to-neutral-900/85 backdrop-blur-xl" />
        <div className="relative flex flex-col h-full">
          <div
            className="flex items-center justify-between px-4"
            style={{ height: 72 }}
          >
            <span className="text-lg font-bold">Menu</span>
            <button
              onClick={() => setOpenMobile(false)}
              className="p-2 transition rounded-lg hover:bg-white/10 active:scale-95"
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <nav className="px-3 pb-6 space-y-2 overflow-y-auto text-base">
            <Link
              href="/about"
              onClick={() => setOpenMobile(false)}
              className="block w-full mobile-item"
            >
              Về chúng tôi
            </Link>

            {/* Services accordion */}
            <button
              className="flex items-center justify-between block w-full border mobile-item rounded-xl border-white/10"
              onClick={() => setMobileSvcOpen((v) => !v)}
              aria-expanded={mobileSvcOpen}
            >
              <span className="font-semibold">
                Dịch vụ <span className="text-red-400">♥</span>
              </span>
              <ChevronDown
                className={`h-5 w-5 transition ${
                  mobileSvcOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                mobileSvcOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-3 pl-3 border-l border-white/10 space-y-1.5">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpenMobile(false)}
                      className="block w-full mobile-sub"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/portfolio"
              onClick={() => setOpenMobile(false)}
              className="block w-full mobile-item"
            >
              Portfolio
            </Link>
            <Link
              href="/security"
              onClick={() => setOpenMobile(false)}
              className="block w-full mobile-item"
            >
              BẢO MẬT
            </Link>
            <Link
              href="/news"
              onClick={() => setOpenMobile(false)}
              className="block w-full mobile-item"
            >
              Blog
            </Link>
            <div className="pt-2" />
            <Link
              href="/contact"
              onClick={() => setOpenMobile(false)}
              className="mx-1 block text-center rounded-full bg-white text-black font-semibold py-3 hover:bg-neutral-200 active:scale-[.99] transition"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay cho menu */}
      {openMobile && (
        <button
          className="fixed inset-0 z-[68] bg-black/40 lg:hidden"
          onClick={() => setOpenMobile(false)}
          aria-label="Close overlay"
        />
      )}

      {/* Global CSS */}
      <style jsx global>{`
        /* Links (desktop) */
        .nav-link {
          position: relative;
          display: inline-block;
          padding: 10px 0;
        }
        .nav-link:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background: currentColor;
          opacity: 0.9;
          transition: width 0.22s ease;
        }
        .nav-link:hover:after {
          width: 100%;
        }
        /* Button Dịch vụ (desktop) */
        .menu-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 10px 0;
          white-space: nowrap;
          line-height: 1;
        }
        .menu-link .icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .menu-link:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background: currentColor;
          opacity: 0.9;
          transition: width 0.22s ease;
        }
        .menu-link:hover:after {
          width: 100%;
        }
        /* Icon buttons */
        .icon-btn {
          height: 40px;
          width: 40px;
          display: grid;
          place-items: center;
          border-radius: 9999px;
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }
        .icon-btn:hover {
          background: rgba(0, 0, 0, 0.08);
        }
        .icon-btn:active {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25) inset;
        }
        /* Mobile items */
        .mobile-item {
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .mobile-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .mobile-sub {
          padding: 0.65rem 0.875rem;
          border-radius: 0.625rem;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .mobile-sub:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* ===== Ticker styles ===== */
        .ticker {
          position: relative;
          overflow: hidden;
        }
        .ticker-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: ticker 28s linear infinite;
        }
        .ticker-list {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 0;
        }
        .ticker-pill {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.18);
          color: white;
          font-size: 0.75rem;
          white-space: nowrap;
        }
        .ticker-fade.left,
        .ticker-fade.right {
          position: absolute;
          top: 0;
          width: 60px;
          height: 100%;
          pointer-events: none;
        }
        .ticker-fade.left {
          left: 0;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.25), transparent);
        }
        .ticker-fade.right {
          right: 0;
          background: linear-gradient(270deg, rgba(0, 0, 0, 0.25), transparent);
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </header>
  );
}

// function Footer() {
//   return (
//     <footer className="py-6 mt-20 text-sm text-gray-300 bg-gray-900">
//       <div className="flex flex-col items-center justify-between gap-4 px-4 mx-auto max-w-7xl md:flex-row">
//         <span>© 2025 3BOW Digital. All Rights Reserved.</span>
//         <div className="flex items-center gap-4">
//           <span>Theo dõi:</span>
//           <a href="https://facebook.com" target="_blank" className="px-2 py-1 rounded hover:bg-white/10">Facebook</a>
//         </div>
//       </div>
//     </footer>
//   );
// }

function Footer() {
  return (
    <footer className="py-6 mt-20 text-sm text-gray-300 bg-gray-900">
      <div className="flex flex-col items-center justify-between gap-4 px-4 mx-auto max-w-7xl md:flex-row">
        <span>© 2025 3BOW Digital. All Rights Reserved.</span>

        <div className="flex items-center gap-3">
          <span className="text-gray-300/90">Theo dõi:</span>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ name, href, Icon }) => (
              <li key={name}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="inline-flex items-center justify-center transition rounded-full group h-9 w-9 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                >
                  <Icon className="w-5 h-5 transition text-white/90 group-hover:text-white" />
                  <span className="sr-only">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
