// app/resources/digital-marketing/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Megaphone, Search, Target, Gauge, BarChart3, Users, Layers, FileText, Link2,
  ClipboardCheck, Calendar, Sparkles, ShieldCheck, Database, CheckCircle2, Mail, Phone
} from "lucide-react";

/* ===== UI helpers ===== */
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-zinc-900">
    <span className="relative inline-block">
      {children}
      <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 group-hover:w-full" />
    </span>
  </h2>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="relative p-6 transition-all duration-300 bg-white border group rounded-2xl border-zinc-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
    {/* bottom accent */}
    <span className="absolute inset-x-0 h-px transition-opacity duration-300 opacity-0 pointer-events-none -bottom-px bg-gradient-to-r from-transparent via-violet-200 to-transparent group-hover:opacity-100" />
    {children}
  </div>
);

/* ===== DATA ===== */
const STATS = [
  { k: "Channel playbooks", v: "6+" },
  { k: "Mẫu dashboard", v: "5+" },
  { k: "AB tests/tháng", v: "100+" },
  { k: "Cập nhật", v: "Hàng tháng" },
];

const RESOURCES = [
  { icon: Users, title: "ICP & Persona", desc: "Phác hoạ khách hàng mục tiêu, hành vi & động lực; ưu tiên phân khúc có giá trị cao." },
  { icon: Target, title: "Mục tiêu & KPI", desc: "KPI theo phễu (Awareness → Consideration → Conversion → Retention). Liên kết với doanh thu/LTV." },
  { icon: Gauge, title: "Hệ đo lường", desc: "GA4, GTM, GSC, pixel kênh (Meta/TikTok/Ads), UTM chuẩn, dashboard Looker Studio." },
  { icon: Layers, title: "Hạ tầng & Landing", desc: "Website nhanh, mobile-first, landing theo intent; form tracking, thank-you & event mapping." },
  { icon: FileText, title: "Nội dung & Lịch biên tập", desc: "Content hub, lịch đăng đa kênh; pillar/cluster (SEO), script video ngắn (social)." },
  { icon: Megaphone, title: "Ngân sách & Phân bổ kênh", desc: "Khung phân bổ Paid/Owned/Earned; quy tắc scale & cắt giảm theo hiệu quả." },
  { icon: Database, title: "CRM & Tự động hoá", desc: "Kết nối CRM, offline conversions; email/sms automation, lead scoring." },
  { icon: ShieldCheck, title: "Tuân thủ & Thương hiệu", desc: "Brand guideline; quyền dữ liệu, cookie consent, chính sách ngành." },
  { icon: Calendar, title: "Quy trình & Vai trò", desc: "RACI rõ ràng; lịch review số theo tuần/tháng; changelog & tài liệu hoá quyết định." },
];

const CHECKLIST = [
  "Chuẩn UTM & đặt tên campaign/adgroup/ad nhất quán.",
  "Thiết lập mục tiêu đo lường chung (conversion/lead/sale).",
  "Landing khớp thông điệp (message-match) theo từng kênh.",
  "Xác định ngân sách test & biến cần kiểm chứng mỗi tuần.",
  "Bảng điều khiển trung tâm (Looker Studio) gộp chi phí & kết quả.",
  "Ghi log thay đổi & kết luận sau mỗi thử nghiệm.",
];

const TIPS = [
  { title: "Đừng ‘all-in’ một kênh", desc: "Phân bổ theo phễu & rủi ro. Dùng Attribution + MMM đơn giản để ra quyết định ngân sách." },
  { title: "Tốc độ ra creative", desc: "Thiết lập ‘creative factory’: ý tưởng → sản xuất → test → ghi nhận → tái sử dụng." },
  { title: "Một nguồn dữ liệu sự thật", desc: "Thống nhất dashboard & định nghĩa chỉ số để cả team nhìn cùng một ‘sự thật’." },
  { title: "Tối ưu theo giá trị", desc: "Khi có thể, tối ưu theo giá trị chuyển đổi, LTV/ROAS thay vì chỉ volume leads." },
];

const FAQS = [
  { q: "Doanh nghiệp nhỏ nên bắt đầu kênh nào?", a: "Tập trung 1–2 kênh gần doanh thu nhất (Google Ads, Local SEO), thêm social organic. Đo lường chuẩn trước khi mở rộng." },
  { q: "Khi nào nên làm automation/CRM?", a: "Ngay khi có >50 leads/tuần hoặc chu trình bán hàng dài. CRM giúp nuôi dưỡng & đo chất lượng khách hàng thật." },
  { q: "Cách phân bổ ngân sách test?", a: "Dành 10–20% cho thử nghiệm, 80–90% cho các kênh đã chứng minh hiệu quả. Luôn có tiêu chí dừng/mở rộng rõ ràng." },
];

/* ===== PAGE ===== */
export default function DigitalMarketingKnowledgePage() {
  // JSON-LD
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Tài nguyên", item: "https://3bow.vn/resources" },
      { "@type": "ListItem", position: 3, name: "Digital Marketing", item: "https://3bow.vn/resources/digital-marketing" },
    ],
  };
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Kiến thức Digital Marketing — Tài nguyên, Quy trình & Kinh nghiệm",
    about: "Yêu cầu tài nguyên để chạy digital marketing đa kênh, checklist, tips tối ưu.",
    author: { "@type": "Organization", name: "3BOW DIGITAL" },
    url: "https://3bow.vn/resources/digital-marketing",
  };
  const ldFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <SiteShell>
      <Script id="ld-dm-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-dm-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <Script id="ld-dm-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO with aura + shine */}
        <section className="relative">
          <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=2000&auto=format&fit=crop"
              alt="Kiến thức Digital Marketing – 3BOW DIGITAL"
              fill priority className="object-cover" sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            {/* aura */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-violet-300/30 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-indigo-300/30 blur-3xl" />
            </div>
            {/* center text */}
            <div className="absolute inset-0 grid px-6 text-center place-items-center">
              <div className="group">
                <p className="text-xs md:text-sm text-zinc-700">Tài nguyên – Quy trình – Kinh nghiệm đa kênh</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">
                  TÀI NGUYÊN <span className="text-violet-700">DIGITAL MARKETING</span>
                </h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
                  Bộ khung để bắt đầu đúng, đo lường chuẩn, mở rộng bền vững trên nhiều kênh.
                </p>
              </div>
            </div>
            {/* shine */}
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
            <div className="group">
              <H2>Tài nguyên cần chuẩn bị</H2>
            </div>
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

        {/* CHECKLIST + TIPS */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Checklist triển khai đa kênh</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                {CHECKLIST.map((c, i) => (
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
          <div className="group">
            <H2>Câu hỏi thường gặp</H2>
          </div>
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
            {/* aura + shine */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-white/20 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-white/20 blur-3xl" />
            </div>
            <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-[1200ms] hover:before:translate-x-full" />

            <div className="relative z-[1] flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wide">Cần bộ mẫu triển khai đa kênh?</h3>
                <p className="text-white/90">Gửi bối cảnh & mục tiêu, chúng tôi sẽ chia sẻ template & lộ trình phù hợp quy mô của bạn.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
                <Link
                  href="mailto:contact@3bow.vn?subject=Tài%20nguyên%20Digital%20Marketing"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-zinc-900 transition active:scale-[.98] hover:bg-zinc-100 whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" /> Gửi email
                </Link>
                <Link
                  href="tel:0333415331"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 transition active:scale-[.98] hover:bg-white/10 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" /> 033 3415 331
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — Tài nguyên Digital Marketing dễ hiểu, thực chiến & đo lường theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
