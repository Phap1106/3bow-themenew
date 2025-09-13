


// // app/admin/leads/page.tsx
// "use client";

// import * as React from "react";
// import { toast } from "sonner";
// import { Loader2, ChevronLeft, Search, Eye } from "lucide-react";
// import AdminSidebar from "@/components/admin/AdminSidebar";
// import LogoutButton from "@/components/common/LogoutButton";
// /* ===================== Enums khớp Prisma ===================== */
// export const SERVICE = {
//   SEO: "SEO",
//   GOOGLE_ADS: "GOOGLE_ADS",
//   FACEBOOK_INSTAGRAM_ADS: "FACEBOOK_INSTAGRAM_ADS",
//   TIKTOK_ADS: "TIKTOK_ADS",
//   LANDING_TRACKING: "LANDING_TRACKING",
//   OTHER: "OTHER",
// } as const;
// export type ServiceType = (typeof SERVICE)[keyof typeof SERVICE];

// export const BUDGET = {
//   LT_50M: "LT_50M",
//   B_50_150M: "B_50_150M",
//   B_150_300M: "B_150_300M",
//   GT_300M: "GT_300M",
//   UNKNOWN: "UNKNOWN",
// } as const;
// export type BudgetRange = (typeof BUDGET)[keyof typeof BUDGET];

// export const LEAD_STATUS = {
//   NEW: "NEW",
//   CONTACTED: "CONTACTED",
//   QUALIFIED: "QUALIFIED",
//   WON: "WON",
//   LOST: "LOST",
//   SPAM: "SPAM",
//   ARCHIVED: "ARCHIVED",
// } as const;
// export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

// export const LEAD_CHANNEL = {
//   WEBSITE: "WEBSITE",
//   LANDINGPAGE: "LANDINGPAGE",
//   PHONE: "PHONE",
//   EMAIL: "EMAIL",
//   CHAT: "CHAT",
//   OTHER: "OTHER",
// } as const;
// export type LeadChannel = (typeof LEAD_CHANNEL)[keyof typeof LEAD_CHANNEL];

// /* ===================== Types ===================== */
// export type Lead = {
//   id: string;
//   name: string;
//   phone: string;
//   email?: string | null;
//   url?: string | null;
//   service?: ServiceType | null;
//   serviceText?: string | null;
//   budget?: BudgetRange | null;
//   note?: string | null;
//   consent: boolean;
//   status: LeadStatus;
//   channel: LeadChannel;
//   assignedToId?: string | null;

//   utmSource?: string | null;
//   utmMedium?: string | null;
//   utmCampaign?: string | null;
//   utmTerm?: string | null;
//   utmContent?: string | null;
//   referrer?: string | null;
//   pagePath?: string | null;
//   ip?: string | null;
//   userAgent?: string | null;

//   createdAt: string; // ISO
//   updatedAt: string; // ISO
// };

// type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

// const API = process.env.NEXT_PUBLIC_API_URL!;
// if (!API) console.warn("⚠️ NEXT_PUBLIC_API_URL chưa được cấu hình");

// /* ===================== UI maps ===================== */
// const statusLabel: Record<LeadStatus, string> = {
//   NEW: "Chờ xử lý",
//   CONTACTED: "Đang xử lý",
//   QUALIFIED: "Đang xử lý",
//   WON: "Hoàn thành",
//   LOST: "Hủy bỏ",
//   SPAM: "Spam",
//   ARCHIVED: "Đã lưu trữ",
// };
// const statusChoices: { value: LeadStatus; text: string }[] = [
//   { value: "NEW", text: "Chờ xử lý" },
//   { value: "CONTACTED", text: "Đang xử lý" },
//   { value: "QUALIFIED", text: "Đang xử lý (Qualified)" },
//   { value: "WON", text: "Hoàn thành" },
//   { value: "LOST", text: "Hủy bỏ" },
//   { value: "SPAM", text: "Spam" },
//   { value: "ARCHIVED", text: "Lưu trữ (Xóa)" },
// ];
// const budgetLabel: Record<string, string> = {
//   LT_50M: "< 50tr/tháng",
//   B_50_150M: "50–150tr/tháng",
//   B_150_300M: "150–300tr/tháng",
//   GT_300M: "> 300tr/tháng",
//   UNKNOWN: "Không rõ",
// };

