"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Target, Rocket, Gauge, BarChart3, Sparkles, ShieldCheck, FileText, Layers,
  Link2, CheckCircle2, Mail, Phone, Video, Music, Megaphone
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
  { k: "Video test/tháng", v: "120+" },
  { k: "Cải thiện CTR", v: "1.5–3×" },
  { k: "CPA giảm", v: "20–40%" },
  { k: "Ngành hàng triển khai", v: "15+" },
];

const PILLARS = [
  { icon: Gauge,     title: "Tracking chuẩn (GA4/GTM + Pixel/Events API)", desc: "Thiết lập events & conversion theo phễu; Advanced Matching; kết nối CRM khi cần." },
  { icon: Sparkles,  title: "Creative Factory – HSO",                      desc: "Hook–Story–Offer; UGC, demo, before/after, review; thư viện angle & hook test liên tục." },
  { icon: Layers,    title: "Cấu trúc chiến dịch đúng",                    desc: "Prospecting / Retargeting / Smart Performance; ngân sách thử nghiệm & scale." },
  { icon: Video,     title: "Spark Ads & Whitelisting",                    desc: "Tận dụng content từ KOL/KOC/creator; hợp thức hoá bản quyền & event tracking." },
  { icon: Link2,     title: "Landing & Message-match",                     desc: "Tối ưu tốc độ, form tracking, bố cục theo angle; A/B tiêu đề & CTA." },
  { icon: ShieldCheck, title: "Brand Safety & Policy",                     desc: "Tuân thủ chính sách nội dung/quảng cáo; hạn chế khiếu nại & vi phạm." },
];

const DELIVERABLES = [
  "Audit & Roadmap tối ưu 3–6–12 tháng.",
  "Pixel/Events API + GA4/GTM checklist kiểm thử.",
  "Khung sản xuất & test video ngắn (script/shotlist).",
  "Cấu trúc chiến dịch + naming convention chuẩn.",
  "Báo cáo Looker Studio realtime + nhận định hằng tuần.",
  "Changelog & playbook tối ưu mở rộng quy mô.",
];

const PROCESS = [
  { icon: FileText,  title: "1) Audit & Brief mục tiêu",        desc: "Phân tích ngành, chân dung khách hàng, KPI & bối cảnh." },
  { icon: Link2,     title: "2) Tracking & chuẩn hoá dữ liệu",  desc: "GA4/GTM, Pixel/Events API, chuẩn hoá conversion." },
  { icon: Megaphone, title: "3) Triển khai chiến dịch",         desc: "Prospecting/Retargeting/Smart Performance; ngân sách test." },
  { icon: Sparkles,  title: "4) Creative sprint",               desc: "Sản xuất & test nhanh 5–10 biến thể/video; tối ưu hook đầu 3s." },
  { icon: Target,    title: "5) Tối ưu theo dữ liệu",           desc: "Bidding, ngân sách, audience, tần suất, mở rộng scale." },
  { icon: BarChart3, title: "6) Báo cáo & mở rộng",             desc: "Insight theo tuần/tháng; kế hoạch tăng trưởng bền vững." },
];

const FAQS = [
  { q: "TikTok Ads hiệu quả với ngành nào?", a: "D2C, mỹ phẩm, thời trang, F&B, Edu, apps… nhưng luôn cần tracking & landing tốt." },
  { q: "Bao lâu để có kết quả?", a: "2–4 tuần có quick wins nếu creative phù hợp; 6–12 tuần để ổn định và mở rộng." },
  { q: "Đo hiệu quả như thế nào?", a: "Leads/sales (GA4), CPA/ROAS, tỉ lệ xem >50%, CTR, chất lượng khách hàng ở CRM." },
  { q: "3BOW có hỗ trợ sản xuất video không?", a: "Có – script/shotlist/hướng dẫn quay & network creator cho UGC." },
];

export default function TikTokAdsServicePage() {
  const ldBreadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Dịch vụ", item: "https://3bow.vn/services" },
      { "@type": "ListItem", position: 3, name: "TikTok Ads", item: "https://3bow.vn/services/tiktok-ads" },
    ],
  };
  const ldService = {
    "@context": "https://schema.org", "@type": "Service",
    name: "Quản lý & Tối ưu TikTok Ads",
    provider: { "@type": "Organization", name: "3BOW DIGITAL" },
    areaServed: "Vietnam", serviceType: "Advertising",
    url: "https://3bow.vn/services/tiktok-ads",
    description: "Pixel/Events API, creative sprint (HSO), cấu trúc đúng, tối ưu theo dữ liệu, báo cáo minh bạch.",
  };
  const ldFAQ = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <SiteShell>
      <Script id="ld-tt-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-tt-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService) }} />
      <Script id="ld-tt-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO */}
        <section className="relative">
          <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1602027830542-834c29b2b5d5?q=80&w=2000&auto=format&fit=crop" alt="Dịch vụ TikTok Ads - 3BOW DIGITAL" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-violet-300/30 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-indigo-300/30 blur-3xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-xs md:text-sm text-zinc-700">Creative nhanh – Tracking chuẩn – Mở rộng quy mô an toàn</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">DỊCH VỤ <span className="text-violet-700">TIKTOK ADS</span></h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">Tối ưu video ngắn để tăng chuyển đổi. Không chạy theo “viral”, tập trung hiệu quả kinh doanh.</p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link href="#contact" className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800"><Rocket className="w-4 h-4" /> Nhận tư vấn TikTok Ads</Link>
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
            <H2>6 trụ cột triển khai TikTok Ads</H2>
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
                <li>• D2C: CPA -29% sau 6 tuần nhờ creative sprint & Smart Performance.</li>
                <li>• Mỹ phẩm: CTR 2.4×, tỉ lệ xem &gt;50% 1.9×, doanh thu organic hỗ trợ tăng mạnh.</li>
                <li>• Edu: cost/lead -35% với Spark Ads + landing tối ưu angle.</li>
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
                  <Music className="w-4 h-4 transition text-violet-700 group-open:rotate-45" />
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
                <h3 className="text-2xl font-extrabold tracking-wide">Bắt đầu tối ưu TikTok Ads cùng 3BOW</h3>
                <p className="text-white/90">Gửi hiện trạng & mục tiêu, đội ngũ sẽ audit nhanh và đề xuất lộ trình phù hợp.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
                <Link href="mailto:contact@3bow.vn?subject=Tư%20vấn%20TikTok%20Ads" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-zinc-900 transition hover:bg-zinc-100 active:scale-[.98] whitespace-nowrap"><Mail className="w-4 h-4" /> Gửi email</Link>
                <Link href="tel:0333415331" className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 transition hover:bg-white/10 active:scale-[.98] whitespace-nowrap"><Phone className="w-4 h-4" /> 033 3415 331</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — TikTok Ads tập trung hiệu quả & dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
