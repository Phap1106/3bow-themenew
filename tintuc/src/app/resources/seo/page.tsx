"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Search,
  BookOpen,
  Target,
  Gauge,
  BarChart3,
  Layers,
  Link2,
  Cpu,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
  Building2,
  Briefcase,
  Store,
  Users,
  FileText,
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
  { k: "Checklist thực hành", v: "12+" },
  { k: "Mẫu template", v: "8+" },
  { k: "Case study", v: "20+" },
  { k: "Cập nhật thuật toán", v: "Hàng tháng" },
];

const ENTERPRISE = {
  icon: Building2,
  title: "Playbook SEO cho Doanh nghiệp LỚN",
  bullets: [
    "Chiến lược theo product line/BU; governance & guideline E-E-A-T.",
    "Technical ở quy mô lớn: CWV, crawl budget, canonical, hreflang, log analysis.",
    "Workflow nội dung: topic committee, CMS workflow, content refresh theo quý.",
    "Attribution & đo lường: GA4 + BigQuery + GSC API; dashboard theo funnel.",
  ],
};

const MID = {
  icon: Briefcase,
  title: "Playbook SEO cho Doanh nghiệp VỪA",
  bullets: [
    "Roadmap 3–6–12 tháng; ưu tiên ‘quick wins’ + nền tảng dài hạn.",
    "Topic cluster quanh nhóm sản phẩm chính; lịch biên tập 2–4 bài/tuần.",
    "Chuẩn hoá schema, internal link & landing theo intent.",
    "Theo dõi nhóm từ khoá cốt lõi + thí nghiệm tiêu đề/metas định kỳ.",
  ],
};

const SMB = {
  icon: Store,
  title: "Playbook SEO cho Doanh nghiệp NHỎ/LOCAL",
  bullets: [
    "Google Business Profile, NAP đồng nhất, đánh giá khách hàng thật.",
    "Trang dịch vụ theo khu vực + câu hỏi/FAQ địa phương hoá.",
    "Content ngắn gọn, hữu ích: HDSD, bảng giá tham khảo, case thật.",
    "Theo dõi calls/directions, tối ưu ảnh, tốc độ & mobile UX.",
  ],
};

const CHECKLIST = [
  "Cài GA4 + GSC + robots.txt + sitemap.xml; kiểm tra index & canonical.",
  "Đo Core Web Vitals (LCP/CLS/INP) & tối ưu ảnh/script/cache.",
  "Nghiên cứu từ khoá theo intent; lập topic cluster & keyword map.",
  "Tạo trang trụ cột (pillar) + trang hỗ trợ (cluster) có internal link rõ ràng.",
  "Triển khai schema (Organization, Article, Product, FAQ) khi phù hợp.",
  "Thiết lập dashboard Looker Studio; review số theo tuần/tháng.",
];

const FAQs = [
  { q: "Doanh nghiệp lớn nên bắt đầu SEO từ đâu?", a: "Bắt đầu bằng audit kỹ thuật ở quy mô lớn (CWV, crawl budget, hreflang, canonical), sau đó chuẩn hoá governance nội dung (E-E-A-T) và dashboard đo lường (GA4 + BigQuery + GSC API)." },
  { q: "Doanh nghiệp vừa/SMB nên ưu tiên gì?", a: "Ưu tiên quick wins: sửa lỗi kỹ thuật cơ bản, tối ưu title/meta, internal link, tạo trang trụ cột theo nhóm sản phẩm/dịch vụ và nội dung hỗ trợ theo câu hỏi thật của khách hàng." },
  { q: "Local business cần làm gì với SEO?", a: "Tối ưu Google Business Profile, NAP đồng nhất, trang dịch vụ địa phương hoá, schema FAQ/LocalBusiness và theo dõi calls/directions để đo chất lượng." },
  { q: "Bao lâu có kết quả?", a: "Tuỳ ngành & cạnh tranh: 6–12 tuần có thể thấy chuyển biến từ quick wins, 3–6–12 tháng cho tác động bền vững theo roadmap." },
];

