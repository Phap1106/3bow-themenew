// app/services/google-ads/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Megaphone,
  Target,
  Rocket,
  Gauge,
  BarChart3,
  Sparkles,
  ShieldCheck,
  FileText,
  LineChart,
  Layers,
  Link2,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";

/* ===== Data ===== */
const STATS = [
  { k: "Ngân sách đã quản lý", v: "50+ tỷ/năm" },
  { k: "Ngành hàng đã triển khai", v: "25+" },
  { k: "Tỷ lệ duy trì", v: "92%" },
  { k: "AB tests/tháng", v: "120+" },
];

const PILLARS = [
  {
    icon: Gauge,
    title: "Đo lường chuẩn (GTM/GA4)",
    desc: "Chuẩn hoá conversion, events, enhanced conversions; mapping CRM khi cần.",
  },
  {
    icon: Layers,
    title: "Cấu trúc tài khoản đúng",
    desc: "Theo funnel & intent: Brand / Non-brand / Competitor / PMax / Remarketing.",
  },
  {
    icon: Target,
    title: "Chiến lược bidding",
    desc: "tCPA, tROAS, Maximize Conv/Value; giai đoạn ramp & kiểm soát học máy.",
  },
  {
    icon: Sparkles,
    title: "Creative & Asset",
    desc: "RSA, PMax asset groups, extensions; feed chuẩn hoá cho Shopping.",
  },
  {
    icon: LineChart,
    title: "Quy tắc tối ưu liên tục",
    desc: "Nhãn hoá, quy tắc tự động; lịch kiểm tra theo tuần/tháng, nhật ký thay đổi.",
  },
  {
    icon: ShieldCheck,
    title: "Brand Safety",
    desc: "Danh sách loại trừ, placements/keywords negatives, chuẩn hoá theo ngành.",
  },
];

const DELIVERABLES = [
  "Tài liệu Audit & Roadmap tối ưu 3–6–12 tháng.",
  "Khung đo lường GA4/GTM + hướng dẫn kiểm thử.",
  "Cấu trúc tài khoản & naming convention chuẩn.",
  "Bảng từ khoá/đối sánh & negatives theo intent.",
  "Template báo cáo Looker Studio realtime.",
  "Sổ tay tối ưu & nhật ký thay đổi (changelog).",
];

const PROCESS = [
  { icon: FileText, title: "1) Audit & Brief mục tiêu", desc: "Phân tích dữ liệu lịch sử, chân dung khách hàng, KPI kinh doanh." },
  { icon: Layers, title: "2) Thiết kế cấu trúc & tracking", desc: "Chuẩn GA4/GTM, conversion, offline/CRM (khi có)." },
  { icon: Megaphone, title: "3) Triển khai chiến dịch", desc: "Brand/Non-brand/DSA/PMax/Shopping/Remarketing." },
  { icon: Target, title: "4) Testing framework", desc: "A/B RSA, headlines, keywords, audiences, feed & landing." },
  { icon: LineChart, title: "5) Tối ưu theo dữ liệu", desc: "Bidding, ngân sách, search terms, funnel, quy tắc tự động." },
  { icon: BarChart3, title: "6) Báo cáo & học tập", desc: "Looker Studio + nhận định từng tuần/tháng, đề xuất next steps." },
];

const FAQS = [
  {
    q: "Bao lâu để chiến dịch Google Ads ổn định?",
    a: "Thường 7–21 ngày để học máy ổn, tuỳ ngân sách & tín hiệu chuyển đổi. Sau đó tối ưu theo tuần với khung test rõ ràng.",
  },
  {
    q: "3BOW đo hiệu quả bằng gì?",
    a: "Theo KPI đã thống nhất: chuyển đổi/giá trị chuyển đổi (GA4), CPA/ROAS, chi phí theo kênh, kết nối CRM nếu có.",
  },
  {
    q: "Có cam kết số liệu không?",
    a: "Chúng tôi cam kết quy trình minh bạch, đo lường chuẩn & tối ưu có phương pháp; không hứa số ‘cứng’ vì phụ thuộc ngành & cạnh tranh.",
  },
  {
    q: "Sự khác biệt của 3BOW?",
    a: "Kỷ luật đo lường, cấu trúc đúng ngay từ đầu, tối ưu lặp lại theo dữ liệu, báo cáo minh bạch mỗi ngày.",
  },
];

