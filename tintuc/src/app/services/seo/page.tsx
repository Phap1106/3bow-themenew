"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Search,
  Cpu,
  FileText,
  Link2,
  ShieldCheck,
  Gauge,
  Globe,
  Sparkles,
  BarChart3,
  Target,
  Rocket,
  Layers,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";

/* ====== Data ====== */
const STATS = [
  { k: "Dự án SEO", v: "180+" },
  { k: "Top 3 từ khoá cốt lõi", v: "75%" },
  { k: "Tăng organic traffic", v: "3–10×" },
  { k: "Khung thời gian", v: "3–6–12m" },
];

const PILLARS = [
  {
    icon: Cpu,
    title: "Technical SEO",
    desc: "Audit kỹ thuật, kiến trúc thông tin, crawl/index, HTTPS, robots, sitemap, canonical, hreflang.",
  },
  {
    icon: Gauge,
    title: "Core Web Vitals",
    desc: "Tối ưu LCP, CLS, INP; tối ưu ảnh, script, cache; đo liên tục qua PageSpeed/CrUX.",
  },
  {
    icon: FileText,
    title: "Content Strategy",
    desc: "Nghiên cứu intent & topic cluster; guideline E-E-A-T; quy trình biên tập – review – cập nhật.",
  },
  {
    icon: Link2,
    title: "Entity & Authority",
    desc: "Schema, internal link, brand signals; kế hoạch liên kết an toàn, liên quan chủ đề.",
  },
  {
    icon: Globe,
    title: "Local/International SEO",
    desc: "GMB profile, NAP consistency, địa phương hoá nội dung; hreflang đa ngôn ngữ.",
  },
  {
    icon: BarChart3,
    title: "Đo lường & Báo cáo",
    desc: "GA4, GSC, Looker Studio; theo dõi thứ hạng, organic ROI/lead, mục tiêu kinh doanh.",
  },
];

const PROCESS = [
  { icon: Search, title: "1) SEO Audit tổng thể", desc: "Kỹ thuật, nội dung, authority; rào cản index/hiển thị." },
  { icon: Target, title: "2) Chiến lược & Roadmap", desc: "Ưu tiên nhanh–trung–dài hạn theo mục tiêu." },
  { icon: Layers, title: "3) Quick Wins", desc: "Sửa lỗi blocking, tối ưu meta/title, internal link, schema lõi." },
  { icon: Layers, title: "4) On-page & Kỹ thuật", desc: "Template chuẩn, CWV, heading, dữ liệu có cấu trúc." },
  { icon: Sparkles, title: "5) Nội dung theo Cluster", desc: "Brief chi tiết, lịch biên tập, cập nhật pillar/cluster." },
  { icon: ShieldCheck, title: "6) Entity & Liên kết", desc: "Tín hiệu thương hiệu, liên kết chất lượng, không spam." },
  { icon: BarChart3, title: "7) Đo lường – Tối ưu", desc: "Dashboard KPI, thử nghiệm A/B titles, theo dõi chuyển đổi." },
];

const DELIVERABLES = [
  "Báo cáo Audit & ưu tiên (PDF + Sheet checklist).",
  "Keyword map & kiến trúc nội dung (topic cluster).",
  "Playbook On-page & Schema (template sẵn dùng).",
  "Lộ trình cải thiện CWV & backlog kỹ thuật.",
  "Dashboard Looker Studio + hướng dẫn đọc số.",
  "Báo cáo định kỳ & nhật ký thay đổi (changelog).",
];

const FAQS = [
  {
    q: "Bao lâu thì SEO có kết quả?",
    a: "Tuỳ ngành & trạng thái site, thường thấy chuyển biến 6–12 tuần cho quick wins và rõ rệt sau 3–6–12 tháng theo roadmap.",
  },
  {
    q: "3BOW đo lường hiệu quả SEO thế nào?",
    a: "Theo KPI đã thống nhất: hiển thị/click GSC, thứ hạng nhóm từ khoá, organic sessions, leads/transactions (GA4), ROI organic.",
  },
  {
    q: "Có cam kết thứ hạng không?",
    a: "Cam kết quy trình minh bạch & đầu ra đo được; không hứa hẹn thứ hạng cố định do phụ thuộc nhiều biến số thị trường.",
  },
  {
    q: "Điểm khác biệt của 3BOW?",
    a: "Tập trung ‘bền vững theo dữ liệu’: chiến lược rõ ràng, kỹ thuật chuẩn, nội dung hữu ích, đo lường minh bạch, không dùng kỹ thuật rủi ro.",
  },
];

/* ====== Page ====== */
export default function SEOServicePage() {
  // JSON-LD (breadcrumb + service + FAQ)
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: "https://3bow.vn/services" },
      { "@type": "ListItem", position: 3, name: "SEO", item: "https://3bow.vn/services/seo" },
    ],
  };
  const ldService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Dịch vụ SEO bền vững",
    provider: { "@type": "Organization", name: "3BOW DIGITAL" },
    url: "https://3bow.vn/services/seo",
    areaServed: "Vietnam",
    serviceType: "SEO Service",
    description:
      "Dịch vụ SEO bền vững: Technical SEO, Content Strategy, E-E-A-T, Core Web Vitals, Schema, Local SEO, đo lường minh bạch.",
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
      {/* SEO JSON-LD */}
      <Script id="ld-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService) }} />
      <Script id="ld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO */}
        <section className="relative">
          <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2000&auto=format&fit=crop"
              alt="Dịch vụ SEO bền vững 3BOW DIGITAL"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-xs md:text-sm text-zinc-700">
                  Chiến lược dài hạn — kỹ thuật chuẩn — nội dung hữu ích — đo lường minh bạch
                </p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">
                  DỊCH VỤ <span className="text-violet-700">SEO BỀN VỮNG</span>
                </h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
                  Tăng trưởng lưu lượng tự nhiên, chất lượng lead và doanh thu organic. Không hứa hẹn thứ hạng ảo.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800"
                  >
                    <Rocket className="w-4 h-4" /> Nhận tư vấn SEO
                  </Link>
                  <Link
                    href="#pillars"
                    className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl hover:bg-zinc-50"
                  >
                    <Target className="w-4 h-4" /> Trụ cột SEO
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
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">6 trụ cột SEO tại 3BOW</h2>
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
                <li>• SaaS B2B: +320% organic signups sau 9 tháng (6 cluster nội dung + CWV).</li>
                <li>• E-commerce: +180% non-brand clicks GSC sau 6 tháng; tỉ lệ chuyển đổi +27%.</li>
                <li>• Local service: 45% từ khoá dịch vụ vào Top 3 trong 4 tháng, GMB calls tăng 2.4×.</li>
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

        {/* FAQ */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
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
                  Bắt đầu tăng trưởng organic cùng 3BOW
                </h3>
                <p className="text-white/90">
                  Chia sẻ mục tiêu & hiện trạng website, đội ngũ sẽ audit nhanh và đề xuất lộ trình phù hợp.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Link
                  href="mailto:contact@3bow.vn?subject=Tư%20vấn%20Dịch%20vụ%20SEO"
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
          © {new Date().getFullYear()} 3BOW DIGITAL — SEO bền vững theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