/* ===== PAGE ===== */
export default function SEOResourcesPage() {
  // JSON-LD
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://3bow.vn/" },
      { "@type": "ListItem", position: 2, name: "Tài nguyên", item: "https://3bow.vn/resources" },
      { "@type": "ListItem", position: 3, name: "SEO", item: "https://3bow.vn/resources/seo" },
    ],
  };
  const ldArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Tài nguyên & Kinh nghiệm SEO — cho doanh nghiệp lớn, vừa và nhỏ",
    about: "SEO cho enterprise, mid-market và SMB; checklist, playbook, đo lường theo dữ liệu.",
    author: { "@type": "Organization", name: "3BOW DIGITAL" },
    url: "https://3bow.vn/resources/seo",
  };
  const ldFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <SiteShell>
      <Script id="ld-res-seo-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Script id="ld-res-seo-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }} />
      <Script id="ld-res-seo-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFAQ) }} />

      <main className="bg-white text-zinc-900">
        {/* HERO with aura + shine */}
        <section className="relative">
          <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=2000&auto=format&fit=crop"
              alt="Tài nguyên & chia sẻ kinh nghiệm SEO – 3BOW DIGITAL"
              fill priority className="object-cover" sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-violet-300/30 blur-3xl" />
              <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-indigo-300/30 blur-3xl" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 text-center">
                <p className="text-xs md:text-sm text-zinc-700">Chia sẻ dễ hiểu – thực chiến – đo lường minh bạch</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-zinc-900/90">
                  TÀI NGUYÊN <span className="text-violet-700">SEO</span> CHO MỌI DOANH NGHIỆP
                </h1>
                <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
                  Hệ thống hoá kiến thức & kinh nghiệm SEO dành cho doanh nghiệp lớn, vừa và nhỏ – tập trung vào kết quả đo được.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link href="#checklist" className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800">
                    <ClipboardCheck className="w-4 h-4" /> Checklist nhanh
                  </Link>
                  <Link href="#playbooks" className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl hover:bg-zinc-50">
                    <BookOpen className="w-4 h-4" /> Playbooks theo quy mô
                  </Link>
                </div>
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

        {/* CORE PRINCIPLES */}
        <section className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <H2>Nguyên tắc cốt lõi của SEO bền vững</H2>
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Search, title: "Hiểu Ý Định (Intent)", desc: "Nội dung xoay quanh câu hỏi thật của khách hàng — không nhồi từ khoá." },
                { icon: Cpu, title: "Kỹ thuật chuẩn", desc: "Site nhanh, ổn định, crawl/index mượt; dữ liệu có cấu trúc & CWV tốt." },
                { icon: Link2, title: "Entity & Liên kết sạch", desc: "Xây thương hiệu & liên kết liên quan chủ đề; tránh kỹ thuật rủi ro." },
                { icon: BarChart3, title: "Đo lường minh bạch", desc: "GA4/GSC + dashboard; quyết định dựa trên số liệu kinh doanh." },
              ].map((p) => (
                <Card key={p.title}>
                  <p.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{p.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PLAYBOOKS BY SIZE */}
        <section id="playbooks" className="max-w-6xl px-6 py-12 mx-auto">
          <H2>Playbooks theo quy mô doanh nghiệp</H2>
          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {[ENTERPRISE, MID, SMB].map((pb) => (
              <Card key={pb.title}>
                <pb.icon className="w-6 h-6 text-violet-700" />
                <div className="mt-3 text-lg font-semibold">{pb.title}</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  {pb.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-violet-700" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* CHECKLIST */}
        <section id="checklist" className="py-12 bg-zinc-50">
          <div className="max-w-6xl px-6 mx-auto">
            <H2>Checklist Audit SEO 30 phút</H2>
            <div className="grid gap-6 mt-6 lg:grid-cols-2">
              <Card>
                <div className="flex items-center gap-3">
                  <Gauge className="w-6 h-6 text-violet-700" />
                  <div className="text-lg font-semibold">Kỹ thuật & Hiệu năng</div>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  {CHECKLIST.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <Layers className="mt-0.5 h-4 w-4 text-violet-700" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-violet-700" />
                  <div className="text-lg font-semibold">Nội dung & Đo lường</div>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                  {CHECKLIST.slice(3).map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <Layers className="mt-0.5 h-4 w-4 text-violet-700" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* TEMPLATES & BÀI VIẾT GỢI Ý */}
        <section className="max-w-6xl px-6 py-12 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Templates khuyến nghị</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• Keyword Map & Topic Cluster (Google Sheets).</li>
                <li>• Brief nội dung chuẩn E-E-A-T (Docs).</li>
                <li>• Quy trình On-page & Schema checklist.</li>
                <li>• Dashboard Looker Studio mẫu cho SEO.</li>
              </ul>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-violet-700" />
                <div className="text-lg font-semibold">Bài viết nên đọc</div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• Tư duy chọn chủ đề theo Intent thay vì chỉ đếm từ khoá.</li>
                <li>• Case: tăng 3× organic leads trong 6 tháng với 6 cluster.</li>
                <li>• Hướng dẫn đọc số GA4 + GSC để ra quyết định hàng tuần.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl px-6 pb-12 mx-auto">
          <H2>Câu hỏi thường gặp</H2>
          <div className="mt-6 bg-white border divide-y rounded-2xl border-zinc-200">
            {FAQs.map((f, i) => (
              <details key={i} className="p-6 transition-colors group hover:bg-zinc-50/60">
                <summary className="flex items-center justify-between gap-4 list-none cursor-pointer">
                  <span className="font-medium">{f.q}</span>
                  <ShieldCheck className="w-4 h-4 transition text-violet-700 group-open:rotate-12" />
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
            <div className="relative z-[1] flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <h3 className="text-2xl font-extrabold tracking-wide">Cần một lộ trình SEO rõ ràng?</h3>
                <p className="text-white/90">Gửi hiện trạng & mục tiêu, chúng tôi sẽ tư vấn hướng đi phù hợp cho quy mô doanh nghiệp của bạn.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
                <Link
                  href="mailto:contact@3bow.vn?subject=Tư%20vấn%20SEO%20-%20Resources"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-zinc-900 transition hover:bg-zinc-100 active:scale-[.98] whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" /> Gửi email
                </Link>
                <Link
                  href="tel:0333415331"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 transition hover:bg-white/10 active:scale-[.98] whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" /> 033 3415 331
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="px-6 pb-10 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — Chia sẻ SEO dễ hiểu, thực chiến & đo lường theo dữ liệu.
        </section>
      </main>
    </SiteShell>
  );
}
