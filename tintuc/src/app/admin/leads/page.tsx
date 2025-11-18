// src/app/admin/leads/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronLeft, Search, Eye, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";

/* ===== Status / Channel ===== */
// Cập nhật khớp 100% với Database ENUM
export const LEAD_STATUS = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS", // Mới thêm
  CONTACTED: "CONTACTED",     // Mới thêm
  WON: "WON",
  LOST: "LOST",
  SPAM: "SPAM",
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

/* ===== Lead type ===== */
export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  url?: string | null;
  service?: string | null;
  serviceText?: string | null;
  budget?: string | null;
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

/* ===== Labels / Normalizers ===== */
// Cập nhật Label tiếng Việt chuẩn
const statusLabel: Record<LeadStatus, string> = {
  NEW: "Chờ xử lý",
  IN_PROGRESS: "Đang xử lý",
  CONTACTED: "Đã liên hệ",
  WON: "Hoàn thành",
  LOST: "Hủy bỏ",
  SPAM: "Spam",
};

const statusChoices: { value: LeadStatus; text: string }[] =
  (Object.keys(LEAD_STATUS) as LeadStatus[]).map(v => ({ value: v, text: statusLabel[v] }));

const getServiceLabel = (v?: string | null, serviceText?: string | null) => {
  const s = (v || "").toUpperCase();
  switch (s) {
    case "SEO": return "SEO";
    case "ADS":
    case "GOOGLE_ADS": return "Google Ads";
    case "WEB":
    case "WEBSITE": return "Website";
    case "BRANDING": return "Branding";
    case "SOCIAL":
    case "FACEBOOK_INSTAGRAM_ADS": return "Social Ads";
    case "TIKTOK_ADS": return "TikTok Ads";
    case "LANDING_TRACKING": return "Landing & Tracking";
    case "OTHER": return serviceText ? `Khác · ${serviceText}` : "Khác";
    default: return serviceText || "—";
  }
};

const getBudgetLabel = (v?: string | null) => {
  const s = (v || "").toUpperCase();
  if (s === "LT_10M") return "<10tr/tháng";
  if (s === "_10_30M" || s === "10_30" || s === "B_10_30M") return "10–30tr/tháng";
  if (s === "_30_100M" || s === "30_100M") return "30–100tr/tháng";
  if (s === "GT_100M") return ">100tr/tháng";
  if (s === "UNKNOWN" || !s) return "Không rõ";
  if (s === "LT_50M") return "<50tr/tháng";
  if (s === "B_50_150M") return "50–150tr/tháng";
  if (s === "B_150_300M") return "150–300tr/tháng";
  if (s === "GT_300M") return ">300tr/tháng";
  return "Không rõ";
};

/* ===== Helpers ===== */
const fmt = (d?: string | null) =>
  d ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d)) : "";
