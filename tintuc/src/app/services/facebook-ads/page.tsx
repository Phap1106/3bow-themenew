"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Megaphone, Target, Rocket, Gauge, BarChart3, Sparkles, ShieldCheck, FileText,
  LineChart, Layers, Link2, CheckCircle2, Mail, Phone, Users, Video
} from "lucide-react";

/* helpers */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-zinc-900 group">
    <span className="relative inline-block">
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

/* Data */
const STATS = [
  { k: "Ngân sách đã quản lý", v: "40+ tỷ/năm" },
  { k: "Ngành hàng triển khai", v: "20+" },
  { k: "CPA trung bình giảm", v: "25–45%" },
  { k: "AB tests/tháng", v: "100+" },
];

const PILLARS = [
  { icon: Gauge,     title: "Tracking chuẩn (GA4/GTM + Pixel CAPI)", desc: "Chuẩn hoá conversion, Advanced Matching/CAPI; mapping CRM khi cần." },
  { icon: Layers,    title: "Cấu trúc tài khoản đúng",              desc: "Prospecting / Retargeting / Advantage+; ngân sách & ngân quỹ thử nghiệm." },
  { icon: Sparkles,  title: "Creative – Hook đầu 3s",                desc: "UGC, angle/offer/testimonials; khung test biến thể visual/copy 1–2–3." },
  { icon: Users,     title: "Chiến lược đối tượng",                  desc: "Broad/LLA/Interest; exclusion thông minh; tần suất & độ chồng chéo." },
  { icon: LineChart, title: "Quy tắc tối ưu",                        desc: "Nhãn hoá, rule tự động; lịch kiểm tra theo tuần/tháng; changelog rõ ràng." },
  { icon: ShieldCheck, title: "Brand Safety & Compliance",           desc: "Chính sách ngành; page/asset hygiene; hạn chế khiếu nại & bị hạn chế." },
];

const DELIVERABLES = [
  "Audit & Roadmap tối ưu 3–6–12 tháng (PDF/Sheet).",
  "Thiết lập GA4/GTM + Pixel/CAPI + checklist kiểm thử.",
  "Cấu trúc chiến dịch/adset theo funnel & naming convention.",
  "Khung test creative (angle, hook, CTA) + lịch sản xuất.",
  "Báo cáo Looker Studio realtime + nhận định hằng tuần.",
  "Nhật ký thay đổi (changelog) & playbook tối ưu.",
];

const PROCESS = [
  { icon: FileText,   title: "1) Audit & Brief mục tiêu",               desc: "Phân tích dữ liệu lịch sử, chân dung khách hàng, KPI." },
  { icon: Link2,      title: "2) Tracking & chuẩn hoá dữ liệu",        desc: "GA4/GTM, Pixel/CAPI, events & conversion." },
  { icon: Megaphone,  title: "3) Thiết kế cấu trúc & triển khai",       desc: "Prospecting/Retargeting/Advantage+, ngân sách test." },
  { icon: Sparkles,   title: "4) Creative factory",                     desc: "Sản xuất & test nhanh UGC/video/static; message-match landing." },
  { icon: Target,     title: "5) Tối ưu theo dữ liệu",                  desc: "Bidding, budget, frequency, overlap & learning phase." },
  { icon: BarChart3,  title: "6) Báo cáo & mở rộng",                    desc: "Insight theo tuần/tháng; mở rộng quy mô khi bền vững." },
];

const FAQS = [
  { q: "Bao lâu quảng cáo ổn định học máy?", a: "5–14 ngày tuỳ tín hiệu & ngân sách. Sau giai đoạn này tối ưu theo khung đã thống nhất." },
  { q: "Đo hiệu quả bằng gì?", a: "Leads/sales (GA4), CPA/ROAS, doanh thu quy đổi, chất lượng khách hàng từ CRM (nếu có)." },
  { q: "3BOW có cam kết ‘cứng’ không?", a: "Cam kết tracking chuẩn, quy trình tối ưu & báo cáo minh bạch; không hứa số tuyệt đối." },
  { q: "Khác biệt của 3BOW?", a: "Kỷ luật đo lường, creative test tốc độ, cấu trúc đúng từ đầu, báo cáo minh bạch hằng ngày." },
];

