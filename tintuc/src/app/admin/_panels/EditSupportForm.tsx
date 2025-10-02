"use client";
import * as React from "react";
import { Eye, EyeOff, User, Phone, MapPin, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { SupportUser } from "@/lib/usersApi"; // ✅ ĐÚNG NGUỒN TYPE

export type SupportEditInput = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  img?: string;
  password?: string;
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
    img: initial.img ?? "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string>(initial.img || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ✅ Gõ kiểu rõ ràng, không còn 'any'
  const set = <K extends keyof SupportEditInput>(k: K, v: SupportEditInput[K]) =>
    setF((s: SupportEditInput) => ({ ...s, [k]: v }));

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        set("img", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview("");
    set("img", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (f.password && f.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      // Only include password if it's provided
      const submitData = { ...f };
      if (!submitData.password?.trim()) {
        delete submitData.password;
      }
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[min(600px,calc(100vw-2rem))]">
      <form onSubmit={submit} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Support Admin</h3>
          <p className="text-sm text-gray-600 mt-1">Cập nhật thông tin tài khoản</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <User size={24} className="text-gray-600" />
                </div>
              )}
            </div>
            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={10} className="text-white" />
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleAvatarClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={14} />
            {avatarPreview ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email (readonly) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email (không thể chỉnh sửa)
            </label>
            <input
              disabled
              value={initial.email ?? ""}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="text-gray-500" />
                Họ
              </label>
              <input
                value={f.firstName ?? ""}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Tên"
                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="text-gray-500" />
                Tên
              </label>
              <input
                value={f.lastName ?? ""}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Họ"
                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              value={f.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="0123456789"
              className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              value={f.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Nhập địa chỉ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <User size={16} className="text-gray-500" />
              Mật khẩu mới (để trống nếu không đổi)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                minLength={6}
                value={f.password ?? ""}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Tối thiểu 6 ký tự (tùy chọn)"
                className="w-full h-11 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {f.password && f.password.length > 0 && f.password.length < 6 && (
              <p className="text-red-500 text-sm mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
            )}
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
            disabled={loading}
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
