// src/app/introduct/page.tsx
"use client";

import Image from "next/image";
import { ReactNode, useMemo, useState } from "react";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Quote,
  Award,
  Star,
  BookOpenText,
  Users,
  HeartHandshake,
  Lightbulb,
  LineChart,
} from "lucide-react";

/* ---------- small helpers ---------- */
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl">
    {children}
  </h2>
);

/* ====== hero presets (xanh / cam / vàng) ====== */
const HERO_PRESETS = {
  blue: {
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop",
    tintFrom: "from-sky-500/60",
    tintVia: "via-cyan-400/40",
  },
  orange: {
    img: "https://images.unsplash.com/photo-1475727946784-2890c8fdb9ef?q=80&w=2400&auto=format&fit=crop",
    tintFrom: "from-orange-500/60",
    tintVia: "via-amber-400/40",
  },
  yellow: {
    img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2400&auto=format&fit=crop",
    tintFrom: "from-amber-500/60",
    tintVia: "via-yellow-400/40",
  },
} as const;

export default function Page() {
  return (
    <SiteShell>
      <HeroIntro />
      <OurStory />
      <Timeline />
      <CeoBio />
      <Values />
      <Gallery />
    </SiteShell>
  );
}

/* ================= HERO ================= */
function HeroIntro() {
  const [tone, setTone] = useState<keyof typeof HERO_PRESETS>("blue");
  const preset = useMemo(() => HERO_PRESETS[tone], [tone]);

  return (
    <section className="relative">
      <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={preset.img}
          alt="3BOW • Hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Lớp tối sát mép trên để header chữ trắng luôn rõ */}
        <div className="absolute inset-x-0 top-0 h-24 md:h-28 bg-black/40" />

        {/* Lớp tint theo tông màu + fade xuống dưới cho hero nổi bật nhưng không gắt */}
        <div
          className={[
            "absolute inset-0 bg-gradient-to-b",
            preset.tintFrom,
            preset.tintVia,
            "to-transparent",
          ].join(" ")}
        />

        {/* nội dung hero */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 text-center">
            <p className="text-[12px] md:text-sm text-white/90 drop-shadow">
              Một tập thể nhỏ, tin vào sức mạnh của kỷ luật – dữ liệu – sự tử tế
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-wide text-white md:text-5xl drop-shadow-md">
              3BOW <span className="text-white/90">|</span> CÂU CHUYỆN CỦA CHÚNG TÔI
            </h1>
            <p className="max-w-3xl mx-auto mt-3 text-white/90 drop-shadow">
              3BOW sinh ra không để chạy theo “ồn ào”, mà để làm kỹ, làm đúng, và
              bền bỉ mang lại những giá trị đo đếm được cho khách hàng.
            </p>

            {/* nút đổi tông nhanh */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {(["blue", "orange", "yellow"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTone(k)}
                  className={`h-7 rounded-full px-3 text-xs font-medium text-white/95 shadow ${
                    tone === k ? "bg-black/50" : "bg-black/30 hover:bg-black/40"
                  }`}
                >
                  {k === "blue" ? "Xanh" : k === "orange" ? "Cam" : "Vàng"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bo góc đáy hero */}
      <div className="pointer-events-none absolute left-1/2 top-full -mt-6 h-10 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
    </section>
  );
}

/* ================= OUR STORY ================= */
function OurStory() {
  return (
    <section className="relative z-[1] -mt-6 pb-8">
      <div className="mx-auto w-[92%] max-w-6xl rounded-[28px] border border-zinc-200 bg-white/95 px-6 py-8 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl ring-1 ring-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1800&auto=format&fit=crop"
              alt="Không khí làm việc tại 3BOW"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-600">VỀ 3BOW</p>
            <h3 className="mt-2 text-3xl font-extrabold">
              Hình thành từ những dự án nhỏ, lớn lên bằng sự tin cậy
            </h3>
            <p className="mt-3 text-zinc-700">
              3BOW bắt đầu từ một nhóm làm nghề yêu sự “gọn gàng”: quy trình rõ ràng, đo lường minh bạch và tinh thần chịu trách nhiệm tới cùng.
              Những năm đầu, chúng tôi nhận các dự án nhỏ, lắng nghe kỹ, làm kỹ và cải tiến mỗi ngày. Từng báo cáo, từng chỉ số đều được chăm chút—
              không phải để phô trương, mà để chính mình tin vào những gì đang làm.
            </p>
            <p className="mt-3 text-zinc-700">
              Chúng tôi không chạy theo khẩu hiệu. 3BOW chọn cách trưởng thành tự nhiên: học hỏi từ thất bại, gìn giữ điều đúng đắn, làm điều nên làm.
              Bởi sau cùng, điều khiến khách hàng ở lại không phải là lời hứa, mà là cảm giác an tâm khi “mọi thứ đang được nắm chắc”.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TIMELINE ================= */
function Timeline() {
  const data = [
    {
      year: "2014–2018",
      title: "Những bước đi đầu tiên",
      desc:
        "Nhỏ gọn – nhanh nhạy. 3BOW xây nền bằng việc làm chuẩn từ những thứ cơ bản: dữ liệu sạch, cấu trúc rõ ràng, báo cáo có trách nhiệm.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop",
    },
    {
      year: "2019–2021",
      title: "Tập trung chuyên sâu",
      desc:
        "Chuẩn hoá quy trình, dựng các bộ khung đo lường & vận hành, đẩy mạnh đào tạo nội bộ. Chúng tôi học cách nói ít – làm chắc.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
    },
    {
      year: "2022–Nay",
      title: "Kiến tạo giá trị bền vững",
      desc:
        "Mở rộng đội ngũ, giữ tinh thần gọn gàng. Không chạy theo ồn ào, tập trung vào kết quả có thể chạm tay: lead chất lượng, doanh thu thực.",
      img: "https://i.pinimg.com/1200x/3b/0d/89/3b0d890c9368ffaba6cfa678a91c2501.jpg",
    },
  ] as const;

  return (
    <section className="py-14">
      <div className="container-max">
        <H2>HÀNH TRÌNH HÌNH THÀNH</H2>
        <div className="grid max-w-5xl gap-5 mx-auto mt-8">
          {data.map((t) => (
            <div
              key={t.year}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
            >
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="relative w-full overflow-hidden h-28 rounded-xl ring-1 ring-zinc-200">
                  <Image
                    src={t.img}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="160px"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-sky-700">{t.year}</div>
                  <div className="mt-1 text-lg font-semibold">{t.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{t.desc}</p>
                </div>
              </div>
              <span className="absolute w-20 h-20 transition rounded-full opacity-0 pointer-events-none -right-6 -top-6 bg-sky-100/50 group-hover:opacity-100" />
              <span className="absolute w-16 h-16 transition rounded-full opacity-0 pointer-events-none -bottom-6 -left-6 bg-amber-100/50 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CEO BIO ================= */
function CeoBio() {
  const awards = [
    { label: "Facebook Blueprint", sub: "Certified", color: "text-[#1877F2]" },
    { label: "TikTok Agency", sub: "Awards", color: "text-[#111]" },
    { label: "Google Skillshop", sub: "Cert.", color: "text-[#1a73e8]" },
  ] as const;

  return (
    <section className="bg-[#F7FBFF] py-14">
      <div className="container-max">
        <H2>NGƯỜI SÁNG LẬP</H2>

        <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=900&auto=format&fit=crop"
              alt="CEO Lê Văn Ất"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-600">CEO</p>
            <h3 className="mt-1 text-3xl font-extrabold">Lê Văn Ất</h3>
            <p className="mt-2 text-zinc-700">
              Hơn <b>10 năm</b> làm nghề marketing số, Ất chọn cách đi bền:
              cập nhật công cụ mới, nhưng không bỏ qua thứ căn bản – hiểu khách hàng,
              tôn trọng dữ liệu, và chịu trách nhiệm tới cùng cho từng con số.
            </p>

            <div className="grid gap-2 mt-4 text-sm text-zinc-700">
              <p className="flex items-start gap-2">
                <Quote className="w-4 h-4 mt-1 text-sky-600" />
                “Sự sáng tạo giúp ta đi nhanh, kỷ luật giúp ta đi xa. Hiệu quả thật
                sự nằm ở điểm giao nhau.”
              </p>
              <p className="flex items-start gap-2">
                <Star className="w-4 h-4 mt-1 text-amber-500" />
                Được trao nhiều chứng chỉ/giải thưởng chuyên môn từ Facebook,
                TikTok và Google cho các chiến dịch vận hành xuất sắc.
              </p>
              <p className="flex items-start gap-2">
                <BookOpenText className="w-4 h-4 mt-1 text-emerald-600" />
                Tích cực chia sẻ kiến thức cho cộng đồng; hướng dẫn thực chiến,
                tránh “lý thuyết nửa vời”.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {awards.map((a) => (
                <span
                  key={a.label}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-white border rounded-full shadow-sm border-zinc-300"
                >
                  <Award className={`h-3.5 w-3.5 ${a.color}`} />
                  <span className="font-medium">{a.label}</span>
                  <span className="text-zinc-500">• {a.sub}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= VALUES / CULTURE ================= */
function Values() {
  const list = [
    {
      icon: <LineChart className="w-5 h-5" />,
      title: "Tôn trọng dữ liệu",
      desc:
        "Mọi quyết định đều có số liệu hậu thuẫn. Số liệu minh bạch giúp tập thể tin nhau hơn.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: "Trung thực & trách nhiệm",
      desc:
        "Sai thì sửa, đúng thì làm tới cùng. Giao tiếp thẳng thắn để tiến bộ nhanh.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Tập thể nhỏ – năng lượng lớn",
      desc:
        "Gọn gàng trong tổ chức, tối đa trong sự chủ động. Mỗi người đều quan trọng.",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Học hỏi suốt đời",
      desc:
        "Luôn dành thời gian cho việc đọc – test – ghi chép; tôn trọng năng lực chuyên môn.",
    },
  ] as const;

  return (
    <section className="py-14">
      <div className="container-max">
        <H2>GIÁ TRỊ CHÚNG TÔI THEO ĐUỔI</H2>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {list.map((v) => (
            <div
              key={v.title}
              className="p-6 transition-all bg-white border shadow-sm group rounded-3xl border-zinc-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
            >
              <div className="grid w-10 h-10 rounded-full place-items-center bg-sky-50 text-sky-700">
                {v.icon}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{v.desc}</p>
              <div className="mt-4 h-0.5 w-0 bg-amber-500 transition-all duration-300 group-hover:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= GALLERY ================= */
function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop",
  ];

  return (
    <section className="bg-[#F7FBFF] py-14">
      <div className="container-max">
        <H2>KHOẢNH KHẮC Ở 3BOW</H2>
        <div className="grid max-w-6xl grid-cols-2 gap-4 mx-auto mt-8 md:grid-cols-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-zinc-200"
            >
              <Image
                src={src}
                alt={`Ảnh hoạt động ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-center text-zinc-500">
          *Hình ảnh minh hoạ. 3BOW trân trọng những khoảnh khắc tập thể nhỏ nhưng đầy năng lượng.
        </p>
      </div>
    </section>
  );
}
