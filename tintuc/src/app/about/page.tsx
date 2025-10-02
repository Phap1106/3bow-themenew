// src/app/about/page.tsx
import Image from "next/image";
import { Metadata } from "next";
import SiteShell from "@/components/siteHeaderFooter";
import {
  BarChart3,
  Rocket,
  ShieldCheck,
  Users,
  Sparkles,
  LineChart,
} from "lucide-react";

import heroBg from "@/app/image/about/3bow-about-bg.jpg";
import teamImg from "@/app/image/about/3bow-team.jpg";

export const metadata: Metadata = {
  title: "Về 3BOW Digital | About Us",
  description:
    "3BOW Digital: agency digital hiệu suất, tập trung KPI tăng trưởng. Dịch vụ SEO, Performance Ads, Content, Web & Data. Minh bạch đo lường, tối ưu chi phí.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Về 3BOW Digital | Agency Digital hiệu suất",
    description:
      "Đồng hành tăng trưởng bền vững bằng dữ liệu: SEO toàn phễu, Paid Ads, Content, Website & Dashboard KPI.",
  },
};

/* ========= SMALL UI PRIMS ========= */
function Watermark({ text }: { text: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-10 left-0 select-none text-[9vw] font-extrabold uppercase tracking-tight text-zinc-900/5 sm:-top-12 md:-top-16 lg:text-[7vw]"
    >
      {text}
    </span>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="h-1 w-14 bg-amber-400" />
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
        {children}
      </h2>
    </div>
  );
}