export default function FacebookAdsServicePage() {
  const ldBreadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: "https://3bow.vn/services" },
      { "@type": "ListItem", position: 3, name: "Facebook Ads", item: "https://3bow.vn/services/facebook-ads" },
    ],
  };
  const ldService = {
    "@context": "https://schema.org", "@type": "Service",
    name: "Quản lý & Tối ưu Facebook/Instagram Ads",
    provider: { "@type": "Organization", name: "3BOW DIGITAL" },
    areaServed: "Vietnam", serviceType: "Advertising",
    url: "https://3bow.vn/services/facebook-ads",
    description: "Tracking GA4/GTM + Pixel/CAPI, cấu trúc đúng theo funnel, creative test tốc độ, tối ưu liên tục, báo cáo minh bạch.",
  };
  const ldFAQ = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <SiteShell>
      <Script id="ld-fb-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-fb-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService) }} />
      <Script id="ld-fb-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO */}
        <section className="relative">
          <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2000&auto=format&fit=crop" alt="Dịch vụ Facebook Ads - 3BOW DIGITAL" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-violet-300/30 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-indigo-300/30 blur-3xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-xs md:text-sm text-zinc-700">Cấu trúc đúng – Creative mạnh – Tracking chuẩn – Báo cáo minh bạch</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">DỊCH VỤ <span className="text-violet-700">FACEBOOK ADS</span></h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">Tập trung CPA/ROAS & chất lượng khách hàng. Mọi quyết định dựa trên dữ liệu thật.</p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link href="#contact" className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800"><Rocket className="w-4 h-4" /> Nhận tư vấn Facebook Ads</Link>
                  <Link href="#pillars" className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl hover:bg-zinc-50"><Target className="w-4 h-4" /> Trụ cột triển khai</Link>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[1200ms] ease-out hover:translate-x-full" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full -mt-6 h-10 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
        </section>

        {/* STATS */}
        <section className="max-w-6xl px-6 py-10 mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map(s => (
              <Card key={s.k}>
                <div className="text-3xl font-bold text-violet-700">{s.v}</div>
                <div className="mt-1 text-sm text-zinc-600">{s.k}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* PILLARS */}
        <section id="pillars" className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <H2>6 trụ cột triển khai Facebook Ads</H2>
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map(p => (
                <Card key={p.title}>
                  <p.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{p.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* DELIVERABLES + CASES */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <H2>Bạn nhận được gì?</H2>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                {DELIVERABLES.map((d, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-violet-700" /><span>{d}</span></li>
                ))}
              </ul>
            </div>
            <Card>
              <div className="flex items-center gap-3"><BarChart3 className="w-6 h-6 text-violet-700" /><div className="text-lg font-semibold">Ví dụ kết quả điển hình</div></div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• D2C: CPA giảm 34% sau 8 tuần, doanh thu +65% nhờ UGC & Advantage+.</li>
                <li>• Edu: cost/lead giảm 41%, tỉ lệ chốt CRM +22%.</li>
                <li>• Local service: tần suất & overlap giảm, chất lượng leads tăng rõ rệt.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <H2>Quy trình tinh gọn</H2>
            <div className="grid gap-4 mt-6 md:grid-cols-3">
              {PROCESS.map(p => (
                <Card key={p.title}>
                  <p.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{p.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
                </Card>
              ))}
            </div>
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
                  <Video className="w-4 h-4 transition text-violet-700 group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="max-w-6xl px-6 pb-12 mx-auto">
          <div className="relative p-6 overflow-hidden text-white border shadow-lg rounded-3xl border-violet-200 bg-gradient-to-r from-violet-700 to-indigo-600 sm:p-8">
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-white/20 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-white/20 blur-3xl" />
            </div>
            <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-[1200ms] hover:before:translate-x-full" />
            <div className="relative z-[1] flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wide">Bắt đầu tối ưu Facebook Ads cùng 3BOW</h3>
                <p className="text-white/90">Gửi mục tiêu & dữ liệu, chúng tôi audit nhanh và đề xuất lộ trình phù hợp.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
                <Link href="mailto:contact@3bow.vn?subject=Tư%20vấn%20Facebook%20Ads" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-zinc-900 transition hover:bg-zinc-100 active:scale-[.98] whitespace-nowrap"><Mail className="w-4 h-4" /> Gửi email</Link>
                <Link href="tel:0333415331" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 transition hover:bg-white/10 active:scale-[.98] whitespace-nowrap"><Phone className="w-4 h-4" /> 033 3415 331</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — Facebook Ads minh bạch, hiệu quả theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
