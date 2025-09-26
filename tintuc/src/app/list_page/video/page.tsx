// src/app/list_page/video/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  Clapperboard,
  Wand2,
  Megaphone,
  ShieldCheck,
  Rocket,
  Camera,
  Video as VideoIcon,
  Music2,
  Captions,
  ChevronRight,
  PlayCircle,
  PartyPopper,
  Mic2,
  Lightbulb,
  Crop,
  Timer,
  Brush,
  X,
} from "lucide-react";

// ảnh demo (thay ảnh/video thật của bạn)
import shot1 from "@/app/image/video-img/video1.jpg";

/* ---------------- helpers ---------------- */
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

// H2 màu nhạt hơn dùng cho phần 3
const H2Soft = ({ children, k }: { children: React.ReactNode; k?: string }) => (
  <div className="mb-6">
    {k && <div className="mb-2 text-xs font-semibold tracking-widest text-amber-500">{k}</div>}
    <h2 className="relative inline-block pb-2 text-2xl font-extrabold tracking-wider uppercase md:text-3xl text-zinc-800">
      {children}
      <>
        <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-300" />
        <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
      </>
    </h2>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/20 text-white/90 border border-white/30">
    {children}
  </span>
);

// Bullet mới: mặc định wrap; có thể ép 1 dòng bằng prop nowrap
const Bullet = ({
  icon: Icon,
  text,
  nowrap = false,
}: { icon?: any; text: string; nowrap?: boolean }) => (
  <li
    className={`flex items-start gap-2 ${
      nowrap ? "whitespace-nowrap" : "whitespace-normal break-words hyphens-auto"
    }`}
  >
    {Icon ? (
      <Icon className="mt-1 size-3.5 text-amber-600" />
    ) : (
      <span className="mt-1 text-amber-500">•</span>
    )}
    <span className="text-sm leading-6 text-zinc-700">{text}</span>
  </li>
);


const Feature = ({
  icon: Icon,
  title,
  desc,
}: { icon: any; title: string; desc: string }) => (
  <div className="h-full p-5 transition bg-white border rounded-xl hover:shadow-md">
    <div className="flex items-center gap-3">
      <div className="p-2 border rounded-lg bg-amber-50 shrink-0">
        <Icon className="size-5 text-amber-600" />
      </div>
      <h3 className="font-semibold leading-tight">{title}</h3>
    </div>
    <p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p>
    <div className="inline-flex items-center mt-3 text-xs text-zinc-500">
      Tìm hiểu thêm <ChevronRight className="ml-1 size-4" />
    </div>
  </div>
);

/* ---------------- Simple modal video player ---------------- */
function useLockScroll(open: boolean) {
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);
}

function VideoLightbox({
  open, onClose, videoUrl, title,
}: { open: boolean; onClose: () => void; videoUrl: string; title: string }) {
  useLockScroll(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl overflow-hidden bg-black rounded-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute z-10 p-2 text-white rounded-full top-3 right-3 bg-white/10 hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
        <video key={videoUrl} className="w-full h-full" controls playsInline autoPlay>
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="px-4 py-2 text-sm text-white/80">{title}</div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Page() {
  const [open, setOpen] = React.useState(false);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>Sản xuất theo yêu cầu</Chip>
              <Chip>AI Video (tuỳ chọn)</Chip>
              <Chip>Chuẩn đa nền tảng</Chip>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,.2)]">
              SẢN XUẤT VIDEO & AI VIDEO
            </h1>
            <p className="max-w-[62ch] mt-2 text-white/90">
              3BOW thực hiện kịch bản → quay dựng → motion/CGI → phân phối. Tích hợp AI tăng tốc & tạo biến thể,
              đảm bảo **bản quyền** và tối ưu hiệu quả người xem.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* MAIN */}
        <div className="space-y-12 lg:col-span-8">
          {/* 1. Dịch vụ */}
          <Section id="dich-vu">
            <H2 k="PHẦN 1">Chúng tôi làm gì?</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <Feature icon={Clapperboard} title="Video theo yêu cầu"
                desc="TV/YouTube, viral social, phỏng vấn, case study, tutorial, review sản phẩm…" />
              <Feature icon={Wand2} title="AI Video tăng tốc"
                desc="Text-to-video, voice-over AI (có consent), lip-sync, upscaling, generative B-roll." />
              <Feature icon={Megaphone} title="Chuẩn đa nền tảng"
                desc="Xuất 16:9, 1:1, 9:16; phụ đề auto; thumbnail bắt mắt; hook 3s đầu giữ người xem." />
              <Feature icon={ShieldCheck} title="Bản quyền & an toàn"
                desc="Asset stock có license, nhạc bản quyền, kiểm tra trùng lặp; tuân thủ guideline nền tảng." />
            </div>
          </Section>

        {/* 2. Video demo — 1 nút xem duy nhất (fixed overflow) */}
