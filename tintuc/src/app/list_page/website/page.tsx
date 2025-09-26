// src/app/list_page/website/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  MonitorSmartphone, Gauge, Sparkles, ShieldCheck, BarChart3,
  Database, Wrench, CheckCircle2, ChevronRight
} from "lucide-react";

// Demo images — thay ảnh thật của 3BOW sau
import shot1 from "@/app/image/web/web0.jpg";
import shot2 from "@/app/image/web/web1.jpg";
import shot3 from "@/app/image/web/web2.jpg";
import shot4 from "@/app/image/web/web3.jpg";
import shot5 from "@/app/image/web/web4.jpg";
import shot6 from "@/app/image/web/web5.jpg";
import shot7 from "@/app/image/web/web6.jpg";
import shot8 from "@/app/image/web/web13.jpg";
import shot9 from "@/app/image/web/web14.jpg";
import shot10 from "@/app/image/web/web12.jpg";
/* ---------- helpers ---------- */
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

const Feature = ({ icon: Icon, title, desc, img }:{
  icon: any; title: string; desc: string; img?: any;
}) => (
  <div className="grid grid-cols-1 gap-3 p-5 transition bg-white border rounded-xl hover:shadow-md md:grid-cols-5">
    <div className="flex items-center gap-3 md:col-span-3">
      <div className="p-2 border rounded-lg bg-amber-50 shrink-0">
        <Icon className="size-5 text-amber-600" />
      </div>
      <div>
        <h3 className="font-semibold leading-tight">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{desc}</p>
        <div className="inline-flex items-center mt-2 text-xs text-zinc-500">
          Tìm hiểu thêm <ChevronRight className="ml-1 size-4" />
        </div>
      </div>
    </div>
    {img && (
      <div className="relative overflow-hidden border rounded-lg md:col-span-2 aspect-[16/10]">
        <Image src={img} alt={title} fill className="object-cover" />
      </div>
    )}
  </div>
);

/* ---------------- M O S A I C  G A L L E R Y ---------------- */
const mosaic: {img:any; title:string; sub:string; span?: "col-span-2"|"row-span-2"}[] = [
  { img: shot1, title: "Landing Sản Phẩm", sub: "Tối ưu chuyển đổi", span: "row-span-2" },
  { img: shot2, title: "Trang Blog/Magazine", sub: "Đẹp – dễ đọc" },
  { img: shot3, title: "Portfolio/Case", sub: "Showcase nổi bật" },
  { img: shot4, title: "Trang Sự Kiện", sub: "Đăng ký nhanh" },
  { img: shot10, title: "Trang Giới Thiệu", sub: "", span: "col-span-2" },
];

