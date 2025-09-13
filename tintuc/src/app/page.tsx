"use client";

import Link from "next/link";
import { ReactNode, useRef } from "react";
import SiteShell from "@/components/siteHeaderFooter";
// import ChatWidget from "@/components/chat/ChatWidget";
import {
  ChevronRight,
  Star,
  LineChart,
  Rocket,
  Target,
  Megaphone,
  Building2,
  Users,
} from "lucide-react";

/* animations + form */
import FadeUp from "@/components/anim/FadeUp";
import ContactFormRHF from "@/components/forms/ContactFormRHF";

/* ====== LOGO KHÁCH HÀNG (static import) ====== */
import dn1 from "@/app/image/logo_doanhnghiep/dn1.png";
import dn2 from "@/app/image/logo_doanhnghiep/dn2.png";
import dn3 from "@/app/image/logo_doanhnghiep/dn3.png";
import dn4 from "@/app/image/logo_doanhnghiep/dn4.jpg";
import dn5 from "@/app/image/logo_doanhnghiep/dn5.jpg";
import dn6 from "@/app/image/logo_doanhnghiep/dn6.png";
import dn7 from "@/app/image/logo_doanhnghiep/dn7.png";
import dn8 from "@/app/image/logo_doanhnghiep/dn8.jpg";
import dn9 from "@/app/image/logo_doanhnghiep/dn9.jpg";
import dn10 from "@/app/image/logo_doanhnghiep/dn10.jpg";
import dn11 from "@/app/image/logo_doanhnghiep/dn11.jpg";
import dn12 from "@/app/image/logo_doanhnghiep/dn12.jpg";
import machinelearn from "@/app/image/machinelearning.jpg";
import fbads from "@/app/image/fbads.jpg";
import googleads from "@/app/image/ggads.jpg";
import tiktokads from "@/app/image/tikads.jpg";
import ddgg from "@/app/image/ddg.jpg";
import ddseo from "@/app/image/ddt.jpg";
import ddyou from "@/app/image/ddy.jpg";
import ddit from "@/app/image/ddit.jpg";
import team from "@/app/image/team.jpg";
import Image, { type StaticImageData } from "next/image";
/* ====== HELPERS ====== */
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl">
    {children}
  </h2>
);

export default function Page() {
  return (
    <SiteShell>
      <HeroBanner />

      <FadeUp>
        <IntroCard />
      </FadeUp>
      <FadeUp>
        <PartnerGrid />
      </FadeUp>
      <FadeUp>
        <FeaturedProjects />
      </FadeUp>
      <FadeUp>
        <AwardsStrip />
      </FadeUp>
      <FadeUp>
        <Testimonials />
      </FadeUp>
      <FadeUp>
        <Services />
      </FadeUp>
      <FadeUp>
        <NewsPreview />
      </FadeUp>
      <FadeUp>
        <TeamSection />
      </FadeUp>
      <FadeUp>
        <ContactSplit />
      </FadeUp>
      <FadeUp>
        <PremiumPartners />
      </FadeUp>
      <FadeUp>
        <CTA />
      </FadeUp>
       {/* <ChatWidget /> */}
    </SiteShell>
  );
}

/* ================= HERO ================= */
function HeroBanner() {
  return (
    <section className="relative">
      <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=2000&auto=format&fit=crop"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        {/* lớp phủ giúp chữ dễ đọc nhưng vẫn nhẹ nhàng */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/35 to-white/0" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 text-center">
            <p className="text-[13px] md:text-sm font-medium text-zinc-600">
              chuỗi ngày dài đồng hành cùng <b>2000 doanh nghiệp</b>
            </p>

            {/* ⬇️ Tiêu đề: IN HOA + màu nhạt hơn + tracking thoáng */}
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-wide uppercase md:text-5xl md:tracking-wider text-zinc-900">
              TĂNG TRƯỞNG THÔNG MINH, BỀN VỮNG THEO DỮ LIỆU.
            </h1>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-full -mt-6 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-10" />
    </section>
  );
}

