// src/app/list_page/thiet_ke_thuong_hieu/page.tsx
"use client";

import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  BadgeCheck,
  Palette,
  Stamp,
  Type,
  FolderKanban,
  ImageIcon,
  Sparkles,
  Ruler,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";

// TÁI DÙNG ảnh có sẵn để tránh lỗi domain Next/Image
import imc1 from "@/app/image/tkth/tkth01.jpg";
import imc2 from "@/app/image/tkth//tkth02.jpg";
import imc3 from "@/app/image/tkth/tkth03.jpg";
import imc4 from "@/app/image/tkth/tkth04.jpg";
import imc5 from "@/app/image/tkth/tkth07.jpg";
import imc6 from "@/app/image/tkth/tkth08.jpg";

/* ------- helpers ------- */
const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-28">{children}</section>
);

const H2 = ({ children, k }: { children: React.ReactNode; k?: string }) => (
  <div className="mb-6">
    {k && <div className="mb-2 text-xs font-semibold tracking-widest text-amber-600">{k}</div>}
    <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
      {children}
      <>
        <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
        <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
      </>
    </h2>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2.5 py-1 rounded-full text-xs bg-white/20 text-white/90 border border-white/30">
    {children}
  </span>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="pl-2 relative before:content-['•'] before:absolute before:-left-3 before:text-amber-500">
    {children}
  </li>
);

const Feature = ({
  icon: Icon,
  title,
  desc,
}: { icon: any; title: string; desc: string }) => (
  <div className="h-full p-5 overflow-hidden transition bg-white border group rounded-xl hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="p-2 border rounded-lg bg-amber-50 shrink-0">
        <Icon className="size-5 text-amber-600" />
      </div>
      <h3 className="font-semibold leading-tight">{title}</h3>
    </div>
    <p className="pr-1 mt-2 text-sm leading-6 break-words whitespace-normal text-zinc-600 hyphens-auto">
      {desc}
    </p>
    <div className="inline-flex items-center mt-3 text-xs text-zinc-500 group-hover:text-zinc-700">
      Tìm hiểu thêm <ChevronRight className="ml-1 size-4" />
    </div>
  </div>
);

