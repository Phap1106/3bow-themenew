"use client";
import * as React from "react";
import type { SupportInput } from "@/lib/usersApi";

export default function SupportForm({
  onSubmit, onCancel,
}: {
  onSubmit: (data: SupportInput) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = React.useState<SupportInput>({
    email: "", password: "", firstName: "", lastName: "",
    birthday: "", address: "", numberPhone: "",
  });
  const [saving, setSaving] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.email || !f.password || !f.firstName || !f.lastName) {
      alert("Điền đủ email, mật khẩu, họ, tên"); return;
    }
    setSaving(true);
    try { await onSubmit({ ...f, birthday: f.birthday || undefined }); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="w-[min(560px,calc(100vw-2rem))]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input className="w-full h-10 px-3 border rounded" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
        </div>
        <div>
          <label className="block mb-1 text-sm">Mật khẩu</label>
          <input type="password" className="w-full h-10 px-3 border rounded" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
        </div>
        <div>
          <label className="block mb-1 text-sm">Họ</label>
          <input className="w-full h-10 px-3 border rounded" value={f.lastName} onChange={e=>setF({...f,lastName:e.target.value})}/>
        </div>
        <div>
          <label className="block mb-1 text-sm">Tên</label>
          <input className="w-full h-10 px-3 border rounded" value={f.firstName} onChange={e=>setF({...f,firstName:e.target.value})}/>
        </div>
        <div>
          <label className="block mb-1 text-sm">SĐT</label>
          <input className="w-full h-10 px-3 border rounded" value={f.numberPhone} onChange={e=>setF({...f,numberPhone:e.target.value})}/>
        </div>
        <div>
          <label className="block mb-1 text-sm">Sinh nhật</label>
          <input type="date" className="w-full h-10 px-3 border rounded" value={f.birthday || ""} onChange={e=>setF({...f,birthday:e.target.value})}/>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">Địa chỉ</label>
          <input className="w-full h-10 px-3 border rounded" value={f.address} onChange={e=>setF({...f,address:e.target.value})}/>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="h-10 px-4 border rounded">Hủy</button>
        <button disabled={saving} className="h-10 px-4 text-white bg-black rounded disabled:opacity-60">
          {saving ? "Đang lưu…" : "Tạo supportAdmin"}
        </button>
      </div>
    </form>
  );
}
