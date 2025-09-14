"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Megaphone,
  Target,
  Gauge,
  BarChart3,
  ShieldCheck,
  FileText,
  Layers,
  ClipboardCheck,
  CreditCard,
  Database,
  Users,
  Calendar,
  Globe,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";

/* ===== UI helpers ===== */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-zinc-900">
    <span className="relative inline-block group">
      {children}
      <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 group-hover:w-full" />
    </span>
  </h2>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="relative p-6 transition-all duration-300 bg-white border group rounded-2xl border-zinc-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
    <span className="absolute inset-x-0 h-px transition-opacity duration-300 opacity-0 pointer-events-none -bottom-px bg-gradient-to-r from-transparent via-violet-200 to-transparent group-hover:opacity-100" />
    {children}
  </div>
);

/* ===== DATA ===== */
const STATS = [
  { k: "Checklist thực hành", v: "10+" },
  { k: "Template triển khai", v: "6+" },
  { k: "Case study", v: "12+" },
  { k: "Cập nhật", v: "Hàng tháng" },
];

const RESOURCES = [
  {
    icon: Users,
    title: "Quyền truy cập",
    desc: "Tài khoản Google Ads (Admin), GA4, Google Tag Manager, Google Search Console; quyền truy cập website/landing.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán & hoá đơn",
    desc: "Phương thức thanh toán hợp lệ, thông tin xuất hoá đơn; cấu hình ngưỡng chi & cảnh báo ngân sách.",
  },
  {
    icon: Gauge,
    title: "Tracking & chuyển đổi",
    desc: "Sự kiện GA4, Enhanced Conversions/CAPI, định nghĩa chuyển đổi theo phễu; kiểm thử UTM & attribution.",
  },
  {
    icon: FileText,
    title: "Landing page sẵn sàng",
    desc: "Thông điệp khớp intent, tốc độ tốt (CWV), biểu mẫu/CTA rõ ràng, chính sách/điều khoản minh bạch.",
  },
  {
    icon: Database,
    title: "Dữ liệu sản phẩm (Shopping)",
    desc: "Google Merchant Center, feed sạch (title, GTIN, giá, tồn kho, ảnh), chính sách vận chuyển & hoàn tiền.",
  },
  {
    icon: ShieldCheck,
    title: "Tuân thủ & an toàn",
    desc: "Chính sách ngành; negative keywords/placements; domain verify; danh sách loại trừ.",
  },
  {
    icon: Globe,
    title: "Hạ tầng website",
    desc: "HTTPS, sitemap/robots.txt, cấu trúc URL; đo Core Web Vitals; cache/CDN; log lỗi 4xx/5xx.",
  },
  {
    icon: Calendar,
    title: "Mục tiêu & tiến độ",
    desc: "Mục tiêu CPA/ROAS, ngân sách theo giai đoạn; lịch review/AB test; nhật ký thay đổi.",
  },
];

const CHECKLIST_QUICK = [
  "Kết nối Google Ads ↔ GA4 ↔ GTM; bật auto-tagging & Enhanced Conversions.",
  "Xác định biến thể chiến dịch: Brand/Non-brand/Competitor/PMax/DSA/Remarketing.",
  "Chuẩn hoá chuyển đổi: submit form, call, purchase, micro-events hữu ích.",
  "Kiểm tra search terms hằng tuần; phủ negatives theo intent.",
  "Tối ưu RSA/PMax asset: headline theo đề xuất + angle khác biệt.",
  "Thiết lập báo cáo Looker Studio (UTM & chi phí).",
];

const TIPS = [
  { title: "Bắt đầu từ đo lường", desc: "Đừng chi tiền khi chưa kiểm thử chuyển đổi. So khớp dữ liệu GA4, Ads và CRM trước khi scale." },
  { title: "Cấu trúc đúng ngay từ đầu", desc: "Nhóm theo intent/funnel. Ít mà chất, tránh trùng lặp. Đặt tên chuẩn để đọc số nhanh." },
  { title: "Testing có kỷ luật", desc: "Chỉ đổi 1 biến mỗi test; chạy đủ dữ liệu; ghi log và chốt học được gì." },
  { title: "PMax không phải ‘auto win’", desc: "Nuôi tín hiệu bằng feed sạch, audience & creative tốt; kiểm soát bằng listing groups & brand terms." },
];

