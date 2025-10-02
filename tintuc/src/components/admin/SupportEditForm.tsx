"use client";
import * as React from "react";

export type SupportEditInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
};

export default function SupportEditForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: any;
  onCancel: () => void;
  onSubmit: (d: SupportEditInput) => Promise<void>;
}) {
  const [form, setForm] = React.useState<SupportEditInput>({
    firstName: initial.firstName || "",
    lastName: initial.lastName || "",
    phone: initial.phone || "",
    address: initial.address || "",
  });
  const [loading, setLoading] = React.useState(false);

  function set<K extends keyof SupportEditInput>(k: K, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <div className="mb-1 text-xs text-zinc-500">Email (không chỉnh sửa)</div>
        <input
          className="w-full h-10 px-3 border rounded-lg bg-zinc-100 dark:bg-zinc-800"
          value={initial.email}
          disabled
        />
      </div>
      <div className="flex gap-2">
        <input
          placeholder="First name"
          className="flex-1 h-10 px-3 border rounded-lg dark:bg-zinc-900"
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <input
          placeholder="Last name"
          className="flex-1 h-10 px-3 border rounded-lg dark:bg-zinc-900"
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
      </div>
      <input
        placeholder="Số điện thoại"
        className="w-full h-10 px-3 border rounded-lg dark:bg-zinc-900"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
      />
      <input
        placeholder="Địa chỉ"
        className="w-full h-10 px-3 border rounded-lg dark:bg-zinc-900"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="h-10 px-4 border rounded-lg"
          onClick={onCancel}
        >
          Huỷ
        </button>
        <button
          disabled={loading}
          type="submit"
          className="h-10 px-4 text-white bg-black rounded-lg"
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