/* ===== Page ===== */
export default function GoogleAdsServicePage() {
  // JSON-LD
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: "https://3bow.vn/services" },
      { "@type": "ListItem", position: 3, name: "Google Ads", item: "https://3bow.vn/services/google-ads" },
    ],
  };
  const ldService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Quản lý & Tối ưu chiến dịch Google Ads",
    provider: { "@type": "Organization", name: "3BOW DIGITAL" },
    serviceType: "Advertising",
    areaServed: "Vietnam",
    url: "https://3bow.vn/services/google-ads",
    description:
      "Dịch vụ Google Ads: đo lường chuẩn GA4/GTM, cấu trúc tài khoản đúng, bidding chiến lược, creative chuẩn, tối ưu liên tục & báo cáo minh bạch.",
  };
  const ldFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SiteShell>
      <Script id="ld-breadcrumb-ggads" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-service-ggads" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService) }} />
      <Script id="ld-faq-ggads" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO */}
        <section className="relative">
          <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1508830524289-0adcbe822b40?q=80&w=2000&auto=format&fit=crop"
              alt="Dịch vụ Google Ads - 3BOW DIGITAL"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-xs md:text-sm text-zinc-700">
                  Cấu trúc đúng – Tracking chuẩn – Bidding chiến lược – Báo cáo minh bạch
                </p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">
                  DỊCH VỤ <span className="text-violet-700">GOOGLE ADS</span>
                </h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
                  Tập trung hiệu quả kinh doanh: CPA/ROAS/Doanh thu. Mọi quyết định được dẫn dắt bởi dữ liệu thật.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800"
                  >
                    <Rocket className="w-4 h-4" /> Nhận tư vấn Google Ads
                  </Link>
                  <Link
                    href="#pillars"
                    className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl hover:bg-zinc-50"
                  >
                    <Target className="w-4 h-4" /> Trụ cột triển khai
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full -mt-6 h-10 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
        </section>

        {/* STATS */}
        <section className="max-w-6xl px-6 py-10 mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.k} className="p-6 bg-white border shadow-sm rounded-2xl">
                <div className="text-3xl font-bold text-violet-700">{s.v}</div>
                <div className="mt-1 text-sm text-zinc-600">{s.k}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars" className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">6 trụ cột triển khai Google Ads</h2>
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div key={p.title} className="p-6 bg-white border rounded-2xl">
                  <p.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{p.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DELIVERABLES + CASES */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Bạn nhận được gì?</h2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                {DELIVERABLES.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-violet-700" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white border rounded-2xl">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Ví dụ kết quả điển hình</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• Edu leadgen: CPA giảm 38% sau 6 tuần, số lead +74% với tCPA + PMax.</li>
                <li>• E-commerce: ROAS +62% sau 3 tháng nhờ feed chuẩn & Shopping + PMax.</li>
                <li>• B2B SaaS: Qualified trials tăng 2.1×, CAC giảm 33% nhờ SKAG-like & negatives.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Quy trình triển khai tinh gọn</h2>
            <div className="grid gap-4 mt-6 md:grid-cols-3">
              {PROCESS.map((p) => (
                <div key={p.title} className="p-6 bg-white border rounded-2xl">
                  <p.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{p.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="p-6 bg-white border rounded-2xl">
            <div className="flex items-center gap-3">
              <Link2 className="w-6 h-6 text-violet-700" />
              <div className="text-lg font-semibold">Tích hợp & Landing</div>
            </div>
            <p className="mt-2 text-sm text-zinc-700">
              Kết nối CRM/Google Sheets khi cần đối soát. Tối ưu landing: tốc độ, message-match,
              form tracking, thử nghiệm tiêu đề/CTA để tối đa chuyển đổi.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl px-6 pb-12 mx-auto">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Câu hỏi thường gặp</h2>
          <div className="mt-6 bg-white border divide-y rounded-2xl">
            {FAQS.map((f, i) => (
              <details key={i} className="p-6 group">
                <summary className="flex items-center justify-between gap-4 list-none cursor-pointer">
                  <span className="font-medium">{f.q}</span>
                  <Sparkles className="w-4 h-4 transition text-violet-700 group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="max-w-6xl px-6 pb-12 mx-auto">
          <div className="p-8 text-white border shadow-lg rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-600">
            <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wide">
                  Bắt đầu tối ưu Google Ads cùng 3BOW
                </h3>
                <p className="text-white/90">
                  Chia sẻ mục tiêu & dữ liệu hiện tại, chúng tôi audit nhanh và đề xuất lộ trình phù hợp.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Link
                  href="mailto:contact@3bow.vn?subject=Tư%20vấn%20Google%20Ads"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl text-zinc-900 hover:bg-zinc-100"
                >
                  <Mail className="w-4 h-4" /> Gửi email
                </Link>
                <Link
                  href="tel:0333415331"
                  className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl border-white/40 hover:bg-white/10"
                >
                  <Phone className="w-4 h-4" /> 033 3415 331
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — Google Ads minh bạch, đo lường theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