// /* ===================== Helpers ===================== */
// const fmt = (d?: string | null) =>
//   d ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d)) : "";

// const phoneMask = (s?: string | null) => (s ? s.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3") : "");

// const cls = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

// /* ===================== API layer ===================== */
// // Chuẩn hoá nhiều kiểu response khác nhau
// function readItems<T = any>(j: any): T[] {
//   return (j?.items ?? j?.data ?? j?.rows ?? j?.results ?? []) as T[];
// }
// function readMeta(j: any, fallback: { page: number; limit: number }) {
//   const meta = j?.meta ?? {};
//   const total = Number(j?.total ?? meta?.total ?? 0);
//   const page = Number(j?.page ?? meta?.page ?? fallback.page);
//   const limit = Number(j?.limit ?? meta?.limit ?? j?.pageSize ?? fallback.limit);
//   return { total, page, limit };
// }

// // 3 kiểu phân trang: (page,limit) | (page(0-based),pageSize) | (skip,take)
// async function fetchLeads(
//   page: number,
//   limit: number,
//   q: string,
//   status?: LeadStatus | "ALL",
// ): Promise<Paginated<Lead>> {
//   const qStr = (s: string) => (s ? `&q=${encodeURIComponent(s)}` : "");
//   const stStr = status && status !== "ALL" ? `&status=${status}` : "";

//   // A) page (1-based) + limit
//   let url = `${API}/leads?page=${page}&limit=${limit}${qStr(q)}${stStr}`;
//   let r = await fetch(url, { cache: "no-store", credentials: "include" });
//   let j = await r.json().catch(() => ({}));
//   let items = readItems<Lead>(j);
//   let meta = readMeta(j, { page, limit });
//   if (items.length || (j?.total ?? j?.meta?.total ?? 0) === 0) {
//     return { items, total: meta.total, page: meta.page, limit: meta.limit };
//   }

//   // B) pageIndex (0-based) + pageSize
//   url = `${API}/leads?page=${Math.max(0, page - 1)}&pageSize=${limit}${qStr(q)}${stStr}`;
//   r = await fetch(url, { cache: "no-store", credentials: "include" });
//   j = await r.json().catch(() => ({}));
//   items = readItems<Lead>(j);
//   meta = readMeta(j, { page, limit });
//   if (items.length) {
//     return { items, total: meta.total, page, limit: meta.limit };
//   }

//   // C) skip/take
//   const skip = (page - 1) * limit;
//   url = `${API}/leads?skip=${skip}&take=${limit}${qStr(q)}${stStr}`;
//   r = await fetch(url, { cache: "no-store", credentials: "include" });
//   j = await r.json().catch(() => ({}));
//   items = readItems<Lead>(j);
//   meta = readMeta(j, { page, limit });
//   return { items, total: meta.total, page, limit: meta.limit };
// }

// async function updateLeadStatus(id: string, status: LeadStatus) {
//   // Ưu tiên /leads/:id, fallback /leads/:id/status
//   let r = await fetch(`${API}/leads/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ status }),
//   });
//   if (r.status === 404 || r.status === 405) {
//     r = await fetch(`${API}/leads/${id}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ status }),
//     });
//   }
//   if (!r.ok) throw new Error(await r.text());
// }

// /* ===================== Page ===================== */
// export default function LeadsPage() {
//   const [q, setQ] = React.useState("");
//   const [status, setStatus] = React.useState<LeadStatus | "ALL">("ALL");
//   const [page, setPage] = React.useState(1);
//   const [limit, setLimit] = React.useState(10);
//   const [loading, setLoading] = React.useState(true);
//   const [data, setData] = React.useState<Paginated<Lead>>({
//     items: [],
//     total: 0,
//     page: 1,
//     limit: 10,
//   });
//   const [detail, setDetail] = React.useState<Lead | null>(null);

//   // debounce tìm kiếm
//   const [qDebounced, setQDebounced] = React.useState(q);
//   React.useEffect(() => {
//     const t = setTimeout(() => setQDebounced(q), 350);
//     return () => clearTimeout(t);
//   }, [q]);

//   React.useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const d = await fetchLeads(page, limit, qDebounced, status);
//         if (alive) setData(d);
//       } catch (e: any) {
//         toast.error(e?.message || "Không tải được danh sách leads");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [page, limit, qDebounced, status]);