type RowProps = {
  title: string;
  wm: string;
  desc: React.ReactNode;
  image: any;
  imageAlt: string;
  reverse?: boolean;
};
function SectionRow({ title, wm, desc, image, imageAlt, reverse }: RowProps) {
  return (
    <section className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:py-16">
      <div
        className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        {/* Text */}
        <div className="relative">
          <Watermark text={wm} />
          <Headline>{title}</Headline>
          <div className="mt-5 space-y-4 text-zinc-700 sm:text-lg">{desc}</div>
        </div>
        {/* Image (góc vuông + bóng nhẹ, hover tinh tế) */}
        <div className="overflow-hidden transition bg-white border shadow-sm border-zinc-200">
          <Image
            src={image}
            alt={imageAlt}
            className="object-cover w-full h-72 sm:h-96"
            sizes="(min-width:1024px) 640px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

/* ========= PAGE ========= */
export default function AboutPage() {
  return (
    <SiteShell>
      {/* HERO: chữ 1 bên, ảnh nền 1 bên (cover), headline gạch màu, watermark mờ */}
      <header className="relative isolate">
        {/* BG image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroBg}
            alt="Không khí làm việc tại 3BOW Digital"
            className="object-cover w-full h-full"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-zinc-900/50" />
        </div>

        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:py-32">
          <div className="relative max-w-3xl text-white">
            <Watermark text="ABOUT" />
            <div className="h-1 w-14 bg-amber-400" />
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Về <span className="text-amber-300">3BOW Digital</span>
            </h1>
            <p className="mt-5 text-white/90 sm:text-lg">
              Chúng tôi là đội ngũ digital hiệu suất, lấy dữ liệu làm trung tâm
              để thúc đẩy tăng trưởng bền vững. Tập trung SEO toàn phễu,
              Performance Ads, Content &amp; Creative, Website chuẩn chuyển đổi
              và hệ thống dashboard KPI minh bạch. Mọi quyết định đều dựa trên
              dữ liệu – không phỏng đoán.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 font-semibold transition border border-transparent shadow-sm bg-amber-400 text-zinc-900 hover:brightness-95"
              >
                Nhận tư vấn miễn phí
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center justify-center px-5 py-3 font-semibold text-white transition border border-white/30 hover:bg-white/10"
              >
                Xem case study
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ROW 1: Chúng tôi là ai */}
      <SectionRow
        wm="IDENTITY"
        title="Chúng tôi là ai?"
        image={teamImg}
        imageAlt="Đội ngũ 3BOW Digital"
        desc={
          <>
            <p>
              3BOW Digital được thành lập để trả lời một câu hỏi đơn giản:{" "}
              <strong>Digital có tạo ra kết quả thật không?</strong> Chúng tôi
              nói “Có” – khi chiến lược được xây trên dữ liệu, vận hành tinh
              gọn và đo lường minh bạch. Mỗi dự án bắt đầu từ vấn đề kinh
              doanh, hành vi người dùng và thị trường, thay vì chạy theo trào
              lưu hay vanity metrics.
            </p>
            <p>
              Năng lực cốt lõi gồm{" "}
              <em>SEO toàn phễu, Paid Ads, Content &amp; Creative, Website</em>{" "}
              cùng <em>dashboard KPI thời gian thực</em>. Nhờ quy trình thử
              nghiệm nhanh (A/B, multivariate) và cải tiến liên tục, chúng tôi
              tối ưu ngân sách theo vòng đời khách hàng – giúp bạn có
              <strong> tăng trưởng bền vững</strong> thay vì những “đỉnh cao”
              ngắn hạn.
            </p>
          </>
        }
      />

      {/* ROW 2: Triết lý – đảo chiều */}
      <SectionRow
        reverse
        wm="PRINCIPLES"
        title="Triết lý vận hành"
        image={heroBg}
        imageAlt="Văn hóa vận hành tại 3BOW"
        desc={
          <>
            <ul className="grid gap-2 pl-5 list-disc">
              <li>
                <strong>Data-driven:</strong> quyết định dựa trên dữ liệu; từ
                nghiên cứu thị trường, từ khóa đến dự báo ROI.
              </li>
              <li>
                <strong>Fast iteration:</strong> triển khai nhanh – đo lường –
                tối ưu liên tục theo tín hiệu người dùng.
              </li>
              <li>
                <strong>Transparency:</strong> báo cáo rõ ràng, truy vết từng
                đồng chi phí đến kết quả.
              </li>
              <li>
                <strong>Long-term assets:</strong> ưu tiên tài sản bền vững:
                SEO, nội dung chuẩn hóa, dữ liệu sở hữu.
              </li>
            </ul>
            <p>
              Mục tiêu cuối cùng của chúng tôi không phải “đẹp” mà là{" "}
              <strong>hiệu quả thực</strong>: lead chất lượng, tỉ lệ chuyển đổi,
              doanh thu và giá trị vòng đời khách hàng.
            </p>
          </>
        }
      />

      {/* STATS + VALUE (góc vuông, đồng bộ) */}
      <section className="px-4 pb-6 mx-auto max-w-7xl sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Rocket, k: "180+", v: "Dự án triển khai" },
            { icon: BarChart3, k: "3–10×", v: "Tăng trưởng organic/ads" },
            { icon: ShieldCheck, k: "75%", v: "Top 3 từ khóa cốt lõi" },
            { icon: Users, k: "12+", v: "Ngành đã phục vụ" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 transition bg-white border shadow-sm border-zinc-200 hover:shadow-md"
            >
              <s.icon className="size-9 text-zinc-900" />
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-zinc-900">
                  {s.k}
                </div>
                <div className="text-sm text-zinc-600">{s.v}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Sáng tạo có mục tiêu",
              desc: "Ý tưởng đẹp nhưng luôn gắn KPI. Nội dung dẫn dắt người dùng, thúc đẩy chuyển đổi.",
            },
            {
              icon: LineChart,
              title: "Minh bạch & dữ liệu",
              desc: "Dashboard realtime, theo dõi phễu AARRR, rõ chi phí – rõ hiệu quả.",
            },
            {
              icon: ShieldCheck,
              title: "Bền vững & an toàn",
              desc: "Tuân thủ chính sách nền tảng. Xây tài sản dài hạn: SEO, data, nội dung chuẩn.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <v.icon className="size-7 text-zinc-900" />
              <h4 className="mt-3 text-lg font-semibold text-zinc-900">
                {v.title}
              </h4>
              <p className="mt-1 text-zinc-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROW 3: Cam kết */}
      <SectionRow
        wm="COMMITMENT"
        title="Cam kết tăng trưởng"
        image={teamImg}
        imageAlt="Cam kết của 3BOW Digital"
        desc={
          <>
            <p>
              3BOW chỉ hứa những điều có thể đo lường. Chúng tôi đồng thiết lập
              KPI theo mục tiêu kinh doanh: <em>lead/SQL, CAC, ROAS, LTV</em>,
              tỉ lệ chuyển đổi landing/checkout… Mỗi sprint đều có giả thuyết,
              kế hoạch thử nghiệm, mốc đánh giá và hành động tối ưu.
            </p>
            <p>
              Là đối tác, bạn được chia sẻ{" "}
              <strong>toàn quyền truy cập báo cáo</strong>, log thay đổi và dữ
              liệu thô. Tinh thần đồng hành – kỷ luật – trách nhiệm là kim chỉ
              nam trong mọi dự án.
            </p>
          </>
        }
      />

      {/* CTA cuối trang (vuông, tối giản) */}
      <section className="px-4 mx-auto my-10 max-w-7xl sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 text-white border shadow-sm border-zinc-800 bg-zinc-900 sm:flex-row sm:items-center">
          <div>
            <div className="h-1 w-14 bg-amber-400" />
            <h3 className="mt-4 text-2xl font-bold">
              Sẵn sàng tăng trưởng cùng 3BOW?
            </h3>
            <p className="mt-1 text-white/85">
              Nhận báo cáo nhanh website/kênh hiện tại và lộ trình ưu tiên trong
              7–14 ngày.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/contact"
              className="px-5 py-3 font-semibold transition border border-transparent bg-amber-400 text-zinc-900 hover:brightness-95"
            >
              Liên hệ ngay
            </a>
            <a
              href="/services"
              className="px-5 py-3 font-semibold text-white transition border border-white/30 hover:bg-white/10"
            >
              Dịch vụ của chúng tôi
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}





