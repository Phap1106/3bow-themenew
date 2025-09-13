"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import bowImg from "@/app/image/logo3bow.jpg";

// icons
import {
  Phone,
  Mail,
  MessageCircle,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Info,
  Users,
  Shield,
  Search,
  Target,
  Rocket,
  GraduationCap,
  BookOpenText,
  LineChart,
  Briefcase,
  FileBarChart,
  Facebook,
  Youtube,
Music ,
  ListTree, // ✅ thay cho Sitemap
} from "lucide-react";

import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
});
/* ===== Common ===== */
const crispTextStyle: CSSProperties = {
  WebkitFontSmoothing: "auto",
  MozOsxFontSmoothing: "auto",
  textRendering: "optimizeSpeed",
};

type Icon = React.ElementType;
type NavEntry = { href: string; label: string; icon?: Icon; badge?: string };
type NavGroup = {
  label: string;
  color: string; // text color class for icons
  items: NavEntry[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Giới thiệu",
    color: "text-rose-600",
    items: [
      { href: "/introduct", label: "Về 3BOW", icon: Info },
      { href: "careers", label: "Đội ngũ nhân sự", icon: Users }, // dùng Users thay UsersRound nếu cần
      { href: "/security", label: "Bảo mật", icon: Shield },
      // { href: "#", label: "Sơ đồ trang", icon: ListTree }, // ✅ đổi từ Sitemap -> ListTree
    ],
  },
  {
    label: "Dịch vụ",
    color: "text-violet-600",
    items: [
      { href: "/services/seo", label: "Dịch vụ SEO", icon: Search },
     {
    href: "/services/google-ads",
    label: "Dịch vụ Google Ads",
    icon: Target,       // biểu tượng search/ads
  },
  {
    href: "/services/facebook-ads",
    label: "Dịch vụ Facebook Ads",
    icon: Users,        // mạng xã hội / cộng đồng
  },
  {
    href: "/services/tiktok-ads",
    label: "Dịch vụ Tiktok Ads",
    icon: Music,        // TikTok vibe (nhạc/video)
  },
      // {
      //   href: "/services/digital-branding",
      //   label: "Digital Branding",
      //   icon: Rocket,
      // },
    ],
  },
  {
    label: "Đào tạo",
    color: "text-indigo-600",
    items: [
      { href: "/training/seo", label: "Khóa học SEO", icon: GraduationCap },
      {
        href: "/training/google-ads",
        label: "Khóa học Google Ads",
        icon: LineChart,
      },
      {
        href: "/training/content-seo",
        label: "Khóa học Content SEO",
        icon: BookOpenText,
      },
    ],
  },
  {
    label: "Tài nguyên",
    color: "text-emerald-600",
    items: [
      { href: "/resources/seo", label: "Kiến thức SEO", icon: Search },
      {
        href: "/resources/google-ads",
        label: "Kiến thức Google Ads",
        icon: Target,
      },
      { href: "/resources/digital", label: "Digital Marketing", icon: Rocket },
    ],
  },
];