<Section id="demo">
  <H2 k="PHẦN 2">Video minh hoạ</H2>

  <div className="grid gap-6 md:grid-cols-2">
    {/* Card video */}
    <div className="overflow-hidden bg-white border rounded-2xl">
      <div className="relative aspect-video">
        <Image src={shot1} alt="Video demo" fill className="object-cover" />
      </div>

      {/* TEXT: bật wrap + break-words + hyphens */}
      <div className="p-4">
        <p className="text-sm leading-6 break-words whitespace-normal text-zinc-700 hyphens-auto">
          Demo video giới thiệu thương hiệu (tỉ lệ 16:9). Bấm nút để xem trực tiếp.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 mt-3 font-medium transition border rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300"
        >
          <PartyPopper className="size-5" />
          Xem video demo
          <PlayCircle className="size-5" />
        </button>
      </div>
    </div>

    {/* Card lý do: cũng bật wrap + break-words */}
    <div className="p-5 bg-white border rounded-2xl">
      <div className="text-sm font-semibold text-amber-600">Vì sao nên xem demo?</div>
      <ul className="grid grid-cols-1 gap-2 mt-2">
        <li className="flex items-center gap-2 break-words whitespace-normal hyphens-auto">
          <VideoIcon className="size-3.5 text-amber-600" />
          <span className="text-sm text-zinc-700">Thấy rõ style dựng &amp; motion của 3BOW</span>
        </li>
        <li className="flex items-center gap-2 break-words whitespace-normal hyphens-auto">
          <Music2 className="size-3.5 text-amber-600" />
          <span className="text-sm text-zinc-700">Âm nhạc/giọng đọc cân đối, không vi phạm bản quyền</span>
        </li>
        <li className="flex items-center gap-2 break-words whitespace-normal hyphens-auto">
          <Captions className="size-3.5 text-amber-600" />
          <span className="text-sm text-zinc-700">Phụ đề auto + font brand dễ đọc</span>
        </li>
      </ul>
    </div>
  </div>
