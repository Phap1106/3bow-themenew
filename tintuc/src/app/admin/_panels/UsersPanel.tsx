// src/app/admin/_panels/UsersPanel.tsx
"use client";
import * as React from "react";
import { Search, Pencil, Trash2, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import SupportForm from "@/components/admin/SupportForm";
import EditSupportForm from "./EditSupportForm";

// ⬇️ Dùng API chuẩn duy nhất
import {
  listSupport,
  createSupport,
  deleteSupport,
  kickSupport,
  updateSupport, // <— thêm import này
  type SupportUser, // <— dùng type từ usersApi để tránh lệch kiểu
} from "@/lib/usersApi";

const LIMIT = 10;

export type UsersPanelHandle = { openCreateSupport: () => void };

type SupportEditInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

export default React.forwardRef<UsersPanelHandle, {}>(function UsersPanel(
  _,
  ref
) {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<SupportUser[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(LIMIT);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showCreate, setShowCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<SupportUser | null>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      openCreateSupport: () => setShowCreate(true),
    }),
    []
  );

  async function load(p = 1, keyword = "") {
    setLoading(true);
    setError(null);
    try {
      const r = await listSupport(p, LIMIT, keyword); // (page, limit, q)
      setItems(r.items ?? []);
      setTotal(Number(r.total ?? 0));
      setPage(Number(r.page ?? p));
      setLimit(Number(r.limit ?? LIMIT));
    } catch (e: any) {
      setError(e?.message || "Load users failed");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load(1, "");
  }, []);

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-full max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên / email / SĐT…"
            className="w-full h-10 pl-10 pr-3 bg-white border shadow-sm rounded-xl border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
          />
          <Search
            className="absolute -translate-y-1/2 text-zinc-400 left-3 top-1/2"
            size={18}
          />
        </div>
        <button
          className="h-10 px-4 border shadow-sm rounded-xl border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
          onClick={() => load(1, q.trim())}
          disabled={loading}
        >
          Tìm
        </button>
        <button
          className="h-10 px-4 text-white bg-indigo-600 shadow-sm rounded-xl hover:bg-indigo-700"
          onClick={() => setShowCreate(true)}
        >
          + Thêm supportAdmin
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border shadow-sm rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
        {error && (
          <div className="p-4 text-sm text-red-600 break-all">{error}</div>
        )}
        {loading && <div className="p-4 text-sm text-zinc-500">Đang tải…</div>}
        {!loading && (
          <table className="min-w-full text-sm">
            <thead className="text-left border-b text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 w-[30%]">Người dùng</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">SĐT</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => {
                const fullName =
                  u.firstName || u.lastName
                    ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                    : u.name ?? "—";
                const phone = u.numberPhone ?? u.phone ?? "—";
                const status = u.session
                  ? "Đang hoạt động"
                  : u.kickedAt
                  ? "Đã kick"
                  : "—";

                return (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
                  >
                    <td className="px-4 py-3">{fullName}</td>
                    <td className="px-4 py-3">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">{phone}</td>
                    <td className="px-4 py-3">{status}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {/* Sửa */}
                        <button
                          className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                          title="Sửa"
                          onClick={() => setEditing(u)}
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Đăng xuất (revoke) */}
                        <button
                          className="p-2 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                          title="Đăng xuất user này"
                          onClick={async () => {
                            await kickSupport(u.id);
                            // chọn 1 trong 2 cách reload:
                            await load(page, q);
                            // router.refresh();
                          }}
                        >
                          <X size={16} />
                        </button>

                        {/* XÓA: kick trước rồi delete */}
                        <button
                          className="p-2 text-red-600 border rounded-lg border-zinc-200 hover:bg-red-50 dark:border-zinc-800"
                          title="Xoá"
                          onClick={async () => {
                            if (!confirm("Xoá user này?")) return;
                            try {
                              await kickSupport(u.id).catch(() => {}); // đá session ngay
                              await deleteSupport(u.id); // xoá tài khoản
                              // reload list (nếu trang hiện chỉ còn 1 item thì lùi trang)
                              const nextPage =
                                items.length === 1 && page > 1
                                  ? page - 1
                                  : page;
                              await load(nextPage, q);
                              // hoặc dùng: router.refresh();
                            } catch (e) {
                              alert("Xoá thất bại: " + String(e));
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!items.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    Không có supportAdmin
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pager */}
      <div className="mt-6">
        <Pagination
          page={page}
          total={total}
          limit={limit}
          loading={loading}
          onPageChange={(p) => load(p, q)}
        />
        <p className="mt-2 text-xs text-center text-zinc-500">
          Trang {page}/{Math.max(1, Math.ceil((total || 0) / (limit || 1)))} •{" "}
          {total} người
        </p>
      </div>

      {/* Modals */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Thêm supportAdmin"
        size="sm"
      >
        <SupportForm
          onCancel={() => setShowCreate(false)}
          onSubmit={async (d) => {
            await createSupport(d);
            setShowCreate(false);
            await load(1, q);
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Sửa Support Admin"
        size="sm"
      >
        {editing && (
          <EditSupportForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (d: SupportEditInput) => {
              await updateSupport(editing.id, d);
              setEditing(null);
              await load(page, q);
            }} // ⬅️ dùng updateSupport
          />
        )}
      </Modal>
    </>
  );
});
