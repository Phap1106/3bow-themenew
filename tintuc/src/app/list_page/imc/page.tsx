// src/app/list_page/imc/page.tsx
"use client";

import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Megaphone,
  Newspaper,
  Gift,
  Mail,
  Users,
  BarChart3,
  CheckCircle2,
  LineChart,
  Lightbulb,
  CalendarClock,
  ChevronRight,
} from "lucide-react";

import lapkehoachimc from "@/app/image/imc/lap-ke-hoach-tong-quan.jpg";
import imcnguoi from "@/app/image/imc/imc_nguoi.jpg";
import imc1 from "@/app/image/imc/imc1.png";
import imc2 from "@/app/image/imc/imc2.png";
import imc3 from "@/app/image/imc/imc3.jpg";

/* ------- small helpers ------- */
const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-28">{children}</section>
);

// Thay H2 cũ bằng H2 mới
const H2 = ({ children, k }: { children: React.ReactNode; k?: string }) => (
  <div className="mb-6">
    {k && (
      <div className="mb-2 text-xs font-semibold tracking-widest text-amber-600">
        {k}
      </div>
    )}
    <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
      {children}
      {/* line gạch dưới */}
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
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="h-full p-5 overflow-hidden transition bg-white border group rounded-xl hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="p-2 border rounded-lg bg-amber-50 shrink-0">
        <Icon className="size-5 text-amber-600" />
      </div>
      <h3 className="font-semibold leading-tight">{title}</h3>
    </div>

    {/* Quan trọng: ép xuống dòng cho chuỗi có /, tránh tràn cột */}
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
      {/* HERO — đẩy xuống tránh đè header */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>Senior 7+ năm</Chip>
              <Chip>Cam kết theo ROAS/CPA</Chip>
              <Chip>Đối tác Meta/Google</Chip>
            </div>

            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,.2)]">
              TRUYỀN THÔNG MARKETIG TÍCH HỢP (IMC)
            </h1>
      <p
  className="max-w-full mt-2 overflow-hidden text-sm md:text-base text-white/90 md:max-w-none md:whitespace-nowrap text-ellipsis"
>
  TẠO THÔNG ĐIỆP NHẤT QUÁN, PHỐI HỢP ĐA KÊNH ĐỂ TỐI ĐA HÓA HIỆU QUẢ TRUYỀN THÔNG.
