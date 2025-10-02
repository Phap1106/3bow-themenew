"use client";
import * as React from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import type { SupportInput } from "@/lib/usersApi";

export default function SupportForm({
  onSubmit, onCancel,
}: {
  onSubmit: (data: SupportInput) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = React.useState<SupportInput>({
    email: "", password: "", firstName: "", lastName: "",
    address: "", numberPhone: "", img: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.email || !f.password || !f.firstName || !f.lastName) {
      alert("Điền đủ email, mật khẩu, họ, tên"); return;
    }
    setSaving(true);
    try { await onSubmit(f); }
    finally { setSaving(false); }
  }

  return (
    <div className="w-[min(600px,calc(100vw-2rem))]">
      <form onSubmit={submit} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tạo tài khoản Support Admin</h3>
          <p className="text-sm text-gray-600 mt-1">Điền thông tin để tạo tài khoản mới</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Mail size={16} className="text-gray-500" />
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              required
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="admin@example.com"
              value={f.email} 
              onChange={e=>setF({...f,email:e.target.value})}
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Lock size={16} className="text-gray-500" />
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                className="w-full h-11 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="Tối thiểu 6 ký tự"
                value={f.password} 
                onChange={e=>setF({...f,password:e.target.value})}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="text-gray-500" />
                Họ <span className="text-red-500">*</span>
              </label>
              <input 
                required
                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="Nguyễn"
                value={f.lastName} 
                onChange={e=>setF({...f,lastName:e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="text-gray-500" />
                Tên <span className="text-red-500">*</span>
              </label>
              <input 
                required
                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="Văn A"
                value={f.firstName} 
                onChange={e=>setF({...f,firstName:e.target.value})}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <Phone size={16} className="text-gray-500" />
              Số điện thoại
            </label>
            <input 
              type="tel"
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
              placeholder="0123456789"
              value={f.numberPhone} 
              onChange={e=>setF({...f,numberPhone:e.target.value})}
            />
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <MapPin size={16} className="text-gray-500" />
              Địa chỉ
            </label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" 
              placeholder="Nhập địa chỉ (tùy chọn)"
              value={f.address} 
              onChange={e=>setF({...f,address:e.target.value})}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button 
            type="submit"
            disabled={saving} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang tạo...
              </>
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