/* ================= CARD GIỚI THIỆU ================= */
function IntroCard() {
  return (
    <section className="relative z-[1] -mt-6 pb-8">
      <div className="mx-auto w-[92%] max-w-6xl rounded-[28px] border border-zinc-200 bg-white px-6 py-10 md:px-10 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-[12px] font-semibold text-zinc-600">
              VIDEO GIỚI THIỆU
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-wide uppercase md:text-4xl text-zinc-900/90">
              13 NĂM KIẾN TẠO{" "}
              <span className="text-violet-600">TĂNG TRƯỞNG BỀN VỮNG</span>
            </h2>

            <p className="mt-3 text-zinc-600">
              Chúng tôi đem lại giá trị thực bằng nghiên cứu, chuẩn hoá quy
              trình và thực thi phù hợp thị trường Việt Nam.
            </p>
            <a
              href="#projects"
              className="inline-flex mt-5 btn btn-primary btn-raise"
            >
              Xem video <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-zinc-200">
            <Image
              // src="https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=1600&auto=format&fit=crop"
              src={machinelearn}
              alt="Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= LƯỚI LOGO ĐỐI TÁC ================= */
function PartnerGrid() {
  const source = [
    dn1,
    dn2,
    dn3,
    dn4,
    dn5,
    dn6,
    dn7,
    dn8,
    dn9,
    dn10,
    dn11,
    dn12,
  ];
  return (
    <section className="bg-[#F7FBFF] py-14">
      <div className="container-max">
        <H2>
          <span className="tracking-wide uppercase text-zinc-900/90">
            3BOW – <span className="text-violet-600/90">ĐỐI TÁC</span>{" "}
            CỦA NHỮNG DOANH NGHIỆP LỚN TẠI VIỆT NAM
          </span>
        </H2>

        <div className="grid grid-cols-2 gap-6 mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {source.map((src, i) => (
            <div key={i} className="relative w-40 h-16 mx-auto opacity-90">
              <Image
                src={src}
                alt={`logo-${i}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= DỰ ÁN NỔI BẬT ================= */
function FeaturedProjects() {
  const items = [
    {
      title: "Facebook Ads — scale Advantage+ giữ CPA thấp",
      img: fbads,
      metrics: [
        { k: "x4.8", v: "ROAS" },
        { k: "-32%", v: "CPA" },
      ],
    },
    {
      title: "Google Ads — Search + PMax bùng nổ Leads",
      img: googleads,
      metrics: [
        { k: "1.2K", v: "Leads" },
        { k: "-37%", v: "CPL" },
      ],
    },
    {
      title: "TikTok Ads — video ngắn kéo chuyển đổi",
      img: tiktokads,
      metrics: [
        { k: "+35%", v: "CTR" },
        { k: "-28%", v: "CPI" },
      ],
    },
  ] as const;

  return (
    <section id="projects" className="py-14">
      <div className="container-max">
        <H2>
          DỰ ÁN <span className="text-violet-600">NỔI BẬT</span>
        </H2>
        <p className="mt-2 text-center text-zinc-600">
          Hơn 900+ dự án SEO và 10.000+ chiến dịch quảng cáo thành công
        </p>

        <div className="grid gap-6 mt-8 md:grid-cols-3">
          {items.map((x) => (
            <article
              key={x.title}
              className="
                group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm
                transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl
                before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4
                before:-skew-x-12 before:bg-white/30 before:opacity-0 before:transition-all before:duration-700
                group-hover:before:left-[110%] group-hover:before:opacity-100
              "
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={x.img}
                  alt={x.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* overlay mềm khi hover */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-t from-black/20 via-black/0 to-transparent group-hover:opacity-100" />
              </div>

              <div className="p-5">
                <h3 className="relative font-semibold transition-colors group-hover:text-violet-700">
                  {x.title}
                  {/* gạch chân chạy vào khi hover */}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-violet-500 transition-all duration-300 group-hover:w-2/3" />
                </h3>

                <div
                  className="grid grid-cols-2 gap-3 p-4 mt-4 text-sm transition-colors rounded-2xl bg-zinc-50 group-hover:bg-violet-50"
                >
                  {x.metrics.map((m) => (
                    <div
                      key={m.k}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    >
                      <div className="text-lg font-extrabold tracking-tight transition-transform duration-300 group-hover:scale-105 group-hover:text-violet-700">
                        {m.k}
                      </div>
                      <div className="text-zinc-600">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#contact" className="inline-flex btn btn-secondary btn-raise">
            Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================= GIẢI THƯỞNG / BADGES ================= */
function AwardsStrip() {
  // Dùng StaticImageData thay vì string[]
  const badges: ReadonlyArray<StaticImageData> = [ddgg, ddseo, ddyou, ddit];
  const labels = ["Google Partner", "SEO Award", "YouTube", "Instagram"];

  return (
    <section className="bg-[#F7FBFF] py-14">
      <div className="container-max">
        <H2>NỀN TẢNG QUẢNG CÁO HÀNG ĐẦU</H2>

        <div className="grid grid-cols-2 gap-6 mt-8 md:grid-cols-4">
          {badges.map((src, i) => (
            <div
              key={i}
              className="relative w-full h-40 overflow-hidden bg-white rounded-2xl ring-1 ring-zinc-200"
            >
              <Image
                src={src}
                alt={labels[i] ?? `badge-${i}`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS (scroll-snap nhẹ) ================= */
function Testimonials() {
  const list = [
    {
      q: "Team minh bạch & rất nhanh trong tối ưu – CPA giảm mạnh.",
      name: "Mr. Nguyễn Hùng",
      org: "MobiFone Hà Nội",
    },
    {
      q: "Báo cáo rõ ràng, scale mượt, kết quả ổn định.",
      name: "Ms. Phạm Hương",
      org: "Sun World",
    },
    {
      q: "Đội ngũ trẻ, nhiệt huyết, vững chuyên môn.",
      name: "Ms. Cao Dung",
      org: "Sakuko",
    },
  ] as const;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1531539274891-27f28c6c0d59?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center brightness-[0.35]" />
      <div className="container-max">
        <H2>KHÁCH HÀNG NÓI GÌ VỀ 3BOW?</H2>

        <div
          ref={ref}
          className="flex gap-6 pb-4 mt-8 overflow-x-auto snap-x snap-mandatory"
        >
          {list.map((t, i) => (
            <article
              key={i}
              className="snap-center shrink-0 basis-[88%] rounded-3xl border border-zinc-200/30 bg-white/95 p-6 shadow-md backdrop-blur md:basis-[32%]"
            >
              <div className="flex items-center gap-1 text-violet-600">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm">“{t.q}”</blockquote>
              <figcaption className="mt-4 text-sm font-medium">
                {t.name} •{" "}
                <span className="font-normal text-zinc-600">{t.org}</span>
              </figcaption>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= DỊCH VỤ (4 cột) ================= */
function Services() {
  const items: { icon: any; title: string; pts: string[] }[] = [
    {
      icon: Megaphone,
      title: "SEO",
      pts: ["Nghiên cứu & chiến lược", "Onpage/Offpage", "Content SEO"],
    },
    {
      icon: Target,
      title: "Google Ads",
      pts: ["Search/Shopping/PMax", "Remarketing/Video", "Tối ưu theo CPA"],
    },
    {
      icon: Rocket,
      title: "Digital Branding",
      pts: [
        "Minigame/Sự kiện online",
        "Quản trị kênh số",
        "Kỷ luật thương hiệu",
      ],
    },
    {
      icon: LineChart,
      title: "Đào tạo",
      pts: ["SEO", "Google Ads", "Content SEO"],
    },
  ];
  return (
    <section className="py-14">
      <div className="container-max">
        <H2>
          CÁC DỊCH VỤ CỦA <span className="text-violet-600">3BOW</span>
        </H2>
        <p className="mt-2 text-center text-zinc-600">
          Giải pháp tăng trưởng dựa trên kiến thức chuyên sâu và thực nghiệm.
        </p>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, pts }) => (
            <div
              key={title}
              className="p-6 bg-white border shadow-sm rounded-3xl border-zinc-200"
            >
              <Icon className="w-6 h-6" />
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                {pts.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= NEWS PREVIEW ================= */
function NewsPreview() {
  type Post = { title: string; img: string; stat?: string };

  const posts: Post[] = [
    {
      title: "200+ workshop, khóa học, sự kiện",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop",
      stat: "200+",
    },
    {
      title: "Google Updates 2023/2024",
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "Sự kiện cộng đồng & chia sẻ chuyên môn",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    },
    {
      title: "650+ bài chia sẻ chuyên môn",
      img: "https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1400&auto=format&fit=crop",
      stat: "650+",
    },
  ];

  return (
    <section className="bg-[#F7FBFF] py-14">
      <div className="container-max">
        <h2 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl">
          CỘNG ĐỒNG –{" "}
          <span className="text-violet-600">“Lan tỏa tri thức”</span>
        </h2>
        <p className="mt-2 text-center text-zinc-600">
          Kho kiến thức thực chiến về Google Marketing & Digital dành cho cộng
          đồng.
        </p>

        <div className="grid max-w-6xl grid-cols-1 gap-4 mx-auto mt-8 md:grid-cols-3">
          {posts.map((p, i) => (
            <article
              key={i}
              className={`group relative overflow-hidden rounded-3xl ring-1 ring-zinc-200 ${
                i === 3 ? "md:col-span-2" : ""
              }`}
            >
              <img
                src={p.img}
                alt={p.title}
                width={1200}
                height={800}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute text-white bottom-4 left-4 right-4 drop-shadow">
                {p.stat && (
                  <div className="text-3xl font-extrabold">{p.stat}</div>
                )}
                <h3 className="text-lg font-semibold">{p.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TEAM SECTION ================= */
function TeamSection() {
  return (
    <section className="bg-[#F7FBFF] py-16">
      <div className="grid items-center gap-8 container-max lg:grid-cols-2">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl ring-1 ring-zinc-200">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1800&auto=format&fit=crop"
            alt="Team activity"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-600">
            ĐỘI NGŨ <span className="text-pink-600">NHÂN SỰ</span>
          </p>
          <h3 className="mt-2 text-3xl font-extrabold">3BOW</h3>
          <p className="mt-3 text-zinc-600">
            Tận tâm & chuyên nghiệp — đề cao trách nhiệm và cá tính riêng của
            mỗi thành viên. trân trọng.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <StatCard
              icon={<Building2 className="w-5 h-5" />}
              value="1"
              label="Chi nhánh"
            />
            <StatCard
              icon={<Users className="w-5 h-5" />}
              value="40+"
              label="Nhân sự"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {/* Secondary – viền mềm + shine nhẹ */}
            <a
              href="/introduct"
              className="group relative inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-5 py-2.5 font-medium text-zinc-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <span>Hiểu thêm về 3BOW</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              {/* shine */}
              <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <span className="absolute -inset-y-2 -left-16 h-[200%] w-10 rotate-12 bg-white/40 opacity-0 transition-all duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" />
              </span>
            </a>

            {/* Primary – gradient + shine rõ hơn */}
            <a
              href="/careers"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-sky-600 px-5 py-2.5 font-medium text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <span>Tham gia đội ngũ</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              {/* shine */}
              <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <span className="absolute -inset-y-2 -left-16 h-[200%] w-10 rotate-12 bg-white/40 opacity-0 transition-all duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="p-6 bg-white border rounded-2xl border-zinc-200">
      <div className="grid w-10 h-10 mx-auto mb-2 rounded-full place-items-center bg-zinc-100">
        {icon}
      </div>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-zinc-600">{label}</div>
    </div>
  );
}

/* ================= CONTACT SPLIT ================= */
function ContactSplit() {
  return (
    <section id="contact" className="py-16">
      <div className="grid items-stretch gap-8 container-max lg:grid-cols-2">
        <ContactFormRHF />
        <div className="relative hidden overflow-hidden rounded-3xl bg-[#2c2e35] lg:block">
          <Image
            src={team}
            alt="Representative"
            fill
            className="object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-[#2c2e35]/40" />
          <div className="absolute text-3xl font-extrabold text-white bottom-6 left-6">
            3BOW
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= DẢI LOGO ĐỐI TÁC CAO CẤP ================= */
function PremiumPartners() {
  const logos: string[] = [
    "https://dummyimage.com/220x80/ffffff/111111&text=TikTok",
    "https://dummyimage.com/220x80/ffffff/111111&text=Facebook",
    "https://dummyimage.com/220x80/ffffff/111111&text=Google",
    "https://dummyimage.com/220x80/ffffff/111111&text=Admicro",
    "https://dummyimage.com/220x80/ffffff/111111&text=Zalo+Ads",
  ];
  return (
    <section className="bg-[#F7FBFF] py-12">
      <div className="container-max">
        <H2>
          ĐỐI TÁC CAO CẤP{" "}
          <span className="text-violet-600">CỦA CÁC NỀN TẢNG</span>
        </H2>
        <div className="grid grid-cols-2 gap-6 mt-8 place-items-center md:grid-cols-5">
          {logos.map((src, i) => (
            <div key={i} className="relative h-16 w-52">
              <Image
                src={src}
                alt={`pp-${i}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ================= CTA ================= */
function CTA() {
  return (
    <section className="py-16">
      <div className="container-max">
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 md:p-12 text-center shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl">
          {/* Aura gradient khi hover */}
          <div className="absolute transition-opacity duration-700 opacity-0 pointer-events-none -inset-24 blur-3xl group-hover:opacity-100">
            <div className="absolute w-56 h-56 rounded-full -top-8 -left-8 bg-gradient-to-tr from-violet-500/20 via-fuchsia-400/20 to-sky-400/20" />
            <div className="absolute w-56 h-56 rounded-full -bottom-8 -right-8 bg-gradient-to-br from-amber-400/20 via-pink-400/20 to-violet-500/20" />
          </div>

          <h3 className="text-2xl font-extrabold tracking-wide uppercase md:text-3xl text-zinc-900/90">
            Sẵn sàng tăng trưởng cùng 3BOW?
          </h3>
          <p className="mt-2 text-zinc-600">
            Nhận phân tích nhanh & lộ trình tối ưu miễn phí.
          </p>

          {/* Emojis nhảy nhẹ khi hover */}
          <div className="flex items-center justify-center gap-3 mt-3 text-xl text-zinc-700/80">
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ✨
            </span>
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              🚀
            </span>
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              🎯
            </span>
          </div>

          {/* Nút: gradient + hiệu ứng shine + icon trượt */}
          <a
            href="#contact"
            className="relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-sky-600 px-6 py-2.5 font-medium text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <span>Liên hệ ngay</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            {/* Shine */}
            <span className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-700 group-hover:before:translate-x-full" />
          </a>
        </div>
      </div>
    </section>
  );
}