const NAV_SINGLE: NavEntry[] = [
  { href: "/news", label: "Tin tức", icon: FileBarChart },
  { href: "/careers", label: "Tuyển dụng", icon: Briefcase },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative" style={crispTextStyle}>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

/* ================= Header ================= */
export function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [top, setTop] = useState<number>(64);

  useEffect(() => {
    const h = headerRef.current?.getBoundingClientRect().height ?? 64;
    setTop(h + 8);
    const onResize = () => {
      const hh = headerRef.current?.getBoundingClientRect().height ?? 64;
      setTop(hh + 8);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur border-zinc-200"
    >
      {/* Top bar */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 py-2 text-[13px] text-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="text-zinc-500">Dịch vụ:</span>
              <a
                href="#"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Phone className="h-3.5 w-3.5 text-violet-600" /> 093 3415 331
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Mail className="h-3.5 w-3.5 text-emerald-600" />{" "}
                contact@3bow.vn
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://zalo.me/"
                className="inline-flex items-center gap-2 rounded-full bg-[#1677ff] px-3 py-1.5 text-white font-medium hover:opacity-90"
              >
                <MessageCircle className="w-4 h-4" />
                Liên hệ qua Zalo
                <ChevronRight className="w-4 h-4 opacity-90" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="h-16 px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative overflow-hidden h-9 w-9 rounded-xl ring-1 ring-zinc-200">
              <Image
                src={bowImg}
                alt="3BOW"
                fill
                className="object-cover"
                priority
              />
            </span>
            <span className="font-semibold tracking-tight">3BOW DIGITAL</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 text-[15px]">
            {NAV_GROUPS.map((g) => (
              <div key={g.label} className="relative group/nav">
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-zinc-100"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${g.color} mr-1`}
                  />
                  {g.label}
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {/* Vùng đệm hover (bridge) để không bị tụt hover khi rê chuột */}
                <span className="absolute left-0 right-0 h-2 pointer-events-none top-full"></span>

                {/* Dropdown */}
                <div className="absolute left-0 z-40 invisible w-64 transition duration-150 translate-y-1 opacity-0 top-full group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 focus-within:visible focus-within:opacity-100 focus-within:translate-y-0">
                  {/* padding-top tạo khoảng cách bên trong, KHÔNG dùng margin để tránh hở hitbox */}
                  <div className="pt-2">
                    <div className="bg-white border shadow-lg rounded-xl border-zinc-200">
                      <ul className="py-2">
                        {g.items.map((it) => {
                          const Icon = it.icon;
                          return (
                            <li key={it.href}>
                              <Link
                                href={it.href}
                                className="flex items-center gap-2 px-3 py-2 text-[15px] hover:bg-zinc-100"
                              >
                                {Icon && (
                                  <Icon className={`h-4 w-4 ${g.color}`} />
                                )}
                                <span>{it.label}</span>
                                {it.badge && (
                                  <span className="ml-auto rounded-full bg-pink-50 px-2 text-[11px] font-medium text-pink-600 ring-1 ring-pink-200">
                                    {it.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {NAV_SINGLE.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-100"
                >
                  {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="items-center hidden gap-2 md:flex">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg border-zinc-300 hover:bg-zinc-100"
            >
              <Phone className="w-4 h-4 text-violet-600" />
              033 3415 331
            </a>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="#"
              className="inline-flex items-center justify-center border rounded-lg border-zinc-300 h-9 w-9"
              aria-label="Gọi"
            >
              <Phone className="w-4 h-4 text-violet-600" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-grid border rounded-lg h-9 w-9 place-items-center border-zinc-300"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed z-50 left-0 right-0 mx-auto w-[92vw] max-w-sm md:hidden"
            style={{ top }}
          >
            <div className="p-2 bg-white border shadow-xl rounded-2xl border-zinc-200">
              <nav className="grid">
                {NAV_GROUPS.map((g) => (
                  <details key={g.label} className="group">
                    <summary className="flex items-center justify-between px-3 py-2 list-none rounded-lg cursor-pointer hover:bg-zinc-100">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${g.color}`}
                        />
                        {g.label}
                      </span>
                      <ChevronDown className="w-4 h-4 transition opacity-70 group-open:rotate-180" />
                    </summary>
                    <ul className="mb-2">
                      {g.items.map((it) => {
                        const Icon = it.icon;
                        return (
                          <li key={it.href}>
                            <Link
                              href={it.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2 rounded-md px-4 py-2 text-[15px] hover:bg-zinc-100"
                            >
                              {Icon && (
                                <Icon className={`h-4 w-4 ${g.color}`} />
                              )}
                              {it.label}
                              {it.badge && (
                                <span className="ml-auto rounded-full bg-pink-50 px-2 text-[11px] font-medium text-pink-600 ring-1 ring-pink-200">
                                  {it.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))}
                {NAV_SINGLE.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-[15px] hover:bg-zinc-100 inline-flex items-center gap-2"
                    >
                      {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
                      {n.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="grid gap-2 mt-2">
                <a
                  href="https://zalo.me/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1677ff] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  <MessageCircle className="w-4 h-4" />
                  Liên hệ qua Zalo <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border rounded-lg border-zinc-300"
                >
                  <Phone className="w-4 h-4 text-violet-600" /> Gọi ngay
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-white">
      {/* đường kẻ mảnh trên cùng */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="px-4 mx-auto max-w-7xl py-14">
        {/* Khối trên: brand + cột link */}
        <div className="p-6 border shadow-sm rounded-3xl border-zinc-200/90 bg-white/90 md:p-8">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="relative w-10 h-10 overflow-hidden rounded-xl ring-1 ring-zinc-200">
                  <Image
                    src={bowImg}
                    alt="3BOW"
                    fill
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                    Google Marketing Agency
                  </p>
                  <h3 className="text-lg font-semibold leading-snug">
                    CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ 3BOW DIGITAL
                  </h3>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                3BOW là Google Marketing Agency – đơn vị tư vấn & triển khai
                hoạt động Marketing số với nền tảng Google làm trọng tâm.
              </p>

              {/* Social */}
              <div className="mt-4">
                <div className="text-sm font-medium">Kết nối</div>
                <div className="flex items-center gap-3 mt-2">
                  <SocialButton href="#" ariaLabel="Facebook">
                    <Facebook className="w-4 h-4" />
                  </SocialButton>
                  <SocialButton href="#" ariaLabel="YouTube">
                    <Youtube className="w-4 h-4" />
                  </SocialButton>
                  <SocialButton href="https://zalo.me/" ariaLabel="Zalo">
                    <MessageCircle className="w-4 h-4" />
                  </SocialButton>
                </div>
              </div>

              {/* Trust pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mt-5 text-xs border rounded-full border-zinc-300 text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                DMCA PROTECTED
              </div>
            </div>

            {/* Cột link */}
            <FooterCol
              className="md:col-span-2"
              title="Giới thiệu"
              items={[
                { href: "/introduct", label: "Về 3BOW" },
                { href: "/about/ip", label: "Mô hình độc quyền" },
                { href: "/about/team", label: "Đội ngũ nhân sự" },
                // { href: "/sitemap", label: "Sơ đồ trang" },
              ]}
            />
            <FooterCol
              className="md:col-span-3"
              title="Dịch vụ"
              items={[
                { href: "/services/seo", label: "Dịch vụ SEO" },
                { href: "/services/google-ads", label: "Dịch vụ Google Ads" },
                {
                  href: "/services/facebook-ads",
                  label: "Dịch vụ Facebook Ads",
                },
                { href: "/services/tiktok-ads", label: "Dịch vụ Tiktok Ads" },
                {
                  href: "/services/digital-branding",
                  label: "Dịch vụ Digital Branding",
                },
              ]}
            />
            <FooterCol
              className="md:col-span-2"
              title="Kiến thức"
              items={[
                { href: "/resources/seo", label: "SEO" },
                { href: "/resources/google-ads", label: "Google Ads" },
                { href: "/resources/digital", label: "Digital Marketing" },
              ]}
            />
          </div>
        </div>

        {/* Khối dưới: địa chỉ + liên hệ dạng thẻ tinh gọn */}
        <div className="grid gap-6 mt-8 md:grid-cols-3">
          <InfoCard
            title="VP Hà Nội"
            icon={<MapPin className="w-4 h-4 text-violet-600" />}
            content={
              <>
                Số 12, đường Xóm Miễu, Thôn Duyên Trường, Xã Duyên Thái, Huyện
                Thường Tín, Thành phố Hà Nội, Việt Nam
              </>
            }
          />
          <InfoCard
            title="Hotline dịch vụ"
            icon={<Phone className="w-4 h-4 text-violet-600" />}
            content={
              <>
                <a
                  href="tel:0933415331"
                  className="font-medium hover:underline"
                >
                  093 3415 331
                </a>
              </>
            }
          />
          <InfoCard
            title="Email dịch vụ"
            icon={<Mail className="w-4 h-4 text-emerald-600" />}
            content={
              <>
                <a href="mailto:contact@3bow.vn" className="hover:underline">
                  contact@3bow.vn
                </a>
              </>
            }
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 mt-8 text-xs text-zinc-500 sm:flex-row">
          <div>© {new Date().getFullYear()} 3BOW. All rights reserved.</div>
          <nav className="flex items-center gap-4">
            <FooterInlineLink href="#">Privacy</FooterInlineLink>
            <FooterInlineLink href="#">Terms</FooterInlineLink>
          </nav>
        </div>
      </div>
      <ChatWidget />
    </footer>
  );
}

/* ---------- Subcomponents ---------- */

function FooterCol({
  title,
  items,
  className = "",
}: {
  title: string;
  items: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <nav className={className} aria-label={title}>
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="inline-flex items-center gap-2 group text-zinc-700 hover:text-zinc-900"
            >
              <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-600" />
              <span className="underline transition decoration-transparent underline-offset-2 group-hover:decoration-violet-600">
                {it.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialButton({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="group grid h-9 w-9 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        {children}
      </span>
    </a>
  );
}

function InfoCard({
  title,
  icon,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-white border rounded-2xl border-zinc-200">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex items-start gap-2 mt-2 text-sm text-zinc-700">
        {icon}
        <div>{content}</div>
      </div>
    </div>
  );
}

function FooterInlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="underline transition decoration-transparent underline-offset-2 hover:decoration-zinc-500"
    >
      {children}
    </a>
  );
}