</p>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-12 lg:col-span-8">
          {/* Section: IMC là gì */}
          <Section id="gioi-thieu">
            <H2 k="PHẦN 1">IMC là gì?</H2>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="leading-7 text-zinc-700">
                  <strong>Integrated Marketing Communications (IMC)</strong> là việc phối hợp chặt chẽ
                  các hoạt động truyền thông (quảng cáo, PR, social, KOLs, sự kiện, CRM…) để tạo nên
                  một thông điệp nhất quán, đúng chân dung khách hàng mục tiêu và tối ưu chi phí.
                </p>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  <Bullet>Đồng bộ thông điệp – hình ảnh – CTA xuyên suốt phễu.</Bullet>
                  <Bullet>Phân bổ ngân sách theo tác động từng giai đoạn.</Bullet>
                  <Bullet>Thiết lập KPI &amp; tracking rõ ràng, dễ tối ưu.</Bullet>
                </ul>
              </div>
              <div className="md:col-span-2">
                <div className="overflow-hidden border rounded-xl">
                  <Image
                    src={imcnguoi}
                    alt="IMC overview"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover hover:scale-[1.02] transition"
                    priority
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Section: Pain points */}
          <Section id="van-de">
            <H2 k="PHẦN 2">Vấn đề thường gặp & cách IMC giải quyết</H2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Feature
                icon={Lightbulb}
                title="Thông điệp rời rạc"
                desc="Chuẩn hoá key message, key visual, CTA; thống nhất tone & voice."
              />
              <Feature
                icon={LineChart}
                title="Chi phí dàn trải"
                desc="Tập trung trọng điểm theo phễu AARRR; cắt lãng phí kênh kém hiệu quả."
              />
              <Feature
                icon={BarChart3}
                title="Khó đo lường"
                desc="Thiết lập KPI theo kênh, gắn UTM, cấu hình conversion & attribution."
              />
              <Feature
                icon={CheckCircle2}
                title="Tối ưu chậm"
                desc="Chu kỳ review tuần, A/B testing, dashboard realtime để xử lý nhanh."
              />
            </div>
          </Section>

          {/* Section: Công cụ */}
          <Section id="cong-cu">
            <H2 k="PHẦN 3">Các công cụ chính trong IMC</H2>
            <div className="grid gap-4 md:grid-cols-3">
              <Feature icon={Megaphone} title="Advertising" desc="Facebook/Google/TikTok/OOH/CTV…" />
              <Feature icon={Newspaper} title="PR báo chí" desc="Lan toả thông điệp & social proof." />
              <Feature icon={Gift} title="Promotion" desc="Khuyến mại, coupon, bundle thúc đẩy chuyển đổi." />
              <Feature icon={Mail} title="CRM/Direct" desc="Email, SMS, Zalo OA, loyalty & re-engagement." />
              <Feature icon={Users} title="KOLs/KOCs" desc="Đánh trúng cộng đồng mục tiêu, tạo UGC." />
              <Feature icon={CalendarClock} title="Sự kiện" desc="Event/activation tăng trải nghiệm & data." />
            </div>
          </Section>

          {/* Section: Quy trình */}
          <Section id="quy-trinh">
            <H2 k="PHẦN 4">Quy trình triển khai đề xuất</H2>
            <ol className="grid gap-4 md:grid-cols-2 counter-reset">
              {[
                "Nghiên cứu: thị trường, đối thủ, persona, JTBD.",
                "Chiến lược: mục tiêu, thông điệp, big idea, KV, kênh ưu tiên.",
                "Kế hoạch: lịch nội dung, media plan, ngân sách, KPI, tracking.",
                "Triển khai: sản xuất nội dung, media, PR/KOLs, event/activation.",
                "Đo lường & tối ưu: dashboard, A/B testing, attribution, báo cáo.",
                "Mở rộng: nhân đôi vùng hiệu quả, tối ưu chi phí CPA/ROAS.",
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

          {/* Section: Case minh hoạ */}
          <Section id="case">
            <H2 k="PHẦN 5">Case minh hoạ (giả lập)</H2>
            <div className="overflow-hidden border rounded-xl">
              <Image
                src={lapkehoachimc}
                alt="Minh hoạ chiến dịch IMC"
                width={1200}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid gap-4 mt-4 md:grid-cols-3">
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-sm text-zinc-600">
                  <strong>Mục tiêu:</strong> +30% đơn online/3 tháng (F&amp;B).
                </p>
              </div>
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-sm text-zinc-600">
                  <strong>Phễu:</strong> Video+PR → KOL review → Ads chuyển đổi.
                </p>
              </div>
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-sm text-zinc-600">
                  <strong>Giữ chân:</strong> CRM, remarketing, voucher tái mua.
                </p>
              </div>
            </div>
          </Section>

          {/* Section: Checklist */}
          <Section id="checklist">
            <H2 k="PHẦN 6">Checklist nhanh</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="p-4 space-y-2 text-sm bg-white border rounded-xl text-zinc-700">
                <Bullet>Persona, JTBD, key insight</Bullet>
                <Bullet>Key message, KV, tone &amp; voice</Bullet>
                <Bullet>Channel mix &amp; media split (%)</Bullet>
                <Bullet>Content pillar &amp; content calendar</Bullet>
              </ul>
              <ul className="p-4 space-y-2 text-sm bg-white border rounded-xl text-zinc-700">
                <Bullet>Tracking (UTM, pixels, events)</Bullet>
                <Bullet>KPI theo stage: A/C/CV/R</Bullet>
                <Bullet>Weekly review → A/B test</Bullet>
                <Bullet>Looker dashboard realtime</Bullet>
              </ul>
            </div>
          </Section>

          {/* Section: Tài liệu đọc thêm */}
          <Section id="tai-lieu">
            <H2 k="PHẦN 7">Tài liệu đọc thêm</H2>
            <div className="grid gap-4 md:grid-cols-3">
              <a className="p-4 transition bg-white border rounded-xl hover:shadow-md" href="https://www.thinkwithgoogle.com/" target="_blank" rel="noreferrer">
                <div className="font-semibold">Think with Google</div>
                <div className="mt-1 text-xs text-zinc-600">Consumer & industry insights</div>
              </a>
              <a className="p-4 transition bg-white border rounded-xl hover:shadow-md" href="https://www.facebook.com/business/insights/tools" target="_blank" rel="noreferrer">
                <div className="font-semibold">Meta Business</div>
                <div className="mt-1 text-xs text-zinc-600">Tools & measurement</div>
              </a>
              <a className="p-4 transition bg-white border rounded-xl hover:shadow-md" href="https://sparktoro.com/blog/" target="_blank" rel="noreferrer">
                <div className="font-semibold">SparkToro Blog</div>
                <div className="mt-1 text-xs text-zinc-600">Audience research</div>
              </a>
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          {/* Sticky card liên hệ */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                  📞
                </div>
                <h3 className="m-0 text-lg font-bold">Hãy liên hệ với 3BOW</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-zinc-700">
                <p>Hotline: <strong>0933 415 331</strong></p>
                <p>Email: <a className="underline" href="mailto:3bowdigital@gmail.com">3bowdigital@gmail.com</a></p>
                <p>Địa chỉ: Số 12, đường Xóm Miễu, Thôn Duyên Trường, Xã Duyên Thái, Huyện Thường Tín, Thành phố Hà Nội, Việt Nam</p>
                <a
                  href="/lien-he"
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-white transition bg-black rounded-lg hover:opacity-90"
                >
                  Khách hàng của chúng tôi
                </a>
              </div>
            </div>

            {/* TOC */}
            <nav className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Mục lục</p>
              <ul className="space-y-2 text-sm">
                {[
                  ["#gioi-thieu", "IMC là gì?"],
                  ["#van-de", "Vấn đề & giải pháp"],
                  ["#cong-cu", "Công cụ chính"],
                  ["#quy-trinh", "Quy trình"],
                  ["#case", "Case minh hoạ"],
                  ["#checklist", "Checklist"],
                  ["#tai-lieu", "Tài liệu"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a className="hover:underline text-zinc-700" href={href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Dịch vụ khác */}
            <div className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Dịch vụ khác</p>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:underline" href="/dichvu/imc">IMC</a></li>
                <li><a className="hover:underline" href="list_page/thiet_ke_thuong_hieu">Thiết kế thương hiệu</a></li>
                <li><a className="hover:underline" href="/dichvu">Digital Performance</a></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA LIÊN HỆ */}
<section className="bg-white border-t">
  <div className="max-w-6xl px-4 py-12 mx-auto">
    <h2 className="text-3xl font-extrabold tracking-tight">
      DỰ ÁN KHÁC CỦA 3BOW DIGITAL
    </h2>
    <p className="max-w-3xl mt-2 text-zinc-600">
      Hãy để 3BOW giúp bạn xây dựng chiến lược IMC toàn diện, tối ưu nguồn lực &amp; hiệu quả.
    </p>

    <div className="grid gap-6 mt-6 md:grid-cols-3">
      {/* Ảnh 1 */}
      <figure className="relative overflow-hidden bg-white border rounded-xl group">
        <div className="aspect-[16/10]">
          <Image
            src={imc1}
            alt="Lập kế hoạch tổng quan"
            placeholder="blur"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width:768px) 33vw, 100vw"
            priority
          />
        </div>
        <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white bg-amber-500/90">
          Lập kế hoạch tổng quan
        </figcaption>
      </figure>

      {/* Ảnh 2 */}
      <figure className="relative overflow-hidden bg-white border rounded-xl group">
        <div className="aspect-[16/10]">
          <Image
            src={imc2}
            alt="Booking KOLs"
            placeholder="blur"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width:768px) 33vw, 100vw"
          />
        </div>
        <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white bg-amber-500/90">
          Booking KOLs
        </figcaption>
      </figure>

      {/* Ảnh 3 */}
      <figure className="relative overflow-hidden bg-white border rounded-xl group">
        <div className="aspect-[16/10]">
          <Image
            src={imc3}
            alt="PR báo chí & Ads"
            placeholder="blur"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width:768px) 33vw, 100vw"
          />
        </div>
        <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-sm font-medium text-white bg-amber-500/90">
          PR báo chí &amp; Ads
        </figcaption>
      </figure>
    </div>
  </div>
</section>

    </SiteShell>
  );
}