export default function Page() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>Branding end-to-end</Chip>
              <Chip>Quy chuẩn nhận diện</Chip>
              <Chip>File bàn giao đầy đủ</Chip>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,.2)]">
              THIẾT KẾ THƯƠNG HIỆU (BRANDING)
            </h1>
            <p className="max-w-full mt-2 overflow-hidden text-sm md:text-base text-white/90 md:max-w-none md:whitespace-nowrap text-ellipsis">
              Xây nền tảng nhận diện chuyên nghiệp: logo, màu sắc, typography, guideline & ứng dụng thực tiễn.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-12 lg:col-span-8">
          {/* 1. Brand là gì */}
          <Section id="brand-la-gi">
            <H2 k="PHẦN 1">Brand là gì & vì sao phải làm bài bản?</H2>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="leading-7 text-zinc-700">
                  <strong>Brand</strong> không chỉ là logo. Đó là hệ thống cảm nhận & trải nghiệm nhất quán trong
                  tâm trí khách hàng: câu chuyện, tính cách, màu sắc, kiểu chữ, bố cục, key visual… Khi được thiết kế
                  đúng chuẩn, thương hiệu giúp tăng độ tin cậy, nhận biết và hiệu quả bán hàng.
                </p>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  <Bullet>Khác biệt & dễ nhớ giữa thị trường nhiều đối thủ.</Bullet>
                  <Bullet>Chuẩn hoá để đội ngũ dùng đúng – tiết kiệm thời gian.</Bullet>
                  <Bullet>Hỗ trợ performance: CTR/CR tốt hơn nhờ visual rõ ràng.</Bullet>
                </ul>
              </div>
              <div className="md:col-span-2">
                <div className="overflow-hidden border rounded-xl">
                  <Image
                    src={imc2}
                    alt="Brand overview"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover hover:scale-[1.02] transition"
                    priority
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 2. Hạng mục bàn giao */}
          <Section id="deliverables">
            <H2 k="PHẦN 2">Hạng mục bàn giao (Deliverables)</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <Feature icon={Stamp} title="Logo & Variations"
                desc="Logo chính/phụ, version ngang/dọc, dương bản/âm bản, khoảng cách an toàn & min-size." />
              <Feature icon={Palette} title="Color System"
                desc="Primary/Secondary, tỉ lệ sử dụng, mã HEX/RGB/CMYK để in ấn & digital." />
              <Feature icon={Type} title="Typography"
                desc="Font heading/body/caption; cỡ chữ – line-height – tracking gợi ý." />
              <Feature icon={Layers} title="Key Visual & Patterns"
                desc="Hoạ tiết, icon set, grid & guideline bố cục tiêu chuẩn." />
              <Feature icon={ImageIcon} title="Ứng dụng"
                desc="Card visit, letterhead, bao bì, social post, banner, standee, slide…" />
              <Feature icon={FolderKanban} title="Brand Guideline"
                desc="File PDF/Canva/Figma + package nguồn (AI/PSD/SVG) để đội ngũ sử dụng lâu dài." />
            </div>
          </Section>

          {/* 3. Quy trình */}
          <Section id="process">
            <H2 k="PHẦN 3">Quy trình triển khai</H2>
            <ol className="grid gap-4 md:grid-cols-2">
              {[
                "Discovery: audit thị trường, chân dung khách hàng, định vị & giá trị cốt lõi.",
                "Moodboard: chọn hướng sáng tạo, màu – font – cảm xúc chủ đạo.",
                "Thiết kế: logo & hệ nhận diện; review theo vòng, A/B concept.",
                "Guideline: chuẩn hoá quy tắc sử dụng; xuất bộ file nguồn.",
                "Ứng dụng: demo thực tế (social, bao bì, POSM, website…).",
                "Bàn giao & hỗ trợ: training sử dụng, chỉnh sửa hậu kỳ nếu cần.",
              ].map((t, i) => (
                <li key={i} className="relative py-4 pl-10 bg-white border rounded-xl">
                  <span className="absolute inline-flex items-center justify-center text-xs font-bold text-white rounded-full left-3 top-4 size-6 bg-amber-500">
                    {i + 1}
                  </span>
                  <p className="text-zinc-700">{t}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* 4. Lợi ích */}
          <Section id="loi-ich">
            <H2 k="PHẦN 4">Lợi ích khi làm với 3BOW</H2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feature icon={BadgeCheck} title="Chuẩn – đồng bộ"
                desc="Tài liệu guideline rõ ràng, dễ áp dụng; giảm lệch chuẩn trong sản xuất nội dung." />
              <Feature icon={Ruler} title="Tối ưu chi phí"
                desc="Thiết kế theo modules – tái sử dụng linh hoạt cho social/ads/OOH." />
              <Feature icon={Sparkles} title="Đẹp & hiệu quả"
                desc="Không chỉ thẩm mỹ, mà còn phục vụ KPI: nhận biết, CTR, chuyển đổi." />
              <Feature icon={CheckCircle2} title="Bàn giao đầy đủ"
                desc="File nguồn + PDF hướng dẫn; hỗ trợ nhập kho Canva/Figma." />
            </div>
          </Section>

          {/* 5. Portfolio (minh hoạ) */}
          <Section id="portfolio">
            <H2 k="PHẦN 5">Một số ứng dụng minh hoạ</H2>
            <div className="grid gap-6 md:grid-cols-3">
              {[{img: imc1, cap: "Logo & Key Visual"},
                {img: imc2, cap: "Bao bì sáng tạo"},
                {img: imc3, cap: "Social & Banner"}].map(({img, cap}, i) => (
                <figure key={i} className="relative overflow-hidden bg-white border rounded-xl group">
                  <div className="aspect-[16/10]">
                    <Image
                      src={img}
                      alt={cap}
                      placeholder="blur"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(min-width:768px) 33vw, 100vw"
                    />
                  </div>
                  <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white bg-amber-500/90">
                    {cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>

          {/* 6. FAQ ngắn */}
          <Section id="faq">
            <H2 k="PHẦN 6">FAQ nhanh</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border rounded-xl">
                <p className="text-sm font-semibold">Thời gian bao lâu?</p>
                <p className="mt-1 text-sm text-zinc-600">Tuỳ phạm vi: 2–6 tuần (đã gồm vòng review).</p>
              </div>
              <div className="p-4 bg-white border rounded-xl">
                <p className="text-sm font-semibold">Nhận được những file gì?</p>
                <p className="mt-1 text-sm text-zinc-600">PDF guideline + AI/PSD/SVG/PNG; kit Canva/Figma (nếu cần).</p>
              </div>
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Liên hệ */}
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">🎨</div>
                <h3 className="m-0 text-lg font-bold">Thiết kế thương hiệu cùng 3BOW</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-zinc-700">
                <p>Hotline: <strong>0859.036.789</strong></p>
                <p>Email: <a className="underline" href="mailto:hello@3bow.vn">hello@3bow.vn</a></p>
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-white transition bg-black rounded-lg hover:opacity-90"
                >
                  Nhận tư vấn miễn phí
                </a>
              </div>
            </div>

            {/* TOC */}
            <nav className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Mục lục</p>
              <ul className="space-y-2 text-sm">
                {[
                  ["#brand-la-gi", "Brand là gì?"],
                  ["#deliverables", "Hạng mục bàn giao"],
                  ["#process", "Quy trình"],
                  ["#loi-ich", "Lợi ích"],
                  ["#portfolio", "Portfolio"],
                  ["#faq", "FAQ"],
                ].map(([href, label]) => (
                  <li key={href}><a className="hover:underline text-zinc-700" href={href}>{label}</a></li>
                ))}
              </ul>
            </nav>

            {/* Dịch vụ khác */}
            <div className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Dịch vụ khác</p>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:underline" href="/list_page/imc">IMC</a></li>
                <li><a className="hover:underline" href="/list_page/thiet_ke_thuong_hieu">Thiết kế thương hiệu</a></li>
                <li><a className="hover:underline" href="/dichvu">Digital Performance</a></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA CUỐI TRANG */}
      <section className="bg-white border-t">
        <div className="max-w-6xl px-4 py-12 mx-auto">
          <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
            DỰ ÁN BRANDING TIÊU BIỂU
            <>
              <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
              <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
            </>
          </h2>
          <p className="max-w-3xl mt-2 text-zinc-600">
            Tối ưu hoá hệ nhận diện để tăng độ nhận biết & hiệu quả truyền thông đa kênh.
          </p>

          <div className="grid gap-6 mt-6 md:grid-cols-3">
            {[{img: imc4, cap:"Bộ nhận diện — Dễ nhận biết"},
              {img: imc5, cap:"Ứng dụng bao bì – POSM"},
              {img: imc6, cap:"Social guideline — Chuẩn đăng tải"}].map(({img, cap}, i) => (
              <figure key={i} className="relative overflow-hidden bg-white border rounded-xl group">
                <div className="aspect-[16/10]">
                  <Image
                    src={img}
                    alt={cap}
                    placeholder="blur"
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(min-width:768px) 33vw, 100vw"
                  />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white bg-amber-500/90">
                  {cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