//   const onChangeStatus = async (id: string, next: LeadStatus) => {
//     try {
//       await updateLeadStatus(id, next);
//       setData((d) => ({
//         ...d,
//         items: d.items.map((x) => (x.id === id ? { ...x, status: next } : x)),
//       }));
//       toast.success("Đã cập nhật trạng thái");
//     } catch (e: any) {
//       toast.error(e?.message || "Cập nhật trạng thái thất bại");
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

//   return (
//     <div className="min-h-screen bg-white text-zinc-900">
//       <div className="px-4 py-6 mx-auto max-w-7xl">
//         {/* Filters */}
//         <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-zinc-500" />
//               <input
//                 value={q}
//                 onChange={(e) => {
//                   setPage(1);
//                   setQ(e.target.value);
//                 }}
//                 placeholder="Tìm theo tên, SĐT, email, url…"
//                 className="h-10 w-[280px] rounded-xl border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
//               />
//             </div>
//             <select
//               value={status}
//               onChange={(e) => {
//                 setPage(1);
//                 setStatus(e.target.value as any);
//               }}
//               className="h-10 px-3 text-sm bg-white border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
//             >
//               <option value="ALL">Tất cả trạng thái</option>
//               {statusChoices.map((s) => (
//                 <option key={s.value} value={s.value}>
//                   {s.text}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={limit}
//               onChange={(e) => {
//                 setPage(1);
//                 setLimit(Number(e.target.value));
//               }}
//               className="h-10 px-3 text-sm bg-white border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
//             >
//               {[10, 20, 50].map((n) => (
//                 <option key={n} value={n}>
//                   {n}/trang
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="text-sm text-zinc-600">
//             Tổng: <b>{data.total}</b> lead · Trang {page}/{totalPages}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden border rounded-2xl">
//           <table className="min-w-full border-separate border-spacing-0">
//             <thead className="bg-zinc-50">
//               <tr className="text-xs tracking-wide text-left uppercase text-zinc-500">
//                 <th className="px-4 py-3">Thời gian</th>
//                 <th className="px-4 py-3">Khách hàng</th>
//                 <th className="px-4 py-3">Liên hệ</th>
//                 <th className="px-4 py-3">Dịch vụ</th>
//                 <th className="px-4 py-3">Ngân sách</th>
//                 <th className="px-4 py-3">Kênh</th>
//                 <th className="px-4 py-3">Trạng thái</th>
//                 <th className="px-4 py-3 text-right">Chi tiết</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="py-10 text-center text-zinc-500">
//                     <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
//                     Đang tải…
//                   </td>
//                 </tr>
//               ) : data.items.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="py-10 text-center text-zinc-500">
//                     Không có dữ liệu
//                   </td>
//                 </tr>
//               ) : (
//                 data.items.map((l) => (
//                   <tr key={l.id} className="border-t hover:bg-zinc-50">
//                     <td className="px-4 py-3 text-sm">{fmt(l.createdAt)}</td>
//                     <td className="px-4 py-3">
//                       <div className="text-sm font-medium">{l.name}</div>
//                       {l.note && <div className="text-xs line-clamp-1 text-zinc-500">{l.note}</div>}
//                     </td>
//                     <td className="px-4 py-3 text-sm">
//                       <div>{phoneMask(l.phone)}</div>
//                       {l.email && <div className="text-xs text-zinc-500">{l.email}</div>}
//                     </td>
//                     <td className="px-4 py-3 text-sm">
//                       <div className="font-medium">{serviceText(l)}</div>
//                       {l.service === "OTHER" && l.serviceText && (
//                         <div className="text-xs text-zinc-500 line-clamp-1">{l.serviceText}</div>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-sm">{budgetLabel[l.budget || "UNKNOWN"]}</td>
//                     <td className="px-4 py-3 text-xs">
//                       <span className="px-2 py-1 rounded-full bg-zinc-100">{l.channel}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <StatusBadge status={l.status} />
//                         <select
//                           value={l.status}
//                           onChange={(e) => onChangeStatus(l.id, e.target.value as LeadStatus)}
//                           className="h-8 px-2 text-xs bg-white border rounded-lg outline-none focus:ring-2 focus:ring-zinc-200"
//                           title="Đổi trạng thái"
//                         >
//                           {statusChoices.map((s) => (
//                             <option key={s.value} value={s.value}>
//                               {s.text}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <button
//                         onClick={() => setDetail(l)}
//                         className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-zinc-50"
//                         title="Xem chi tiết"
//                       >
//                         <Eye className="w-4 h-4" />
//                         Xem
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-4">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="inline-flex items-center gap-1 px-3 text-sm border h-9 rounded-xl disabled:opacity-50"
//             >
//               <ChevronLeft className="w-4 h-4" /> Trước
//             </button>
//             <div className="text-sm text-zinc-700">
//               Trang <b>{page}</b> / {totalPages}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="inline-flex items-center gap-1 px-3 text-sm border h-9 rounded-xl disabled:opacity-50"
//             >
//               Sau
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Detail Drawer */}
//       {detail && (
//         <div className="fixed inset-0 z-50">
//           <div className="absolute inset-0 bg-black/30" onClick={() => setDetail(null)} />
//           <aside className="absolute top-0 right-0 w-full h-full max-w-xl overflow-y-auto bg-white shadow-2xl">
//             <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b bg-white/80 backdrop-blur">
//               <div>
//                 <div className="text-xs uppercase text-zinc-500">Chi tiết lead</div>
//                 <div className="text-lg font-semibold">{detail.name}</div>
//               </div>
//               <button onClick={() => setDetail(null)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50">
//                 Đóng
//               </button>
//             </div>

