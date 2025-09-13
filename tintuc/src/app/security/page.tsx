// src/app/privacy/page.tsx
"use client";

import Image from "next/image";
import SiteShell from "@/components/siteHeaderFooter";
import {
  ShieldCheck,
  Lock,
  FileText,
  Database,
  KeyRound,
  EyeOff,
  UserCheck,
  History,
  Server,
  Globe,
  ClipboardCheck,
  FileSpreadsheet,
  Receipt,
  Ban,
  Shield,
} from "lucide-react";
import { ReactNode } from "react";

/* ---------- Helpers ---------- */
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-3xl font-extrabold tracking-tight text-center md:text-4xl">
    {children}
  </h2>
);

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Hero />
      <PolicyList />
      <AbsoluteRules />
      <InvoiceCommit />
      <ContactNote />
    </SiteShell>
  );
}

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=2000&auto=format&fit=crop"
          alt="Bảo mật dữ liệu khách hàng"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 text-center">
            <p className="text-[12px] md:text-sm text-zinc-700">
              Chúng tôi coi dữ liệu của bạn là tài sản cần được bảo vệ nghiêm ngặt
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-wide md:text-5xl text-zinc-900/90">
              CHÍNH SÁCH <span className="text-violet-600">BẢO MẬT</span> 3BOW
            </h1>
            <p className="max-w-3xl mx-auto mt-3 text-zinc-700">
              Tất cả quy trình, hệ thống và con người tại 3BOW đều tuân thủ các tiêu chuẩn
              bảo mật nhằm đảm bảo an toàn, minh bạch và toàn vẹn dữ liệu khách hàng.
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-full -mt-6 h-10 w-[92%] -translate-x-1/2 rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
    </section>
  );
}

