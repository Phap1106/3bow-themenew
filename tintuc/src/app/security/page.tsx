// src/app/security/page.tsx
"use client";

import * as React from "react";
import SiteShell from "@/components/siteHeaderFooter";
import {
  ShieldCheck, Lock, KeySquare, FileText, UserCheck, Database,
  Server, Network, Bug, BellRing, Clock4, ClipboardCheck, Globe2,
  CheckCircle2, Link2, FileKey2, MailCheck, Repeat2, BookOpenText
} from "lucide-react";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{children}</h2>
);
const Section = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <section className={`py-12 md:py-16 ${className}`}>{children}</section>
);

export default function SecurityPage() {
  return (
    <SiteShell>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-700 via-sky-600 to-sky-800" />
        <div className="absolute inset-x-0 -top-32 h-64 opacity-30 [background:radial-gradient(600px_200px_at_50%_120px,white,transparent)]" />
        <div className="relative max-w-6xl px-4 pt-24 pb-16 mx-auto text-white md:pt-28">
          <div className="max-w-3xl pt-8">
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-white/80">3BOW · Security & Compliance</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Quy định hợp tác & Chính sách bảo mật
            </h1>
            <p className="mt-4 text-white/90 md:text-lg">
              Mục tiêu của 3BOW là bảo vệ dữ liệu và quyền riêng tư của khách hàng ở mức cao nhất,
              đồng thời đảm bảo tính sẵn sàng, toàn vẹn và minh bạch trong mọi hoạt động.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Badge icon={<ShieldCheck className="w-4 h-4" />} text="Defense-in-Depth" />
              <Badge icon={<Lock className="w-4 h-4" />} text="Encryption-by-Default" />
              <Badge icon={<ClipboardCheck className="w-4 h-4" />} text="Audit & Traceability" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== NGUYÊN TẮC HỢP TÁC ===== */}
      <Section className="bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <H2>Nguyên tắc khi hợp tác với 3BOW</H2>
          <p className="mt-3 text-gray-600">
            Những nguyên tắc cốt lõi giúp hai bên làm việc hiệu quả, minh bạch và an toàn.
          </p>

          <div className="grid gap-4 mt-8 md:grid-cols-3">
            <Card title="Hợp đồng & NDA" icon={FileKey2}
              desc="Ký Hợp đồng dịch vụ (MSA/SOW) và NDA ràng buộc bảo mật trước khi truy cập dữ liệu." />
            <Card title="Ít quyền nhất (Least-Privilege)" icon={KeySquare}
              desc="Chỉ cấp đúng vai trò cần thiết; mọi quyền đều có thời hạn & ghi log." />
            <Card title="Minh bạch & Kiểm toán" icon={ClipboardCheck}
              desc="Lịch sử thay đổi, nhật ký truy cập và báo cáo định kỳ được lưu đầy đủ." />
          </div>
        </div>
      </Section>

      {/* ===== QUY ĐỊNH BẢO MẬT CHÍNH ===== */}
      <Section className="bg-slate-50">
        <div className="max-w-6xl px-4 mx-auto">
          <H2>Quy định bảo mật</H2>
          <div className="grid gap-4 mt-8 md:grid-cols-2">
            <List
              title="Bảo vệ dữ liệu"
              items={[
                ["Mã hoá", "Dữ liệu mã hoá khi truyền (TLS 1.2+) & khi lưu (AES-256 hoặc tương đương).", Lock],
                ["Phân loại dữ liệu", "Xác định mức độ (Public/Internal/Confidential/Restricted) trước khi xử lý.", Database],
                ["Sao lưu & khôi phục", "Backup hằng ngày, kiểm thử khôi phục định kỳ; RPO/RTO theo SLA.", Repeat2],
                ["Lưu trữ tối thiểu", "Chỉ lưu dữ liệu cần thiết; có chính sách xoá/ẩn danh theo thời hạn.", Server],
              ]}
            />
            <List
              title="Truy cập & quyền hạn"
              items={[
                ["Xác thực", "Bắt buộc MFA với tài khoản nội bộ; khuyến nghị SSO/OAuth với phía khách hàng.", UserCheck],
                ["RBAC", "Quyền dựa trên vai trò; cấp quyền tạm thời cho yêu cầu vận hành.", KeySquare],
                ["Mạng & API", "Giới hạn IP, tường lửa WAF, rate-limit & kiểm soát khoá API.", Network],
                ["Nhật ký & theo dõi", "Ghi log truy cập, thay đổi cấu hình; lưu trữ log ≥ 180 ngày.", BookOpenText],
              ]}
            />
            <List
              title="Tuân thủ & pháp lý"
              items={[
                ["DPA & SCC", "Ký Thoả thuận xử lý dữ liệu (DPA) và điều khoản chuyển giao theo yêu cầu.", FileText],
                ["Bí mật kinh doanh", "Nhân sự 3BOW cam kết không chia sẻ dữ liệu cho bên thứ ba khi chưa có phép.", ShieldCheck],
                ["Bên thứ ba", "Đánh giá rủi ro nhà cung cấp; chỉ dùng dịch vụ đạt chuẩn bảo mật.", Globe2],
                ["Yêu cầu pháp lý", "Chỉ cung cấp dữ liệu khi có văn bản hợp lệ; thông báo cho khách hàng khi luật cho phép.", MailCheck],
              ]}
            />
            <List
              title="Sự cố & thông báo"
              items={[
                ["Phát hiện", "Giám sát bất thường, cảnh báo realtime.", BellRing],
                ["Ứng phó", "Kích hoạt IRP (Incident Response Plan) với vai trò & kênh liên lạc rõ ràng.", Bug],
                ["Thông báo vi phạm", "Thông báo khách hàng trong thời hạn cam kết ở SLA/DPA.", Clock4],
                ["Hậu kiểm", "Báo cáo nguyên nhân gốc rễ (RCA) & biện pháp phòng ngừa tái diễn.", CheckCircle2],
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ===== QUYỀN & TRÁCH NHIỆM ===== */}
      <Section className="bg-white">
        <div className="max-w-6xl px-4 mx-auto">
          <H2>Quyền & Trách nhiệm hai bên</H2>
          <div className="grid gap-4 mt-6 md:grid-cols-2">
            <BulletPanel
              title="Khách hàng cung cấp"
              bullets={[
                "Thông tin hệ thống & phạm vi dữ liệu được phép truy cập.",
                "Tài khoản/Quyền truy cập cần thiết (hoặc 3BOW hỗ trợ tạo tài khoản tách biệt).",
                "Đầu mối phê duyệt quyền và xác nhận thay đổi.",
              ]}
            />
            <BulletPanel
              title="3BOW cam kết"
              bullets={[
                "Chỉ sử dụng dữ liệu cho mục đích trong Hợp đồng & NDA.",
                "Không tải xuống dữ liệu nhạy cảm nếu không thật sự cần thiết.",
                "Gỡ quyền/thu hồi dữ liệu ngay khi kết thúc dự án hoặc theo yêu cầu.",
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ===== CTA / LIÊN HỆ ===== */}
      <Section className="relative overflow-hidden bg-gradient-to-r from-sky-700 to-indigo-700">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(600px_200px_at_20%_20%,white,transparent)]" />
        <div className="relative max-w-6xl px-4 mx-auto text-white">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <H2>Yêu cầu bộ tài liệu đầy đủ (SLA, DPA, NDA mẫu)</H2>
              <p className="mt-3 text-white/90">
                Chúng tôi có sẵn checklist kiểm thử bảo mật, quy trình IRP và biểu mẫu đánh giá rủi ro nhà cung cấp.
              </p>
            </div>
            <div className="justify-self-start md:justify-self-end">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold transition bg-white rounded-full text-slate-900 hover:bg-slate-100"
              >
                <Link2 className="w-4 h-4" />
                Liên hệ 3BOW
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section className="bg-slate-50">
        <div className="max-w-6xl px-4 mx-auto">
          <H2>FAQ – Câu hỏi thường gặp</H2>
          <div className="mt-6 space-y-3">
            <FAQ q="3BOW có ký NDA/DPA riêng theo mẫu của khách hàng không?"
                a="Có. Chúng tôi linh hoạt theo mẫu của khách hàng hoặc dùng mẫu tiêu chuẩn của 3BOW." />
            <FAQ q="Dữ liệu được lưu ở đâu?"
                a="Triển khai tuỳ dự án (VN/Singapore/US). Vị trí lưu trữ sẽ ghi rõ trong hợp đồng." />
            <FAQ q="Có hỗ trợ kiểm thử bảo mật độc lập không?"
                a="Sẵn sàng phối hợp pentest/VA của bên thứ ba, xử lý khuyến nghị theo mức độ ưu tiên." />
            <FAQ q="Khi kết thúc hợp đồng, 3BOW xử lý dữ liệu thế nào?"
                a="Thực hiện xoá/ẩn danh theo điều khoản DPA; bàn giao bản sao cần thiết và thu hồi mọi khoá truy cập." />
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}

/* ===== Reusable bits ===== */
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-white/15 ring-1 ring-white/25">
      {icon} {text}
    </span>
  );
}

function Card({ title, desc, icon: Icon }: { title: string; desc: string; icon: React.ComponentType<any> }) {
  return (
    <div className="p-5 transition bg-white border shadow-sm rounded-2xl border-slate-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function List({
  title,
  items,
}: {
  title: string;
  items: [string, string, React.ComponentType<any>][];
}) {
  return (
    <div className="p-5 bg-white border rounded-2xl border-slate-200">
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map(([t, d, I], i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-200">
              <I className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-gray-600">{d}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletPanel({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="p-5 bg-white border rounded-2xl border-slate-200">
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-gray-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-white border rounded-xl border-slate-200">
      <button
        className="flex items-center justify-between w-full p-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold">{q}</span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-gray-600">{a}</p>
        </div>
      </div>
    </div>
  );
}