const FAQS = [
  { q: "Ngân sách tối thiểu nên bắt đầu bao nhiêu?", a: "Tùy ngành & giá trị chuyển đổi, nên đủ để thu được 30–50 chuyển đổi/tháng cho chiến lược tCPA/tROAS hoạt động ổn định." },
  { q: "Bao lâu để học máy ổn định?", a: "Thường 7–21 ngày, phụ thuộc chất lượng tín hiệu conversion và mức chi tiêu hàng ngày." },
  { q: "Có cần CRM không?", a: "Rất nên nếu là leadgen/B2B. Kết nối offline conversions giúp thuật toán tối ưu theo chất lượng thật." },
];

/* ===== PAGE ===== */
export default function GoogleAdsKnowledgePage() {
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Tài nguyên", item: "https://3bow.vn/resources" },
      { "@type": "ListItem", position: 3, name: "Google Ads", item: "https://3bow.vn/resources/google-ads" },
    ],
  };
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Kiến thức & Tài nguyên Google Ads — Checklist, Template, Kinh nghiệm",
    about: "Yêu cầu tài nguyên khi chạy Google Ads, cách đo lường, cấu trúc tài khoản, tips thực chiến.",
    author: { "@type": "Organization", name: "3BOW DIGITAL" },
    url: "https://3bow.vn/resources/google-ads",
  };
  const ldFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <SiteShell>
      <Script id="ld-gads-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-gads-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <Script id="ld-gads-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO with aura + shine */}
        <section className="relative">
          <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop"
              alt="Kiến thức Google Ads – 3BOW DIGITAL"
              fill priority className="object-cover" sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-violet-300/30 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-indigo-300/30 blur-3xl" />
            </div>
            <div className="absolute inset-0 grid px-6 text-center place-items-center">
              <div>
                <p className="text-xs md:text-sm text-zinc-700">Checklist – Template – Kinh nghiệm thực chiến</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">
                  TÀI NGUYÊN <span className="text-violet-700">GOOGLE ADS</span>
                </h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
                  Tập trung vào yêu cầu tài nguyên trước khi chạy, đo lường chuẩn, cấu trúc đúng và tối ưu bền vững.
                </p>
              </div>
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1200ms] ease-out hover:translate-x-full" />
            </div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full -mt-6 h-10 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
        </section>

        {/* STATS */}
        <section className="max-w-6xl px-6 py-10 mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => (
              <Card key={s.k}>
                <div className="text-3xl font-bold text-violet-700">{s.v}</div>
                <div className="mt-1 text-sm text-zinc-600">{s.k}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* RESOURCES REQUIRED */}
        <section className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <H2>Tài nguyên cần chuẩn bị</H2>
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {RESOURCES.map((r) => (
                <Card key={r.title}>
                  <r.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{r.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{r.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK CHECKLIST + TIPS */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Checklist 30 phút trước khi chạy</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                {CHECKLIST_QUICK.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-violet-700" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Một vài kinh nghiệm nhanh</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                {TIPS.map((t) => (
                  <li key={t.title}>
                    <b>{t.title}:</b> {t.desc}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl px-6 pb-12 mx-auto">
          <H2>Câu hỏi thường gặp</H2>
          <div className="mt-6 bg-white border divide-y rounded-2xl border-zinc-200">
            {FAQS.map((f, i) => (
              <details key={i} className="p-6 transition-colors group hover:bg-zinc-50/60">
                <summary className="flex items-center justify-between gap-4 list-none cursor-pointer">
                  <span className="font-medium">{f.q}</span>
                  <BarChart3 className="w-4 h-4 transition text-violet-700 group-open:rotate-12" />
                </summary>
                <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA with shine + no-wrap buttons */}
        <section id="contact" className="max-w-6xl px-6 pb-12 mx-auto">
          <div className="relative p-6 overflow-hidden text-white border shadow-lg rounded-3xl border-violet-200 bg-gradient-to-r from-violet-700 to-indigo-600 sm:p-8">
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-white/20 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-white/20 blur-3xl" />
            </div>
            <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-[1200ms] hover:before:translate-x-full" />
            <div className="relative z-[1] flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wide">Cần checklist Google Ads theo ngành?</h3>
                <p className="text-white/90">Gửi hiện trạng & mục tiêu, chúng tôi sẽ chia sẻ template phù hợp để bắt đầu đúng ngay từ đầu.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
                <Link
                  href="mailto:contact@3bow.vn?subject=Tài%20nguyên%20Google%20Ads"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-zinc-900 transition hover:bg-zinc-100 active:scale-[.98] whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" />
                  Gửi email
                </Link>
                <Link
                  href="tel:0333415331"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 transition hover:bg-white/10 active:scale-[.98] whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" />
                  033 3415 331
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — Tài nguyên Google Ads dễ hiểu, thực chiến & đo lường theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