</Section>
{/* 3. Gói dịch vụ — nút luôn ở đáy card */}
<Section id="goi">
  <H2Soft k="PHẦN 3">Gói nhanh & chi phí theo 1 video</H2Soft>
  <div className="grid gap-6 md:grid-cols-3">
    {[
      {
        name: "Short Social",
        price: "8–18 triệu/clip",
        items: [
          { icon: VideoIcon, text: "15–60s (9:16/1:1)" },
          { icon: Captions,  text: "Hook + caption + nhạc" },
          { icon: Megaphone, text: "Xuất TikTok/Reels/Shorts" },
        ],
      },
      {
        name: "YouTube Video",
        price: "20–60 triệu/clip",
        items: [
          { icon: VideoIcon,     text: "3–10 phút (16:9)" },
          { icon: Clapperboard,  text: "Kịch bản + quay dựng" },
          { icon: ShieldCheck,   text: "Thumbnail + SEO cơ bản" },
        ],
      },
      {
        name: "AI Video Pack",
        price: "5–15 triệu/clip",
        items: [
          { icon: Wand2,       text: "Text-to-Video/Lip-sync" },
          { icon: Mic2,        text: "Voice AI (có consent)" },
          { icon: ShieldCheck, text: "B-roll/CGI/Stock có license" },
        ],
      },
    ].map((p, i) => (
      <div key={i} className="p-5 bg-white border rounded-2xl">
        {/* flex-col + h-full để nút luôn chạm đáy */}
        <div className="flex h-full flex-col min-h-[320px]">
          <div>
            <div className="text-sm font-semibold text-amber-600">{p.name}</div>
            <div className="mt-1 text-2xl font-extrabold">{p.price}</div>
            <ul className="mt-3 space-y-2">
              {p.items.map((it) => (
                <li key={it.text} className="flex items-center gap-2 whitespace-nowrap">
                  <it.icon className="size-3.5 text-amber-600" />
                  <span className="text-sm text-zinc-700">{it.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* mt-auto đẩy nút xuống đáy */}
          <a
            href="/contact"
            className="inline-flex items-center justify-center w-full h-10 px-3 mt-auto transition border rounded-lg text-amber-900 bg-amber-100 border-amber-300 hover:bg-amber-200 whitespace-nowrap"
          >
            Nhận tư vấn & báo giá
          </a>
        </div>
      </div>
    ))}
  </div>
  <p className="mt-2 text-xs text-zinc-500">
    *Giá thay đổi theo bối cảnh quay, thiết bị, diễn viên, địa điểm & số vòng chỉnh sửa.
  </p>
</Section>

          {/* 4. Hỗ trợ setup góc quay */}
          <Section id="setup">
            <H2 k="PHẦN 4">Hỗ trợ setup góc quay tại chỗ</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="size-4 text-amber-600" /> Ánh sáng & bố cục
                </div>
                <ul className="mt-2 space-y-1">
                  <Bullet text="Đèn key/fill/back; cân bằng màu, tránh bóng đổ" />
                  <Bullet icon={Crop} text="Khung hình: rule of thirds, headroom" />
                  <Bullet icon={Brush} text="Background gọn gàng/hợp brand" />
                </ul>
              </div>
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Mic2 className="size-4 text-amber-600" /> Âm thanh & thiết bị
                </div>
                <ul className="mt-2 space-y-1">
                  <Bullet text="Mic cài áo/shotgun, chống ồn & pop" />
                  <Bullet text="Tripod/gimbal; chống rung" />
                  <Bullet icon={Timer} text="Checklist: pin/thẻ/backup trước quay" />
                </ul>
              </div>
            </div>
          </Section>

          {/* 5. Cam kết nền tảng & bản quyền */}
          <Section id="commit">
            <H2 k="PHẦN 5">Tối ưu theo nền tảng — Không vi phạm bản quyền</H2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold"><Captions className="size-4 text-amber-600" /> Chuẩn đăng tải</div>
                <ul className="mt-2 space-y-1">
                  <Bullet text="Tỉ lệ 16:9 / 1:1 / 9:16; bitrate & codec phù hợp YouTube/TikTok/Facebook" />
                  <Bullet text="Sub tự động + kiểm tra; font brand đồng bộ" />
                  <Bullet text="Hook 3s đầu, CTA rõ ràng, thumbnail hấp dẫn" />
                </ul>
              </div>
              <div className="p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold"><Music2 className="size-4 text-amber-600" /> Bản quyền an toàn</div>
                <ul className="mt-2 space-y-1">
                  <Bullet text="Kho nhạc/ảnh/footage có giấy phép; quản lý license tập trung" />
                  <Bullet text="Voice AI chỉ khi có văn bản đồng thuận" />
                  <Bullet text="Kiểm tra trùng lặp & guideline nền tảng trước khi public" />
                </ul>
              </div>
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">🎬</div>
                <h3 className="m-0 text-lg font-bold">Bắt đầu dự án Video</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-700">
                Nhận demo kịch bản & bảng chi phí trong 24h. Có gói AI video tiết kiệm.
              </p>
              <a
                href="/lien-he"
                className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 text-white transition bg-black rounded-lg hover:opacity-90"
              >
                Liên hệ 3BOW
              </a>
            </div>

            <nav className="p-4 bg-white border rounded-xl">
              <p className="mb-3 text-sm font-semibold">Mục lục</p>
              <ul className="space-y-2 text-sm">
                {[
                  ["#dich-vu", "Dịch vụ"],
                  ["#demo", "Video demo"],
                  ["#goi", "Gói & chi phí"],
                  ["#setup", "Setup góc quay"],
                  ["#commit", "Bản quyền & nền tảng"],
                ].map(([href, label]) => (
                  <li key={href as string}>
                    <a className="hover:underline text-zinc-700" href={href as string}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>

      {/* CTA */}
      <section className="bg-white border-t">
        <div className="max-w-6xl px-4 py-12 mx-auto">
          <h2 className="relative inline-block pb-2 text-2xl tracking-wider uppercase md:text-3xl font-900">
            Biến ý tưởng thành video thu hút người xem
            <>
              <span className="absolute left-0 bottom-0 h-[3px] w-36 md:w-56 rounded-full bg-amber-400" />
              <span className="absolute left-0 bottom-[-6px] h-[2px] w-20 md:w-28 rounded-full bg-amber-200" />
            </>
          </h2>
          <p className="max-w-3xl mt-2 text-zinc-600">
            Sản xuất sáng tạo + AI tăng tốc + tuân thủ bản quyền = nội dung an toàn mà vẫn bùng nổ.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-5 py-2 mt-5 font-medium text-white transition bg-black rounded-lg hover:opacity-90"
          >
            Trao đổi ngay với 3BOW
          </a>
        </div>
      </section>

      {/* Lightbox */}
      <VideoLightbox
        open={open}
        onClose={() => setOpen(false)}
        videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"
        title="Video demo — Brand Intro 16:9"
      />
    </SiteShell>
  );
}