const phoneMask = (s?: string | null) => (s ? s.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3") : "");
const cls = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* ===== API ===== */
function readItems<T = any>(j: any): T[] { return (j?.items ?? j?.data ?? j?.rows ?? j?.results ?? []) as T[]; }
function readMeta(j: any, fallback: { page: number; limit: number }) {
  const meta = j?.meta ?? {};
  const total = Number(j?.total ?? meta?.total ?? 0);
  const page = Number(j?.page ?? meta?.page ?? fallback.page);
  const limit = Number(j?.limit ?? meta?.limit ?? j?.pageSize ?? fallback.limit);
  return { total, page, limit };
}

async function fetchLeads(page: number, limit: number, q: string, status?: LeadStatus | "ALL"): Promise<Paginated<Lead>> {
  const qStr = (s: string) => (s ? `&q=${encodeURIComponent(s)}` : "");
  const stStr = status && status !== "ALL" ? `&status=${status}` : "";
  
  let url = `${API}/leads?page=${page}&limit=${limit}${qStr(q)}${stStr}`;
  // Thêm cache: no-store để luôn lấy dữ liệu mới nhất
  let r = await fetch(url, { cache: "no-store", credentials: "include" });
  
  let j = await r.json().catch(() => ({}));
  let items = readItems<Lead>(j);
  let meta = readMeta(j, { page, limit });

  return { items, total: meta.total, page: meta.page, limit: meta.limit };
}

async function updateLeadStatus(id: string, status: LeadStatus) {
  // Thử endpoint chuẩn trước
  let r = await fetch(`${API}/leads/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!r.ok) throw new Error(await r.text());
}

async function deleteLead(id: string) {
  let r = await fetch(`${API}/leads/${id}`, { method: "DELETE", credentials: "include" });
  
  // Fallback cho endpoint custom nếu có
  if (r.status === 404 || r.status === 405) {
     r = await fetch(`${API}/leads/${id}/delete`, { method: "POST", credentials: "include" });
  }

  if (!r.ok && r.status !== 204) {
    throw new Error(`Xoá thất bại (HTTP ${r.status})`);
  }
}

/* ===== Page ===== */
export default function LeadsPage() {
  const router = useRouter();

  // Sidebar
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => { if (typeof window !== "undefined") setCollapsed(localStorage.getItem("admin.sidebar.collapsed") === "1"); }, []);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((s) => { const nx = !s; if (typeof window !== "undefined") localStorage.setItem("admin.sidebar.collapsed", nx ? "1" : "0"); return nx; });
  }, []);

  // List state
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Paginated<Lead>>({ items: [], total: 0, page: 1, limit: 10 });
  const [detail, setDetail] = React.useState<Lead | null>(null);

  // Delete state
  const [toDelete, setToDelete] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Debounce search
  const [qDebounced, setQDebounced] = React.useState(q);
  React.useEffect(() => { const t = setTimeout(() => setQDebounced(q), 350); return () => clearTimeout(t); }, [q]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try { 
        setLoading(true); 
        const d = await fetchLeads(page, limit, qDebounced, status); 
        if (alive) setData(d); 
      }
      catch (e: any) { 
        toast.error("Không tải được danh sách leads"); 
      }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [page, limit, qDebounced, status]);

  const onChangeStatus = async (id: string, next: LeadStatus) => {
    const oldItems = [...data.items];
    // Optimistic update (Cập nhật giao diện ngay lập tức)
    setData((d) => ({ ...d, items: d.items.map((x) => (x.id === id ? { ...x, status: next } : x)) }));

    try {
      await updateLeadStatus(id, next);
      toast.success("Đã cập nhật trạng thái");
    } catch (e: any) { 
      // Revert nếu lỗi
      setData((d) => ({ ...d, items: oldItems }));
      toast.error(e?.message || "Cập nhật trạng thái thất bại"); 
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="flex items-center justify-between px-4 mx-auto h-14 max-w-7xl">
          <h1 className="text-lg font-semibold tracking-tight">Admin · Leads</h1>
          <LogoutButton />
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-12 gap-6 px-4 py-6 mx-auto max-w-7xl">
        <aside className={collapsed ? "col-span-12 md:col-span-1" : "col-span-12 md:col-span-3"}>
          <AdminSidebar
            active={"leads" as any}
            onGoPosts={() => router.push("/admin")}
            onAddPost={() => router.push("/admin/ai-writer")}
            onGoUsers={() => router.push("/admin")}
            onAddSupport={() => router.push("/admin")}
            {...({ onGoLeads: () => router.push("/admin/leads"), onAddLead: () => router.push("/admin/leads"),
               collapsed, onToggleCollapsed: toggleCollapsed } as any)}
          />
        </aside>

        <main className={collapsed ? "col-span-12 md:col-span-11 space-y-5" : "col-span-12 md:col-span-9 space-y-5"}>
          {/* Filters */}
          <div className="p-4 bg-white/95 border shadow-sm rounded-2xl backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-zinc-400" />
                  <input
                    value={q}
                    onChange={(e) => { setPage(1); setQ(e.target.value); }}
                    placeholder="Tìm theo tên, SĐT, email…"
                    className="h-11 w-[280px] sm:w-[320px] rounded-xl border bg-white pl-12 pr-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                  {[
                    { k: "ALL", label: "Tất cả" },
                    { k: "NEW", label: statusLabel.NEW },
                    { k: "IN_PROGRESS", label: statusLabel.IN_PROGRESS },
                    { k: "CONTACTED", label: statusLabel.CONTACTED },
                    { k: "WON", label: statusLabel.WON },
                    { k: "LOST", label: statusLabel.LOST },
                    { k: "SPAM", label: statusLabel.SPAM },
                  ].map((t) => (
                    <button
                      key={t.k}
                      onClick={() => { setStatus(t.k as any); setPage(1); }}
                      className={cls(
                        "h-9 rounded-full px-3 text-xs border transition whitespace-nowrap",
                        status === (t.k as any)
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white hover:bg-zinc-50"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden bg-white/95 border shadow-sm rounded-2xl backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="max-h-[70vh] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-zinc-100/70 backdrop-blur text-[11px] uppercase tracking-wide text-zinc-600">
                    <th className="w-48 px-4 py-3 text-left">Thời gian</th>
                    <th className="px-4 py-3 text-left min-w-[200px]">Khách hàng</th>
                    <th className="px-4 py-3 text-left w-[200px]">Dịch vụ</th>
                    <th className="w-32 px-4 py-3 text-left">Ngân sách</th>
                    <th className="px-4 py-3 text-left w-[200px]">Trạng thái</th>
                    <th className="px-4 py-3 text-right w-28">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                        Đang tải…
                      </td>
                    </tr>
                  ) : data.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    data.items.map((l) => (
                      <tr key={l.id} className="transition-colors odd:bg-white even:bg-zinc-50/40 hover:bg-indigo-50/40">
                        <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                          {fmt(l.createdAt)}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-900">{l.name}</div>
                          <div className="flex flex-col mt-0.5">
                             <a className="text-xs text-blue-600 hover:underline w-fit" href={`tel:${l.phone}`}>{phoneMask(l.phone)}</a>
                             {l.email && <span className="text-[11px] text-zinc-500">{l.email}</span>}
                          </div>
                          {l.note && <div className="text-[11px] italic text-zinc-400 line-clamp-1 mt-1">Note: {l.note}</div>}
                        </td>

                        <td className="px-4 py-3">
                           <div className="font-medium">{getServiceLabel(l.service, l.serviceText)}</div>
                           <span className="inline-flex items-center rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 mt-1">
                            {l.channel}
                          </span>
                        </td>

                        <td className="px-4 py-3">{getBudgetLabel(l.budget)}</td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <StatusBadge status={l.status} />
                            <select
                              value={l.status}
                              onChange={(e) => onChangeStatus(l.id, e.target.value as LeadStatus)}
                              className="h-7 px-1 text-[11px] bg-white border rounded-md outline-none focus:ring-1 focus:ring-indigo-200 w-fit"
                            >
                              {statusChoices.map((s) => <option key={s.value} value={s.value}>{s.text}</option>)}
                            </select>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setDetail(l)} className="p-1.5 border rounded hover:bg-zinc-50" title="Xem"><Eye size={14}/></button>
                            <button onClick={() => setToDelete(l)} className="p-1.5 border rounded border-rose-100 text-rose-600 hover:bg-rose-50" title="Xóa"><Trash2 size={14}/></button>
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
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 px-3 text-sm bg-white border h-9 rounded-xl hover:bg-zinc-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <div className="text-sm text-zinc-700">Trang <b>{page}</b> / {totalPages}</div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 px-3 text-sm bg-white border h-9 rounded-xl hover:bg-zinc-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <aside className="relative w-full h-full max-w-xl bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white/95 backdrop-blur">
              <h2 className="text-lg font-bold">Chi tiết Lead</h2>
              <button onClick={() => setDetail(null)} className="p-2 rounded-full hover:bg-zinc-100"><ChevronLeft size={20}/></button>
            </div>
            <div className="p-6 space-y-8">
               <div className="flex items-center gap-4 p-4 border rounded-xl bg-zinc-50 border-zinc-100">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-zinc-900">{detail.name}</div>
                    <div className="text-sm text-zinc-500 mt-1">{fmt(detail.createdAt)}</div>
                  </div>
                  <StatusBadge status={detail.status} />
               </div>

               <div className="space-y-4">
                  <h3 className="font-semibold text-zinc-900 border-b pb-2">Thông tin liên hệ</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <KV k="SĐT" v={detail.phone} />
                    <KV k="Email" v={detail.email} />
                    <KV k="Website" v={detail.url} />
                    <KV k="Kênh" v={detail.channel} />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-semibold text-zinc-900 border-b pb-2">Nhu cầu</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <KV k="Dịch vụ" v={getServiceLabel(detail.service, detail.serviceText)} />
                    <KV k="Ngân sách" v={getBudgetLabel(detail.budget)} />
                  </div>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-zinc-500 mb-1">Ghi chú</div>
                    <div className="p-3 text-sm border rounded-lg bg-zinc-50 min-h-[60px]">{detail.note || "Không có ghi chú"}</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-semibold text-zinc-900 border-b pb-2">Tracking Data</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <KV k="Source" v={detail.utmSource} />
                    <KV k="Medium" v={detail.utmMedium} />
                    <KV k="Campaign" v={detail.utmCampaign} />
                    <KV k="Page Path" v={detail.pagePath} mono/>
                    <KV k="IP" v={detail.ip} mono />
                    <div className="col-span-2">
                       <KV k="User Agent" v={detail.userAgent} mono />
                    </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      )}

      {/* Confirm Delete */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !deleting && setToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold">Xóa lead này?</h3>
              <p className="text-sm text-zinc-500">
                Hành động này không thể hoàn tác. Lead <b>{toDelete.name}</b> sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setToDelete(null)}
                className="flex-1 h-10 text-sm font-medium bg-white border rounded-xl hover:bg-zinc-50 disabled:opacity-60"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteLead(toDelete.id);
                    setData((d) => ({ ...d, items: d.items.filter((x) => x.id !== toDelete.id), total: Math.max(0, d.total - 1) }));
                    toast.success("Đã xóa lead");
                    setToDelete(null);
                  } catch (e: any) {
                    toast.error(e?.message || "Xóa lead thất bại");
                  } finally { setDeleting(false); }
                }}
                disabled={deleting}
                className="flex-1 h-10 text-sm font-medium text-white rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== UI pieces (Cập nhật màu sắc mới) ===== */
function StatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    NEW: "bg-yellow-100 text-yellow-800 border border-yellow-200", // Chờ xử lý
    IN_PROGRESS: "bg-blue-100 text-blue-800 border border-blue-200", // Đang xử lý
    CONTACTED: "bg-purple-100 text-purple-800 border border-purple-200", // Đã liên hệ (Mới)
    WON: "bg-emerald-100 text-emerald-800 border border-emerald-200", // Hoàn thành
    LOST: "bg-rose-100 text-rose-800 border border-rose-200", // Hủy bỏ
    SPAM: "bg-zinc-100 text-zinc-600 border border-zinc-200", // Spam
  };
  return <span className={cls("inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", map[status])}>
    {statusLabel[status]}
  </span>;
}

function KV({ k, v, mono }: { k: string; v?: string | null; mono?: boolean }) {
  return (
    <div className="break-words">
      <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5">{k}</div>
      <div className={cls("text-sm text-zinc-800", mono && "font-mono text-xs text-zinc-600")}>{v || "—"}</div>
    </div>
  );
}