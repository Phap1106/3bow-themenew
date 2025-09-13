// components/MarketingShell.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

const NAV = {
  gioiThieu: [
    { label: "Về 3BOW", href: "/introduct" },
    { label: "Đội ngũ", href: "/team" },
    { label: "Mô hình triển khai", href: "/model" },
    { label: "Tuyển dụng", href: "/careers" },
    { label: "Liên hệ", href: "/contact" },
  ],
  dichVu: [
    { label: "SEO Tổng Thể / SEO AI", href: "/services/seo" },
    { label: "Google Ads", href: "/services/google-ads" },
    { label: "Digital Branding", href: "/services/branding" },
    { label: "Facebook Ads", href: "/services/facebook-ads" },
    { label: "TikTok Ads", href: "/services/tiktok-ads" },
  ],
  daoTao: [
    { label: "Đào tạo SEO", href: "/training/seo" },
    { label: "Master Google Ads", href: "/training/google-ads" },
    { label: "Google Analytics 4", href: "/training/ga4" },
    { label: "Content SEO", href: "/training/content-seo" },
  ],
  taiNguyen: [
    { label: "Kiến thức", href: "/blog" },
    { label: "Tài liệu / Ebook", href: "/resources" },
    { label: "Tin tức", href: "/news" },
  ],
};

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white min-h-dvh text-zinc-900">
      <TopBar />
      <Header />
      {children}
      <Footer />
      <FloatingCta />
    </main>
  );
}

function TopBar() {
  return (
    <div className="items-center justify-between hidden px-4 py-2 text-sm md:flex bg-zinc-100 lg:px-8">
      <div className="flex items-center gap-4">
        <span className="font-medium">Dịch vụ:</span>
        <a href="#" className="hover:underline">
          093 3415 331 
        </a>
       
        <a href="#" className="hover:underline">
          contact@3bow.com
        </a>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);

  const Dropdown = ({
    title,
    items,
  }: {
    title: string;
    items: { label: string; href: string }[];
  }) => (
    <div
      className="relative"
      onMouseEnter={() => setDrop(title)}
      onMouseLeave={() => setDrop(null)}
    >
      <button className="inline-flex items-center gap-1 font-medium hover:text-zinc-900">
        {title} <ChevronDown className="size-4" />
      </button>
      <div
        className={`absolute left-0 top-full mt-3 w-72 rounded-xl border bg-white shadow-lg p-2 ${
          drop === title ? "block" : "hidden"
        }`}
      >
        {items.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="block px-3 py-2 text-sm rounded-lg hover:bg-zinc-50"
          >
            {x.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl lg:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-zinc-900">3BOW</span>{" "}
          <span className="text-amber-600">Automate</span>
        </Link>

        {/* Desktop */}
        <nav className="items-center hidden gap-6 md:flex text-zinc-700">
          <Dropdown title="Giới thiệu" items={NAV.gioiThieu} />
          <Dropdown title="Dịch vụ" items={NAV.dichVu} />
          <Dropdown title="Đào tạo" items={NAV.daoTao} />
          <Dropdown title="Tài nguyên" items={NAV.taiNguyen} />
          <Link href="/careers" className="font-medium hover:text-zinc-900">
            Tuyển dụng
          </Link>
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm border rounded-xl hover:bg-zinc-50"
          >
            Đặt lịch tư vấn
          </Link>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl bg-amber-600 hover:bg-amber-700"
          >
            <Phone className="size-4" /> Gọi ngay
          </a>
        </div>

        {/* Mobile */}
        <button className="p-2 md:hidden" onClick={() => setOpen(true)}>
          <Menu />
        </button>
        {open && (
          <div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setOpen(false)}
          >
            <div
              className="absolute top-0 right-0 h-full p-4 bg-white shadow-xl w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>

              {Object.entries(NAV).map(([k, items]) => (
                <div key={k} className="mb-3">
                  <div className="mb-1 text-xs uppercase text-zinc-500">
                    {k}
                  </div>
                  <div className="grid">
                    {items.map((x) => (
                      <Link
                        key={x.href}
                        href={x.href}
                        className="py-2 border-b hover:bg-zinc-50"
                      >
                        {x.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="grid gap-2 mt-4">
                <Link
                  href="/contact"
                  className="px-3 py-2 text-sm text-center border rounded-lg"
                >
                  Đặt lịch tư vấn
                </Link>
                <a
                  href="#"
                  className="px-3 py-2 text-sm text-center text-white rounded-lg bg-amber-600"
                >
                  Gọi ngay
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="grid gap-8 px-4 py-10 mx-auto text-sm max-w-7xl lg:px-8 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold">3BOW DIGITAL</div>
          <p className="mt-2 text-zinc-600">Google Marketing & DIGITAL.</p>
          <p className="mt-2">
            Hotline:{" "}
            <a href="#" className="hover:underline">
              0933415331
            </a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:contact@3bow.com" className="hover:underline">
              contact@3bow.com
            </a>
          </p>
        </div>
        <div>
          <div className="font-semibold">Dịch vụ</div>
          <ul className="mt-2 space-y-2">
            {NAV.dichVu.map((x) => (
              <li key={x.href}>
                <Link className="hover:underline" href={x.href}>
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Tài nguyên</div>
          <ul className="mt-2 space-y-2">
            {NAV.taiNguyen.map((x) => (
              <li key={x.href}>
                <Link className="hover:underline" href={x.href}>
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Kết nối</div>
          <div className="grid gap-2 mt-2">
            <Link className="hover:underline" href="/contact">
              Liên hệ
            </Link>
            <Link className="hover:underline" href="/privacy">
              Chính sách
            </Link>
          </div>
        </div>
      </div>
      <div className="py-4 text-xs text-center border-t text-zinc-500">
        © {new Date().getFullYear()} 3BOW
      </div>
    </footer>
  );
}

function FloatingCta() {
  return (
    <a
      href="https://zalo.me/"
      target="_blank"
      className="fixed px-4 py-3 text-white rounded-full shadow-xl bottom-5 right-5 bg-amber-600 hover:bg-amber-700"
    >
      Chat Zalo
    </a>
  );
}
