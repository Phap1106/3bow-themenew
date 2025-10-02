// src/app/not-found.tsx
"use client";

import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#0B1220] via-[#0B1220] to-[#F7FBFF]">
        {/* decorative grid/radial glow */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-x-0 top-20 mx-auto h-56 w-[48rem] rounded-full blur-3xl bg-gradient-to-r from-violet-600/30 via-sky-500/30 to-cyan-400/30"></div>
        </div>

        <div className="relative container-max">
          <div className="max-w-3xl p-8 md:p-12 mx-auto text-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)]">
            {/* 404 số lớn – gradient chữ */}
            <div className="text-7xl md:text-9xl font-black tracking-tight">
              <span className="text-transparent bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text drop-shadow-sm">
                404
              </span>
            </div>

            {/* Tiêu đề rõ ràng */}
            <h1 className="mt-4 md:mt-5 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Không tìm thấy trang bạn yêu cầu
            </h1>

            <p className="mt-3 text-sm md:text-base text-zinc-200/90">
              Đường dẫn có thể đã thay đổi hoặc không tồn tại. Hãy quay lại trang chủ
              hoặc liên hệ chúng tôi để được hỗ trợ nhanh nhất.
            </p>

            {/* Hành động */}
            <div className="flex items-center justify-center gap-3 mt-7">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-zinc-900 font-medium transition-colors hover:bg-zinc-100"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-white/95 font-medium transition-colors hover:border-white/50 hover:bg-white/5"
              >
                <Mail className="h-4 w-4" />
                Liên hệ
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/60">
              Mẹo: Kiểm tra lại URL hoặc dùng menu điều hướng để tiếp tục.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