//             <div className="p-5 space-y-4">
//               <KV k="Thời gian" v={fmt(detail.createdAt)} />
//               <KV k="SĐT" v={detail.phone} />
//               <KV k="Email" v={detail.email} />
//               <KV k="Website/Fanpage" v={detail.url} />
//               <KV k="Dịch vụ" v={serviceText(detail)} />
//               {detail.service === "OTHER" && <KV k="Mô tả dịch vụ" v={detail.serviceText} />}
//               <KV k="Ngân sách" v={budgetLabel[detail.budget || "UNKNOWN"]} />
//               <KV k="Kênh" v={detail.channel} />
//               <KV k="Trạng thái" v={statusLabel[detail.status]} />
//               <KV k="Ghi chú" v={detail.note} mono={false} />
//               <hr />
//               <div className="grid grid-cols-2 gap-3">
//                 <KV k="UTM Source" v={detail.utmSource} />
//                 <KV k="UTM Medium" v={detail.utmMedium} />
//                 <KV k="UTM Campaign" v={detail.utmCampaign} />
//                 <KV k="UTM Term" v={detail.utmTerm} />
//                 <KV k="UTM Content" v={detail.utmContent} />
//                 <KV k="Referrer" v={detail.referrer} />
//                 <KV k="Page Path" v={detail.pagePath} />
//                 <KV k="IP" v={detail.ip} />
//                 <KV k="User Agent" v={detail.userAgent} mono />
//               </div>
//             </div>
//           </aside>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===================== UI pieces ===================== */
// function StatusBadge({ status }: { status: LeadStatus }) {
//   const map: Record<LeadStatus, string> = {
//     NEW: "bg-amber-100 text-amber-800",
//     CONTACTED: "bg-blue-100 text-blue-800",
//     QUALIFIED: "bg-indigo-100 text-indigo-800",
//     WON: "bg-emerald-100 text-emerald-800",
//     LOST: "bg-rose-100 text-rose-800",
//     SPAM: "bg-zinc-200 text-zinc-800",
//     ARCHIVED: "bg-zinc-100 text-zinc-600",
//   };
//   return <span className={cls("inline-flex rounded-full px-2 py-0.5 text-xs", map[status])}>{statusLabel[status]}</span>;
// }

// function KV({ k, v, mono }: { k: string; v?: string | null; mono?: boolean }) {
//   return (
//     <div>
//       <div className="text-xs uppercase text-zinc-500">{k}</div>
//       <div className={cls("text-sm", mono && "font-mono break-all")}>{v || "—"}</div>
//     </div>
//   );
// }

// function serviceText(l: Pick<Lead, "service" | "serviceText">) {
//   switch (l.service) {
//     case "SEO":
//       return "SEO";
//     case "GOOGLE_ADS":
//       return "Google Ads";
//     case "FACEBOOK_INSTAGRAM_ADS":
//       return "Facebook/Instagram Ads";
//     case "TIKTOK_ADS":
//       return "TikTok Ads";
//     case "LANDING_TRACKING":
//       return "Landing Page & Tracking";
//     case "OTHER":
//       return "Khác";
//     default:
//       return "—";
//   }
// }