/* ================= 12 POLICIES ================= */
function PolicyList() {
  const items = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Thu thập tối thiểu",
      desc: "Chỉ thu thập thông tin cần thiết để thực hiện dịch vụ; không yêu cầu dữ liệu vượt quá mục đích sử dụng.",
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      title: "Mục đích rõ ràng",
      desc: "Thông báo minh bạch về mục đích xử lý; không sử dụng dữ liệu ngoài phạm vi đã thỏa thuận.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Mã hoá & an toàn truyền/nhận",
      desc: "Mã hoá khi truyền (HTTPS/TLS) và áp dụng lớp bảo vệ khi lưu trữ; kiểm soát rò rỉ dữ liệu.",
    },
    {
      icon: <KeyRound className="w-5 h-5" />,
      title: "Kiểm soát truy cập theo vai trò",
      desc: "RBAC – chỉ những người có thẩm quyền mới được tiếp cận; ghi log mọi truy cập, thay đổi.",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Xác thực mạnh",
      desc: "Áp dụng xác thực nhiều lớp cho tài khoản nhạy cảm; đổi mật khẩu định kỳ và bắt buộc tối thiểu độ mạnh.",
    },
    {
      icon: <History className="w-5 h-5" />,
      title: "Sao lưu & khôi phục",
      desc: "Sao lưu định kỳ; kế hoạch DR (Disaster Recovery) để đảm bảo khôi phục dữ liệu khi có sự cố.",
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Lưu trữ có thời hạn",
      desc: "Đặt thời hạn lưu trữ phù hợp; xoá/ẩn danh khi hoàn tất mục đích hoặc theo yêu cầu pháp lý.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "NDA & bảo mật nội bộ",
      desc: "Tất cả nhân sự, đối tác ký thoả thuận bảo mật (NDA); đào tạo định kỳ về an toàn thông tin.",
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: "Đối tác hạ tầng đạt chuẩn",
      desc: "Chỉ sử dụng nhà cung cấp hạ tầng có chứng chỉ bảo mật phù hợp; ký DPA khi cần thiết.",
    },
    {
      icon: <EyeOff className="w-5 h-5" />,
      title: "Quyền của chủ thể dữ liệu",
      desc: "Khách hàng có quyền yêu cầu xem/sửa/xoá dữ liệu; 3BOW phản hồi hợp lý, kịp thời.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Tuân thủ quy định pháp luật",
      desc: "Tuân thủ pháp luật Việt Nam và các yêu cầu liên quan tới dữ liệu cá nhân, quảng cáo số.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Giám sát & phản hồi sự cố",
      desc: "Giám sát an ninh 24/7; khi có sự cố, kích hoạt quy trình phản hồi, thông báo và khắc phục nhanh.",
    },
  ] as const;

  return (
    <section className="relative z-[1] -mt-6 pb-8">
      <div className="mx-auto w-[92%] max-w-6xl rounded-[28px] border border-zinc-200 bg-white/95 px-6 py-8 md:px-10">
        <H2>12 CHÍNH SÁCH BẢO VỆ THÔNG TIN KHÁCH HÀNG</H2>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <div
              key={x.title}
              className="p-6 transition-all bg-white border shadow-sm group rounded-3xl border-zinc-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <div className="grid w-10 h-10 rounded-full place-items-center bg-violet-50 text-violet-700">
                {x.icon}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{x.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{x.desc}</p>
              <div className="mt-4 h-0.5 w-0 bg-violet-500 transition-all duration-300 group-hover:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ABSOLUTE RULES TABLE ================= */
function AbsoluteRules() {
  const rows = [
    ["Bán/chuyển nhượng dữ liệu khách hàng", "Cấm tuyệt đối", "Không ngoại lệ."],
    ["Sử dụng dữ liệu KH cho mục đích quảng cáo nội bộ", "Cấm tuyệt đối", "Chỉ dùng theo phạm vi hợp đồng."],
    ["Truy cập dữ liệu ngoài tài khoản/thiết bị được cấp", "Cấm tuyệt đối", "RBAC + log truy cập."],
    ["Chia sẻ mật khẩu/tài khoản cho bên thứ ba", "Cấm tuyệt đối", "Bắt buộc 2FA cho tài khoản nhạy cảm."],
    ["Gửi dữ liệu KH qua kênh công khai (chat, email cá nhân...)", "Cấm tuyệt đối", "Chỉ dùng kênh đã phê duyệt & mã hoá."],
    ["Lưu dữ liệu KH trên thiết bị cá nhân không mã hoá", "Cấm tuyệt đối", "Tuân thủ chuẩn lưu trữ an toàn."],
    ["Tải dữ liệu KH lên dịch vụ lưu trữ chưa phê duyệt", "Cấm tuyệt đối", "Chỉ dùng hạ tầng được duyệt & có DPA."],
    ["Công bố case study có chứa dữ liệu nhạy cảm", "Cấm tuyệt đối", "Chỉ công bố khi đã ẩn danh và có văn bản đồng ý."],
    ["Xuất dữ liệu KH theo yêu cầu không hợp lệ", "Cấm tuyệt đối", "Chỉ thực hiện khi có yêu cầu hợp pháp, đủ thẩm quyền."],
  ] as const;

  return (
    <section className="py-14">
      <div className="container-max">
        <H2>QUY ĐỊNH <span className="text-violet-600">BẢO MẬT TUYỆT ĐỐI</span></H2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full bg-white border border-separate border-spacing-0 rounded-2xl border-zinc-200">
            <thead>
              <tr className="bg-zinc-50">
                <th className="px-4 py-3 text-sm font-semibold text-left text-zinc-700">
                  Hành vi
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-zinc-700">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-zinc-700">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b, c], i) => (
                <tr
                  key={i}
                  className="transition-colors border-t border-zinc-200 hover:bg-zinc-50/60"
                >
                  <td className="px-4 py-3 text-sm align-top">{a}</td>
                  <td className="px-4 py-3 text-sm align-top">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200">
                      <Ban className="h-3.5 w-3.5" />
                      {b}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm align-top text-zinc-600">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          *Mọi vi phạm sẽ bị xử lý theo quy chế nội bộ và quy định pháp luật hiện hành.
        </p>
      </div>
    </section>
  );
}

/* ================= INVOICE COMMIT (HIGHLIGHT) ================= */
function InvoiceCommit() {
  return (
    <section className="py-14">
      <div className="container-max">
        <div className="relative p-8 overflow-hidden text-center border shadow-lg group rounded-3xl border-violet-200 bg-gradient-to-r from-violet-600 to-sky-600">
          {/* Aura + shine */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute rounded-full -left-10 -top-16 h-52 w-52 bg-white/20 blur-3xl" />
            <div className="absolute rounded-full -right-10 -bottom-16 h-52 w-52 bg-white/20 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-1000 group-hover:before:translate-x-full" />

          <div className="flex flex-col items-center max-w-3xl gap-2 mx-auto text-white">
            <div className="grid w-12 h-12 rounded-full place-items-center bg-white/15">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-wide uppercase">
              3BOW CAM KẾT <span className="underline underline-offset-4 decoration-white/70">XUẤT HÓA ĐƠN 100%</span>
            </h3>
            <p className="text-white/90">
              Mọi khoản chi tiêu dịch vụ tại 3BOW đều được xuất hoá đơn đầy đủ, chính xác,
              đúng pháp luật, đúng thời hạn và đối soát minh bạch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CONTACT NOTE ================= */
function ContactNote() {
  return (
    <section className="bg-[#F7FBFF] py-12">
      <div className="text-center container-max">
        <p className="max-w-3xl mx-auto text-sm text-zinc-600">
          Nếu bạn có câu hỏi liên quan tới quyền riêng tư hoặc muốn thực hiện các quyền
          đối với dữ liệu cá nhân (xem/sửa/xoá), vui lòng gửi yêu cầu tới{" "}
          <a className="font-medium text-violet-700 hover:underline" href="mailto:contact@3bow.vn">
            contact@3bow.vn
          </a>{" "}
          — chúng tôi sẽ phản hồi sớm nhất có thể.
        </p>
      </div>
    </section>
  );
}
