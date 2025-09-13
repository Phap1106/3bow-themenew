"use client";

import React, { type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import {
  BadgeCheck, BarChart3, Target, Rocket, Users, Megaphone, Search, Sparkles,
  LineChart, Layers, Server, ShieldCheck, BookOpen, HeartHandshake, Boxes,
  FileText, Mail, Phone,
} from "lucide-react";

type Department = {
  id: string;
  name: string;
  icon: ComponentType<any>;
  mission: string;
  bullets: string[];
  openings?: string[];
};

const stats = [
  { label: "Năm kinh nghiệm", value: "13+" },
  { label: "Khách hàng doanh nghiệp", value: "350+" },
  { label: "Chiến dịch triển khai", value: "4,500+" },
  { label: "Tỷ lệ duy trì", value: "92%" },
];

const leaders = [
  {
    name: "Nguyễn Minh Khoa",
    title: "Founder & CEO",
    quote:
      "Lấy khách hàng làm trung tâm, minh bạch dữ liệu và cam kết kết quả đo được.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Lê Bảo Trâm",
    title: "Head of Performance",
    quote: "Mọi quyết định chạy Ads dựa trên dữ liệu thật và thử nghiệm có kiểm soát.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Phạm Quốc Huy",
    title: "Head of SEO",
    quote: "SEO bền vững = Insight người dùng + Kỹ thuật + Nội dung hữu ích.",
    img: "https://images.unsplash.com/photo-1603415526960-f7e0328d13f9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Trần Hoài Nam",
    title: "Head of Data & Tech",
    quote: "Kết nối dữ liệu end-to-end và tự động hoá để hành động nhanh, chuẩn xác.",
    img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
  },
];

const departments: Department[] = [
  {
    id: "performance",
    name: "Performance Marketing",
    icon: Megaphone,
    mission: "Tăng trưởng doanh thu có kiểm soát chi phí (Google/Meta/TikTok Ads).",
    bullets: [
      "Khung đo lường chuẩn (GTM/GA4, conversion, offline events).",
      "Chiến lược ngân sách, cấu trúc tài khoản, A/B testing.",
      "Báo cáo minh bạch hằng ngày (Sheets/Looker Studio).",
    ],
    openings: ["Performance Executive", "Media Buyer", "AdOps Lead"],
  },
  {
    id: "seo",
    name: "SEO & Organic Growth",
    icon: Search,
    mission: "Tăng trưởng tự nhiên bền vững dựa trên UX & kỹ thuật.",
    bullets: ["Audit kỹ thuật + roadmap 3–6–12 tháng", "Topic cluster, E-E-A-T, CWV", "On-page/Schema chuẩn"],
    openings: ["SEO Specialist", "Content Strategist", "Tech SEO"],
  },
  {
    id: "creative",
    name: "Creative & Content",
    icon: Sparkles,
    mission: "Nội dung & ấn phẩm đa kênh tập trung chuyển đổi.",
    bullets: ["Script video ngắn, landing content", "Brand guideline, asset tái sử dụng", "Testing framework"],
    openings: ["Copywriter", "Content Producer", "Designer (KV/Video)"],
  },
  {
    id: "data",
    name: "Data & Analytics",
    icon: BarChart3,
    mission: "Thu thập – xử lý – trực quan hoá dữ liệu để ra quyết định nhanh.",
    bullets: ["GA4/GTM, server-side tracking", "BI Dashboard & alert", "KPI theo phễu AARRR"],
    openings: ["Data Analyst", "BI Engineer", "Attribution Specialist"],
  },
  {
    id: "product",
    name: "Product & Technology",
    icon: Server,
    mission: "Công cụ & sản phẩm (Next.js, NestJS, AI, n8n).",
    bullets: ["Chatbot/Agent AI & báo cáo tự động", "Landing/CMS, tracking server-side", "Tích hợp CRM/ERP"],
    openings: ["Full-stack (Next/Nest)", "Automation (n8n)", "ML/AI Engineer"],
  },
  {
    id: "cs",
    name: "Customer Success & Ops",
    icon: HeartHandshake,
    mission: "Đảm bảo SLA, họp định kỳ, báo cáo minh bạch – trải nghiệm mượt.",
    bullets: ["Onboarding & QBR", "Checklist xử lý sự cố", "Quản trị playbook"],
    openings: ["CS Executive", "Project Ops", "Account Manager"],
  },
  {
    id: "hr",
    name: "People & Culture (HR)",
    icon: Users,
    mission: "Thu hút – phát triển – giữ chân nhân tài với môi trường tôn trọng.",
    bullets: ["Khung năng lực & lộ trình", "OKR, 360° review", "Phúc lợi linh hoạt"],
    openings: ["HRBP", "Talent Acquisition", "People Ops"],
  },
  {
    id: "finance",
    name: "Finance & Legal",
    icon: ShieldCheck,
    mission: "Minh bạch tài chính, quản trị rủi ro pháp lý & tuân thủ.",
    bullets: ["PO/đối soát/hoá đơn", "NDA & bảo mật dữ liệu", "Báo cáo quản trị"],
    openings: ["Finance Executive", "Legal Officer"],
  },
  {
    id: "strategy",
    name: "Strategy & Growth",
    icon: Target,
    mission: "Định vị dịch vụ, tiêu chuẩn hoá quy trình & tăng trưởng dài hạn.",
    bullets: ["Research thị trường/ICP", "Thiết kế gói giá trị", "Lộ trình giải pháp theo ngành"],
    openings: ["Growth Strategist", "Solutions Consultant"],
  },
  {
    id: "sales",
    name: "Sales & Partnerships",
    icon: HeartHandshake,
    mission: "Mở rộng hợp tác, đồng xây giải pháp đem lại kết quả.",
    bullets: ["Playbook bán hàng đo lường theo CRM", "Đối tác công nghệ", "Case study/POC"],
    openings: ["B2B Sales", "Partnership Manager"],
  },
];

const values = [
  { icon: BadgeCheck, title: "Chính trực & Minh bạch", desc: "Số liệu rõ ràng, báo cáo hằng ngày." },
  { icon: LineChart,  title: "Tập trung Kết quả",       desc: "Tối ưu theo doanh thu, CPA, ROAS, LTV." },
  { icon: Layers,     title: "Tinh gọn & Tự động hoá",  desc: "Chuẩn hoá quy trình, nhân bội hiệu suất." },
  { icon: BookOpen,   title: "Học hỏi suốt đời",        desc: "Mentor/mentee, review định kỳ." },
  { icon: Users,      title: "Tôn trọng cá nhân",       desc: "Mỗi cá nhân là một màu sắc riêng." },
];

export default function CareersPage() {
  return (
    <SiteShell>
      <div className="min-h-screen bg-white text-zinc-900">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white" />
          <div className="relative pt-16 pb-10 container-max">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-sm border rounded-full text-zinc-600">
                <Boxes className="w-4 h-4" />
                Đội ngũ 3BOW DIGITAL
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-0.02em] md:text-6xl">
                Tăng trưởng thông minh, <span className="text-violet-700">bền vững</span> theo dữ liệu
              </h1>
              <p className="max-w-2xl mt-4 text-lg text-zinc-600">
                Chúng tôi là tập hợp những người yêu thích số liệu, sáng tạo và kỷ luật.
                Mục tiêu: tạo ra <b>kết quả đo được</b> bằng chiến lược rõ ràng, thực thi tinh gọn, báo cáo minh bạch.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="#open-roles"
                  className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl bg-violet-700 hover:bg-violet-800"
                >
                  <Rocket className="w-4 h-4" />
                  Xem vị trí đang mở
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3 border rounded-xl text-zinc-800 hover:bg-zinc-50"
                >
                  <Mail className="w-4 h-4" />
                  Liên hệ hợp tác
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 mt-12 sm:grid-cols-2 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="p-6 bg-white border shadow-sm rounded-2xl">
                  <div className="text-3xl font-bold text-violet-700">{s.value}</div>
                  <div className="mt-1 text-sm text-zinc-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section className="py-12 container-max">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ban lãnh đạo & Hạt nhân chuyên môn</h2>
          <p className="max-w-3xl mt-2 text-zinc-600">
            Dẫn dắt tiêu chuẩn nghề nghiệp, bảo trợ phương pháp và văn hoá minh bạch – chính trực – khách hàng là trung tâm.
          </p>
          <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((m) => (
              <div key={m.name} className="p-4 transition bg-white border shadow-sm group rounded-2xl hover:shadow-md">
                <div className="relative w-full h-48 overflow-hidden rounded-xl">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="mt-4">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-zinc-600">{m.title}</div>
                  <p className="mt-2 text-sm italic text-zinc-700">“{m.quote}”</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VALUES */}
        <section className="py-12 bg-zinc-50">
          <div className="container-max">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Giá trị cốt lõi</h2>
            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-5">
              {values.map((v) => (
                <div key={v.title} className="p-6 bg-white border rounded-2xl">
                  <v.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{v.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEPARTMENTS */}
        <section id="open-roles" className="py-12 container-max">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Phòng ban & Vai trò</h2>
              <p className="max-w-3xl mt-2 text-zinc-600">
                Cấu trúc rõ ràng, mục tiêu đo được. Mỗi đội chịu trách nhiệm đầu ra và phối hợp chặt chẽ qua cùng một hệ đo lường.
              </p>
            </div>
            <Link href="#process" className="hidden px-4 py-2 text-sm border rounded-xl hover:bg-zinc-50 md:inline-flex">
              <FileText className="w-4 h-4 mr-2" />
              Quy trình tuyển dụng
            </Link>
          </div>

          <div className="grid gap-6 mt-8 md:grid-cols-2">
            {departments.map((d) => (
              <div key={d.id} className="p-6 border rounded-2xl">
                <div className="flex items-center gap-3">
                  <d.icon className="w-6 h-6 text-violet-700" />
                  <div className="text-lg font-semibold">{d.name}</div>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{d.mission}</p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                  {d.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-violet-700" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {d.openings?.length ? (
                  <div className="mt-4">
                    <div className="text-sm font-medium">Vị trí đang mở:</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {d.openings.map((o) => (
                        <span key={o} className="px-3 py-1 text-xs border rounded-full">
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-12 bg-zinc-50">
          <div className="container-max">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Quy trình tuyển dụng tinh gọn</h2>
            <div className="grid gap-4 mt-6 md:grid-cols-4">
              {[
                { icon: FileText, title: "Gửi CV/Portfolio", desc: "Điền form & chia sẻ case bạn tự hào nhất." },
                { icon: Users, title: "Phỏng vấn chuyên môn", desc: "Tư duy, quy trình & cách bạn đo lường." },
                { icon: Rocket, title: "Bài test ngắn", desc: "Bài tập 2–4 giờ hoặc trình bày case cũ." },
                { icon: BadgeCheck, title: "Offer & Onboarding", desc: "Rõ chức năng, KPI, mentor & lộ trình 90 ngày." },
              ].map((step) => (
                <div key={step.title} className="p-6 bg-white border rounded-2xl">
                  <step.icon className="w-6 h-6 text-violet-700" />
                  <div className="mt-3 font-semibold">{step.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-12 container-max">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Chế độ & Môi trường làm việc</h2>
          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: HeartHandshake, text: "Văn hoá tôn trọng, phản hồi thẳng – lịch sự." },
              { icon: BookOpen, text: "Ngân sách học tập & chứng chỉ hằng năm." },
              { icon: BarChart3, text: "OKR rõ ràng, đánh giá theo kết quả đo được." },
              { icon: Server, text: "Công cụ: Notion, Slack, Linear, n8n, Looker Studio." },
              { icon: ShieldCheck, text: "Bảo mật & an toàn dữ liệu nghiêm ngặt." },
              { icon: HeartHandshake, text: "Team building/retreat định kỳ, phúc lợi linh hoạt." },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 border rounded-2xl">
                <b.icon className="mt-0.5 h-5 w-5 text-violet-700" />
                <p className="text-sm text-zinc-700">{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-12 bg-zinc-900 text-zinc-100">
          <div className="container-max">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-semibold tracking-[-0.01em]">Sẵn sàng đồng hành cùng 3BOW?</h3>
                <p className="max-w-2xl mt-2 text-zinc-300">
                  Gửi CV/portfolio và một đoạn giới thiệu ngắn về mục tiêu nghề nghiệp. Chúng tôi đọc từng hồ sơ và phản hồi sớm nhất.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="mailto:contact@3bow.vn?subject=Ung%20tuyen%20tai%203BOW%20DIGITAL"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-xl text-zinc-900 hover:bg-zinc-100"
                >
                  <Mail className="w-4 h-4" />
                  Gửi CV: contact@3bow.vn
                </Link>
                <Link
                  href="tel:0333415331"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border rounded-xl border-zinc-700 hover:bg-zinc-800"
                >
                  <Phone className="w-4 h-4" />
                  033 3415 331
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="px-6 py-8 text-sm text-center text-zinc-500">
          © {new Date().getFullYear()} 3BOW DIGITAL — “Làm đúng ngay từ đầu. Đo lường, minh bạch, bền vững.”
        </section>
      </div>
    </SiteShell>
  );
}
