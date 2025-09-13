// src/app/not-found.tsx
"use client";

import Link from "next/link";
import SiteShell from "@/components/siteHeaderFooter";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="py-16 bg-gradient-to-b from-white to-[#F7FBFF]">
        <div className="container-max">
          <div className="max-w-3xl p-10 mx-auto text-center border shadow-sm rounded-3xl border-zinc-200 bg-white/95">
            {/* 404 số lớn – gradient chữ */}
            <div className="text-6xl font-black tracking-tight md:text-8xl">
              <span className="text-transparent bg-gradient-to-r from-violet-700 to-sky-600 bg-clip-text">
                404
              </span>
            </div>

            {/* Tiêu đề IN HOA, rõ ràng */}
            <h1 className="mt-3 text-2xl font-extrabold tracking-widest uppercase md:text-3xl text-zinc-900">
              KHÔNG TÌM THẤY TRANG
            </h1>

            <p className="mt-3 text-zinc-600">
              Đường dẫn có thể đã thay đổi hoặc không tồn tại. Bạn có thể quay về
              trang chủ hoặc liên hệ để được hỗ trợ.
            </p>

            {/* Hành động ngắn gọn */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-white transition hover:bg-zinc-800"
              >
                <Home className="w-4 h-4" />
                VỀ TRANG CHỦ
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-zinc-800 transition hover:bg-zinc-50"
              >
                <Mail className="w-4 h-4" />
                LIÊN HỆ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