function MosaicGallery() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px]">
      {mosaic.map((m, i) => (
        <figure
          key={i}
          className={`relative overflow-hidden bg-white border rounded-2xl group ${m.span ?? ""}`}
        >
          <Image
            src={m.img}
            alt={m.title}
            fill
            sizes="(min-width:1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={i === 0}
          />
          <figcaption className="absolute bottom-0 left-0 right-0">
            <div className="px-4 py-3 text-white bg-amber-500/95">
              <div className="text-sm font-semibold">{m.title}</div>
              <div className="text-[11px] opacity-90">{m.sub}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------------- P A G E ---------------- */
export default function Page() {
  const plans = [
    {
      name: "Starter",
      price: "12–18 triệu",
      desc: "Website giới thiệu doanh nghiệp/landing cơ bản (5–7 trang).",
      items: [
        "Thiết kế UI theo brand (1 concept)",
        "Responsive, tối ưu tốc độ cơ bản",
        "Blog/News cơ bản, form liên hệ",
        "Hỗ trợ deploy + hướng dẫn sử dụng",
      ],
    },
    {
      name: "Business",
      price: "25–45 triệu",
      desc: "Doanh nghiệp/SME đa trang + CMS quản trị.",
      items: [
        "UI nâng cao (2 vòng revise)",
        "Next.js + CMS (admin bài viết/trang)",
        "SEO on-page, schema, sitemap",
        "Core Web Vitals, bảo mật cơ bản",
      ],
    },
    {
      name: "E-commerce",
      price: "60–120 triệu",
      desc: "Bán hàng/đặt lịch, cổng thanh toán, quản lý đơn.",
      items: [
        "Sản phẩm/biến thể/giỏ hàng/checkout",
        "Tích hợp vận chuyển/thanh toán",
        "Trang khuyến mãi, voucher",
        "Báo cáo doanh thu & log đơn",
      ],
    },
  ];

  return (
    <SiteShell>
      {/* HERO */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>Next.js / NestJS</Chip>
              <Chip>SEO-ready</Chip>
              <Chip>Core Web Vitals</Chip>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,.2)]">
              THIẾT KẾ & PHÁT TRIỂN WEBSITE
            </h1>
            <p className="max-w-[62ch] mt-2 text-white/90">
              Website nhanh – sắc nét – đo lường được: chuẩn SEO, tốc độ cao, bảo mật tốt, dễ quản trị nội dung.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-12 lg:col-span-8">
          {/* 1. Giá trị */}
          <Section id="value">
            <H2 k="PHẦN 1">Vì sao chọn 3BOW?</H2>
            <div className="space-y-4">
              <Feature icon={Gauge} title="Nhanh & mượt"
                desc="SSR/ISR, tối ưu ảnh, preload, code-split để đạt điểm Lighthouse cao." img={shot5} />
              <Feature icon={Sparkles} title="Đẹp & đúng brand"
                desc="Thiết kế theo guideline nhận diện, layout sạch, ưu tiên khả năng đọc & chuyển đổi." img={shot6} />
              <Feature icon={BarChart3} title="Đo lường & SEO"
                desc="GA4/Pixel/Hotjar, schema, meta, sitemap, URL chuẩn – sẵn sàng SEO & ads." img={shot7} />
              <Feature icon={ShieldCheck} title="Bảo mật & ổn định"
                desc="Headers bảo mật, rate limit API, xác thực JWT/cookie, chống spam form." />
            </div>
          </Section>

          {/* 2. Ví dụ giao diện (MOSAIC) */}
          <Section id="gallery">
            <H2 k="PHẦN 2">Ví dụ giao diện (Showcase)</H2>
            <MosaicGallery />
          </Section>

 {/* 3. Pricing — nút căn đều hàng, màu nhạt */}
<Section id="pricing">
  <H2 k="PHẦN 3">Gói dịch vụ & chi phí</H2>
  <div className="grid gap-6 md:grid-cols-3">
    {plans.map((p) => (
      <div key={p.name} className="p-5 bg-white border rounded-2xl min-h-[420px]">
        <div className="flex flex-col h-full">
          <div>
            <div className="text-sm font-semibold text-amber-600">{p.name}</div>
            <div className="mt-1 text-2xl font-extrabold">{p.price}</div>
            <p className="mt-1 text-sm text-zinc-600">{p.desc}</p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {p.items.map((it) => <Bullet key={it}>{it}</Bullet>)}
            </ul>
          </div>

          {/* nút nhạt + không wrap + canh đáy */}
          <a
            href="/lien-he"
            className="inline-flex items-center justify-center w-full px-4 py-2 mt-auto transition border rounded-lg whitespace-nowrap bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
          >
            Nhận báo giá chi tiết
          </a>
        </div>
      </div>
    ))}
  </div>
  <p className="mt-2 text-xs text-zinc-500">
    *Chi phí thay đổi theo phạm vi tính năng & số vòng chỉnh sửa.
  </p>
</Section>


          {/* 4. Tài nguyên */}
          <Section id="requirements">
            <H2 k="PHẦN 4">Tài nguyên & dữ liệu cần chuẩn bị</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold"><Wrench className="size-4 text-amber-600"/> Tài khoản & kỹ thuật</div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                  <Bullet>Domain + DNS (hoặc 3BOW hỗ trợ mua/thiết lập)</Bullet>
                  <Bullet>Hosting/VPS/Serverless (Vercel/Render…)</Bullet>
                  <Bullet>Tài khoản GA4, Search Console, Meta Pixel</Bullet>
                </ul>
              </div>
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold"><Database className="size-4 text-amber-600"/> Nội dung & brand</div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                  <Bullet>Logo, màu sắc, font chữ, guideline (nếu có)</Bullet>
                  <Bullet>Nội dung trang: About/Service/Contact…</Bullet>
                  <Bullet>Hình ảnh/Video chất lượng cao</Bullet>
                </ul>
              </div>
            </div>
          </Section>

          {/* 5. Stack */}
          <Section id="stack">
            <H2 k="PHẦN 5">Stack kỹ thuật đề xuất</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <Feature icon={MonitorSmartphone} title="Frontend: Next.js + Tailwind"
                desc="App Router, ISR/SSR, ảnh tối ưu; UI sạch, dễ mở rộng." img={shot8} />
              <Feature icon={ShieldCheck} title="Backend: NestJS + DB"
                desc="REST/GraphQL, RBAC, Prisma/TypeORM với Postgres/MySQL." img={shot9} />
            </div>
          </Section>

          {/* 6. Bảng tiến độ kiểu Excel */}
          <Section id="progress">
            <H2 k="PHẦN 6">Bảng tiến độ dự án (theo dõi realtime)</H2>
            <div className="overflow-hidden bg-white border rounded-2xl">
              <div className="px-4 py-3 text-sm font-semibold tracking-wide uppercase border-b bg-amber-50 text-amber-800">
                WEBSITE PROJECT ROADMAP — SPRINT 01
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-fixed">
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[16%]" />
                    <col className="w-[18%]" />
                    <col className="w-[20%]" />
                    <col className="w-[14%]" />
                    <col className="w-[14%]" />
                  </colgroup>
                  <thead>
                    <tr className="text-left text-zinc-600 bg-zinc-50">
                      <th className="px-4 py-3 font-semibold">Hạng mục</th>
                      <th className="px-4 py-3 font-semibold">Mốc</th>
                      <th className="px-4 py-3 font-semibold">Người phụ trách</th>
                      <th className="px-4 py-3 font-semibold">Trạng thái</th>
                      <th className="px-4 py-3 font-semibold">Tiến độ</th>
                      <th className="px-4 py-3 font-semibold">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* Group 1 */}
                    <tr className="bg-amber-50/60">
                      <td colSpan={6} className="px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-amber-800">
                        1) Khởi động & Phân tích
                      </td>
                    </tr>
                    {[
                      {task:"Kickoff + thu thập brief", milestone:"Ngày 1", owner:"3BOW PM", status:"Hoàn thành", pct:100, eta:"Done"},
                      {task:"Audit & sitemap", milestone:"Ngày 2–3", owner:"UX Lead", status:"Đang làm", pct:60, eta:"28/09"},
                    ].map((r, i)=>(
                      <tr key={`g1-${i}`} className="hover:bg-zinc-50">
                        <td className="px-4 py-3">{r.task}</td>
                        <td className="px-4 py-3 text-zinc-600">{r.milestone}</td>
                        <td className="px-4 py-3 text-zinc-700">{r.owner}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            r.status==="Hoàn thành" ? "bg-green-100 text-green-700" :
                            r.status==="Đang làm" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-700"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-2 rounded bg-zinc-200">
                            <div className="h-2 rounded bg-amber-500" style={{width:`${r.pct}%`}} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{r.eta}</td>
                      </tr>
                    ))}

                    {/* Group 2 */}
                    <tr className="bg-amber-50/60">
                      <td colSpan={6} className="px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-amber-800">
                        2) Thiết kế & Duyệt
                      </td>
                    </tr>
                    {[
                      {task:"Wireframe + UI concept", milestone:"Ngày 4–6", owner:"UI Designer", status:"Chờ duyệt", pct:0, eta:"30/09"},
                      {task:"Revise vòng 1", milestone:"Ngày 7–8", owner:"UI + PM", status:"Chưa bắt đầu", pct:0, eta:"02/10"},
                    ].map((r, i)=>(
                      <tr key={`g2-${i}`} className="hover:bg-zinc-50">
                        <td className="px-4 py-3">{r.task}</td>
                        <td className="px-4 py-3 text-zinc-600">{r.milestone}</td>
                        <td className="px-4 py-3 text-zinc-700">{r.owner}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            r.status==="Chờ duyệt" ? "bg-blue-100 text-blue-700" :
                            "bg-zinc-100 text-zinc-700"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-2 rounded bg-zinc-200">
                            <div className="h-2 rounded bg-amber-500" style={{width:`${r.pct}%`}} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{r.eta}</td>
                      </tr>
                    ))}

                    {/* Group 3 */}
                    <tr className="bg-amber-50/60">
                      <td colSpan={6} className="px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-amber-800">
                        3) Lập trình & Kiểm thử
                      </td>
                    </tr>
                    {[
                      {task:"FE/BE triển khai", milestone:"Tuần 2", owner:"Dev team", status:"Chưa bắt đầu", pct:0, eta:"06/10"},
                      {task:"SEO + tốc độ + bảo mật", milestone:"Tuần 3", owner:"Tech Lead", status:"Chưa bắt đầu", pct:0, eta:"10/10"},
                    ].map((r, i)=>(
                      <tr key={`g3-${i}`} className="hover:bg-zinc-50">
                        <td className="px-4 py-3">{r.task}</td>
                        <td className="px-4 py-3 text-zinc-600">{r.milestone}</td>
                        <td className="px-4 py-3 text-zinc-700">{r.owner}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-zinc-100 text-zinc-700">Chưa bắt đầu</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-2 rounded bg-zinc-200">
                            <div className="h-2 rounded bg-amber-500" style={{width:`${r.pct}%`}} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{r.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 text-xs border-t text-zinc-500 bg-zinc-50">
                *Bảng minh hoạ. Bản thực tế sẽ tự động cập nhật từ Jira/Notion/Looker.
              </div>
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h3 className="m-0 text-lg font-bold">Bắt đầu dự án Website</h3>
              <p className="mt-2 text-sm text-zinc-700">Gửi brief, nhận demo sitemap & báo giá chi tiết trong 24h.</p>
              <a href="/lien-he" className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 text-white transition bg-black rounded-lg hover:opacity-90">
                Nhận tư vấn miễn phí
              </a>
            </div>

            <nav className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Mục lục</p>
              <ul className="space-y-2 text-sm">
                {[
                  ["#value", "Vì sao chọn 3BOW"],
                  ["#gallery", "Ví dụ giao diện"],
                  ["#pricing", "Gói & chi phí"],
                  ["#requirements", "Tài nguyên yêu cầu"],
                  ["#stack", "Stack kỹ thuật"],
                  ["#progress", "Bảng tiến độ"],
                ].map(([href, label]) => (
                  <li key={href as string}><a className="hover:underline text-zinc-700" href={href as string}>{label}</a></li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>

      {/* CTA cuối */}
      <section className="bg-white border-t">
        <div className="max-w-6xl px-4 py-12 mx-auto">
          <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
            Sẵn sàng tăng trưởng bằng Website chuẩn chỉnh
            <>
              <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
              <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
            </>
          </h2>
          <p className="max-w-3xl mt-2 text-zinc-600">Thiết kế – phát triển – đo lường – tối ưu liên tục để website tạo ra kết quả.</p>
          <a href="/lien-he" className="inline-flex items-center px-5 py-2 mt-5 font-medium text-white transition bg-black rounded-lg hover:opacity-90">
            Trao đổi với 3BOW
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