"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronLeft, Search, Eye, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";

/* ===== Enums / Types ===== */
export const SERVICE = {
  SEO: "SEO",
  GOOGLE_ADS: "GOOGLE_ADS",
  FACEBOOK_INSTAGRAM_ADS: "FACEBOOK_INSTAGRAM_ADS",
  TIKTOK_ADS: "TIKTOK_ADS",
  LANDING_TRACKING: "LANDING_TRACKING",
  OTHER: "OTHER",
} as const;
export type ServiceType = (typeof SERVICE)[keyof typeof SERVICE];

export const BUDGET = {
  LT_50M: "LT_50M",
  B_50_150M: "B_50_150M",
  B_150_300M: "B_150_300M",
  GT_300M: "GT_300M",
  UNKNOWN: "UNKNOWN",
} as const;
export type BudgetRange = (typeof BUDGET)[keyof typeof BUDGET];

export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  WON: "WON",
  LOST: "LOST",
  SPAM: "SPAM",
  ARCHIVED: "ARCHIVED",
} as const;
export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const LEAD_CHANNEL = {
  WEBSITE: "WEBSITE",
  LANDINGPAGE: "LANDINGPAGE",
  PHONE: "PHONE",
  EMAIL: "EMAIL",
  CHAT: "CHAT",
  OTHER: "OTHER",
} as const;
export type LeadChannel = (typeof LEAD_CHANNEL)[keyof typeof LEAD_CHANNEL];

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  url?: string | null;
  service?: ServiceType | null;
  serviceText?: string | null;
  budget?: BudgetRange | null;
  note?: string | null;
  consent: boolean;
  status: LeadStatus;
  channel: LeadChannel;
  assignedToId?: string | null;

  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  pagePath?: string | null;
  ip?: string | null;
  userAgent?: string | null;

  createdAt: string;
  updatedAt: string;
};

type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

const API = process.env.NEXT_PUBLIC_API_URL!;

/* ===== UI maps ===== */
const statusLabel: Record<LeadStatus, string> = {
  NEW: "Chờ xử lý",
  CONTACTED: "Đang xử lý",
  QUALIFIED: "Đã qualify",
  WON: "Hoàn thành",
  LOST: "Hủy bỏ",
  SPAM: "Spam",
  ARCHIVED: "Lưu trữ",
};
const statusChoices: { value: LeadStatus; text: string }[] = [
  { value: "NEW", text: statusLabel.NEW },
  { value: "CONTACTED", text: statusLabel.CONTACTED },
  { value: "QUALIFIED", text: statusLabel.QUALIFIED },
  { value: "WON", text: statusLabel.WON },
  { value: "LOST", text: statusLabel.LOST },
  { value: "SPAM", text: statusLabel.SPAM },
  { value: "ARCHIVED", text: statusLabel.ARCHIVED },
];
const budgetLabel: Record<string, string> = {
  LT_50M: "< 50tr/tháng",
  B_50_150M: "50–150tr/tháng",
  B_150_300M: "150–300tr/tháng",
  GT_300M: "> 300tr/tháng",
  UNKNOWN: "Không rõ",
};

/* ===== Helpers ===== */
const fmt = (d?: string | null) =>
  d ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d)) : "";
