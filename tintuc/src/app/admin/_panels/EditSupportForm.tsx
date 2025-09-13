"use client";
import * as React from "react";
import type { SupportUser } from "@/lib/usersApi"; // ✅ ĐÚNG NGUỒN TYPE

export type SupportEditInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

export default function EditSupportForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: SupportUser;
  onCancel: () => void;
  onSubmit: (d: SupportEditInput) => Promise<void>;
}) {
  const [f, setF] = React.useState<SupportEditInput>({
    firstName: initial.firstName ?? "",
    lastName: initial.lastName ?? "",
    phone: initial.phone ?? initial.numberPhone ?? "",
    address: initial.address ?? "",
  });
  const [loading, setLoading] = React.useState(false);

  // ✅ Gõ kiểu rõ ràng, không còn 'any'
  const set = <K extends keyof SupportEditInput>(k: K, v: SupportEditInput[K]) =>
    setF((s: SupportEditInput) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(f);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <div className="mb-1 text-xs text-zinc-500">Email (không chỉnh sửa)</div>
        <input
          disabled
          value={initial.email ?? ""}
          className="w-full h-10 px-3 border rounded-lg bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      <div className="flex gap-2">
        <input
          value={f.firstName ?? ""}
          onChange={(e) => set("firstName", e.target.value)}
          placeholder="First name"
          className="flex-1 h-10 px-3 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
        />
        <input
          value={f.lastName ?? ""}
          onChange={(e) => set("lastName", e.target.value)}
          placeholder="Last name"
          className="flex-1 h-10 px-3 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
        />
      </div>

      <input
        value={f.phone ?? ""}
        onChange={(e) => set("phone", e.target.value)}
        placeholder="Số điện thoại"
        className="w-full h-10 px-3 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
      />

      <input
        value={f.address ?? ""}
        onChange={(e) => set("address", e.target.value)}
        placeholder="Địa chỉ"
        className="w-full h-10 px-3 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="h-10 px-4 border rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
          onClick={onCancel}
        >
          Huỷ
        </button>
        <button
          disabled={loading}
          type="submit"
          className="h-10 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