const phoneMask = (s?: string | null) => (s ? s.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3") : "");
const cls = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");
const serviceText = (l: Pick<Lead, "service" | "serviceText">) => {
  switch (l.service) {
    case "SEO":
      return "SEO";
    case "GOOGLE_ADS":
      return "Google Ads";
    case "FACEBOOK_INSTAGRAM_ADS":
      return "Facebook/Instagram Ads";
    case "TIKTOK_ADS":
      return "TikTok Ads";
    case "LANDING_TRACKING":
      return "Landing Page & Tracking";
    case "OTHER":
      return l.serviceText ? `Khác · ${l.serviceText}` : "Khác";
    default:
      return "—";
  }
};

/* ===== API ===== */
function readItems<T = any>(j: any): T[] {
  return (j?.items ?? j?.data ?? j?.rows ?? j?.results ?? []) as T[];
}
function readMeta(j: any, fallback: { page: number; limit: number }) {
  const meta = j?.meta ?? {};
  const total = Number(j?.total ?? meta?.total ?? 0);
  const page = Number(j?.page ?? meta?.page ?? fallback.page);
  const limit = Number(j?.limit ?? meta?.limit ?? j?.pageSize ?? fallback.limit);
  return { total, page, limit };
}

async function fetchLeads(
  page: number,
  limit: number,
  q: string,
  status?: LeadStatus | "ALL",
): Promise<Paginated<Lead>> {
  const qStr = (s: string) => (s ? `&q=${encodeURIComponent(s)}` : "");
  const stStr = status && status !== "ALL" ? `&status=${status}` : "";

  // A) page + limit
  let url = `${API}/leads?page=${page}&limit=${limit}${qStr(q)}${stStr}`;
  let r = await fetch(url, { cache: "no-store", credentials: "include" });
  let j = await r.json().catch(() => ({}));
  let items = readItems<Lead>(j);
  let meta = readMeta(j, { page, limit });
  if (items.length || (j?.total ?? j?.meta?.total ?? 0) === 0)
    return { items, total: meta.total, page: meta.page, limit: meta.limit };

  // B) pageIndex + pageSize
  url = `${API}/leads?page=${Math.max(0, page - 1)}&pageSize=${limit}${qStr(q)}${stStr}`;
  r = await fetch(url, { cache: "no-store", credentials: "include" });
  j = await r.json().catch(() => ({}));
  items = readItems<Lead>(j);
  meta = readMeta(j, { page, limit });
  if (items.length) return { items, total: meta.total, page, limit: meta.limit };

  // C) skip/take
  const skip = (page - 1) * limit;
  url = `${API}/leads?skip=${skip}&take=${limit}${qStr(q)}${stStr}`;
  r = await fetch(url, { cache: "no-store", credentials: "include" });
  j = await r.json().catch(() => ({}));
  items = readItems<Lead>(j);
  meta = readMeta(j, { page, limit });
  return { items, total: meta.total, page, limit: meta.limit };
}

async function updateLeadStatus(id: string, status: LeadStatus) {
  let r = await fetch(`${API}/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (r.status === 404 || r.status === 405) {
    r = await fetch(`${API}/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
  }
  if (!r.ok) throw new Error(await r.text());
}

async function deleteLead(id: string) {
  let r = await fetch(`${API}/leads/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (r.status === 404 || r.status === 405) {
    r = await fetch(`${API}/leads/${id}/delete`, {
      method: "POST",
      credentials: "include",
    });
  }
  if (!r.ok) throw new Error(await r.text());
}

/* ===== Page ===== */
export default function LeadsPage() {
  const router = useRouter();

  // --- sidebar collapsed ---
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(localStorage.getItem("admin.sidebar.collapsed") === "1");
    }
  }, []);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((s) => {
      const nx = !s;
      if (typeof window !== "undefined") {
        localStorage.setItem("admin.sidebar.collapsed", nx ? "1" : "0");
      }
      return nx;
    });
  }, []);

  // --- list state ---
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Paginated<Lead>>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [detail, setDetail] = React.useState<Lead | null>(null);

  // confirm delete
  const [toDelete, setToDelete] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // debounce search
  const [qDebounced, setQDebounced] = React.useState(q);
  React.useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const d = await fetchLeads(page, limit, qDebounced, status);
        if (alive) setData(d);
      } catch (e: any) {
        toast.error(e?.message || "Không tải được danh sách leads");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, limit, qDebounced, status]);

  const onChangeStatus = async (id: string, next: LeadStatus) => {
    try {
      await updateLeadStatus(id, next);
      setData((d) => ({
        ...d,
        items: d.items.map((x) => (x.id === id ? { ...x, status: next } : x)),
      }));
      toast.success("Đã cập nhật trạng thái");
    } catch (e: any) {
      toast.error(e?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  // perform delete
  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await deleteLead(toDelete.id);
      setData((d) => ({ ...d, items: d.items.filter((x) => x.id !== toDelete.id), total: Math.max(0, d.total - 1) }));
      toast.success("Đã xóa lead");
      setToDelete(null);
    } catch (e: any) {
      toast.error(e?.message || "Xóa lead thất bại");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 mx-auto h-14 max-w-7xl">
          <h1 className="text-lg font-semibold tracking-tight">Admin · Leads</h1>
          <LogoutButton />
        </div>
      </div>

      {/* Body with Sidebar (responsive width by collapsed) */}
      <div className="grid grid-cols-12 gap-6 px-4 py-6 mx-auto max-w-7xl">
        <aside className={collapsed ? "col-span-12 md:col-span-1" : "col-span-12 md:col-span-3"}>
          <AdminSidebar
            active={"leads" as any}
            onGoPosts={() => router.push("/admin")}
            onAddPost={() => router.push("/admin/ai-writer")}
            onGoUsers={() => router.push("/admin")}
            onAddSupport={() => router.push("/admin")}
            {...({
              onGoLeads: () => router.push("/admin/leads"),
              onAddLead: () => router.push("/admin/leads"),
              collapsed,
              onToggleCollapsed: toggleCollapsed,
            } as any)}
          />
        </aside>

        <main className={collapsed ? "col-span-12 md:col-span-11 space-y-4" : "col-span-12 md:col-span-9 space-y-4"}>
          {/* Filters Card */}
          <div className="p-4 bg-white border shadow-sm rounded-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-zinc-400" />
                  <input
                    value={q}
                    onChange={(e) => {
                      setPage(1);
                      setQ(e.target.value);
                    }}
                    placeholder="Tìm theo tên, SĐT, email, URL…"
                    className="h-11 w-[300px] rounded-xl border bg-white pl-12 pr-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                <div className="hidden w-px h-6 mx-2 sm:block bg-zinc-200" />

                <div className="flex gap-1 overflow-x-auto">
                  {[
                    { k: "ALL", label: "Tất cả" },
                    { k: "NEW", label: statusLabel.NEW },
                    { k: "CONTACTED", label: statusLabel.CONTACTED },
                    { k: "QUALIFIED", label: statusLabel.QUALIFIED },
                    { k: "WON", label: statusLabel.WON },
                    { k: "ARCHIVED", label: statusLabel.ARCHIVED },
                    { k: "SPAM", label: statusLabel.SPAM },
                    { k: "LOST", label: statusLabel.LOST },
                  ].map((t) => (
                    <button
                      key={t.k}
                      onClick={() => {
                        setStatus(t.k as any);
                        setPage(1);
                      }}
                      className={cls(
                        "h-9 rounded-full px-3 text-xs border",
                        status === (t.k as any)
                          ? "bg-black text-white border-black"
                          : "bg-white hover:bg-zinc-50"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="h-10 px-3 text-sm bg-white border outline-none rounded-xl focus:ring-2 focus:ring-zinc-200"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}/trang
                    </option>
                  ))}
                </select>
                <div className="text-sm text-zinc-600">
                  Tổng: <b>{data.total}</b> · Trang {page}/{Math.max(1, Math.ceil(data.total / data.limit))}
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white border shadow-sm rounded-2xl">
            <div className="max-h-[68vh] overflow-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur">
                  <tr className="text-[11px] uppercase tracking-wide text-zinc-500">
                    <th className="w-40 px-4 py-3 text-left">Thời gian</th>
                    {/* Khách hàng rộng hơn + font to hơn */}
                    <th className="px-4 py-3 text-left min-w-[280px] w-[320px]">Khách hàng</th>
                    <th className="px-4 py-3 text-left w-[260px]">Liên hệ</th>
                    <th className="px-4 py-3 text-left w-[220px]">Dịch vụ</th>
                    <th className="w-40 px-4 py-3 text-left">Ngân sách</th>
                    <th className="px-4 py-3 text-left w-36">Kênh</th>
                    <th className="px-4 py-3 text-left w-[220px]">Trạng thái</th>
                    <th className="px-4 py-3 text-right w-36">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500">
                        <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                        Đang tải…
                      </td>
                    </tr>
                  ) : data.items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    data.items.map((l, idx) => (
                      <tr key={l.id} className={cls("border-t", idx % 2 ? "bg-zinc-50/40" : "bg-white")}>
                        <td className="px-4 py-3 text-sm text-zinc-700">{fmt(l.createdAt)}</td>

                        <td className="px-4 py-3">
                          <div className="text-[15px] md:text-base font-semibold leading-5 line-clamp-2">
                            {l.name}
                          </div>
                          {l.note && <div className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{l.note}</div>}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-col">
                            <a className="text-zinc-800 hover:underline" href={`tel:${l.phone}`}>{phoneMask(l.phone)}</a>
                            {l.email && (
                              <a className="text-xs text-blue-600 hover:underline" href={`mailto:${l.email}`}>
                                {l.email}
                              </a>
                            )}
                            {l.url && (
                              <a className="text-xs text-zinc-500 hover:underline" href={l.url} target="_blank">
                                {l.url}
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{serviceText(l)}</div>
                        </td>

                        <td className="px-4 py-3 text-sm">{budgetLabel[l.budget || "UNKNOWN"]}</td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs">
                            {l.channel}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={l.status} />
                            <select
                              value={l.status}
                              onChange={(e) => onChangeStatus(l.id, e.target.value as LeadStatus)}
                              className="h-8 px-2 text-xs bg-white border rounded-lg outline-none focus:ring-2 focus:ring-zinc-200"
                              title="Đổi trạng thái"
                            >
                              {statusChoices.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.text}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setDetail(l)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-zinc-50"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                              Xem
                            </button>
                            <button
                              onClick={() => setToDelete(l)}
                              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                              title="Xóa lead"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 text-sm border h-9 rounded-xl disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <div className="text-sm text-zinc-700">
                Trang <b>{page}</b> / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 text-sm border h-9 rounded-xl disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Drawer */}
      {detail && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetail(null)} />
          <aside className="absolute top-0 right-0 w-full h-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b bg-white/80 backdrop-blur">
              <div>
                <div className="text-xs uppercase text-zinc-500">Chi tiết lead</div>
                <div className="text-lg font-semibold">{detail.name}</div>
              </div>
              <button onClick={() => setDetail(null)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50">
                Đóng
              </button>
            </div>

            <div className="p-5 space-y-4">
              <KV k="Thời gian" v={fmt(detail.createdAt)} />
              <KV k="SĐT" v={detail.phone} />
              <KV k="Email" v={detail.email} />
              <KV k="Website/Fanpage" v={detail.url} />
              <KV k="Dịch vụ" v={serviceText(detail)} />
              {detail.service === "OTHER" && <KV k="Mô tả dịch vụ" v={detail.serviceText} />}
              <KV k="Ngân sách" v={budgetLabel[detail.budget || "UNKNOWN"]} />
              <KV k="Kênh" v={detail.channel} />
              <KV k="Trạng thái" v={statusLabel[detail.status]} />
              <KV k="Ghi chú" v={detail.note} mono={false} />
              <hr />
              <div className="grid grid-cols-2 gap-3">
                <KV k="UTM Source" v={detail.utmSource} />
                <KV k="UTM Medium" v={detail.utmMedium} />
                <KV k="UTM Campaign" v={detail.utmCampaign} />
                <KV k="UTM Term" v={detail.utmTerm} />
                <KV k="UTM Content" v={detail.utmContent} />
                <KV k="Referrer" v={detail.referrer} />
                <KV k="Page Path" v={detail.pagePath} />
                <KV k="IP" v={detail.ip} />
                <KV k="User Agent" v={detail.userAgent} mono />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Confirm Delete Popup */}
      {toDelete && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => !deleting && setToDelete(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border shadow-xl rounded-2xl">
              <div className="px-5 pt-5">
                <div className="text-base font-semibold">Xóa lead?</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Bạn chắc chắn muốn xóa lead <b>{toDelete.name}</b>? Hành động này không thể hoàn tác.
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4">
                <button
                  disabled={deleting}
                  onClick={() => setToDelete(null)}
                  className="h-10 px-3 text-sm border rounded-xl hover:bg-zinc-50 disabled:opacity-60"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="inline-flex items-center h-10 gap-2 px-3 text-sm text-white rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== UI pieces ===== */
function StatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    NEW: "bg-amber-100 text-amber-800",
    CONTACTED: "bg-blue-100 text-blue-800",
    QUALIFIED: "bg-indigo-100 text-indigo-800",
    WON: "bg-emerald-100 text-emerald-800",
    LOST: "bg-rose-100 text-rose-800",
    SPAM: "bg-zinc-200 text-zinc-800",
    ARCHIVED: "bg-zinc-100 text-zinc-600",
  };
  return <span className={cls("inline-flex rounded-full px-2 py-0.5 text-xs", map[status])}>{statusLabel[status]}</span>;
}

function KV({ k, v, mono }: { k: string; v?: string | null; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase text-zinc-500">{k}</div>
      <div className={cls("text-sm", mono && "font-mono break-all")}>{v || "—"}</div>
    </div>
  );
}
