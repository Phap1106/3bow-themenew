"use client";
import * as React from "react";
import { Eye, EyeOff, User, Phone, MapPin, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { SupportUser, ProfileInput } from "@/lib/usersApi";

interface ProfileEditProps {
  user: SupportUser;
  onSubmit: (data: ProfileInput) => void | Promise<void>;
  onCancel: () => void;
  showPasswordField?: boolean;
}

export default function ProfileEdit({
  user,
  onSubmit,
  onCancel,
  showPasswordField = true,
}: ProfileEditProps) {
  const [form, setForm] = React.useState<ProfileInput>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    address: user.address || "",
    img: user.img || "",
    password: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string>(user.img || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        setForm(prev => ({ ...prev, img: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview("");
    setForm(prev => ({ ...prev, img: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.firstName?.trim() || !form.lastName?.trim()) {
      toast.error("Vui lòng điền đầy đủ họ và tên");
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setSaving(true);
    try {
      // Only include password if it's provided
      const submitData = { ...form };
      if (!submitData.password?.trim()) {
        delete submitData.password;
      }
      await onSubmit(submitData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-[min(700px,calc(100vw-2rem))]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Chỉnh sửa Profile</h3>
          <p className="text-sm text-gray-600 mt-1">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <User size={32} className="text-gray-600" />
                </div>
              )}
            </div>
            {avatarPreview && (
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              {avatarPreview ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
            </button>
          </div>
          
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
                value={form.lastName} 
                onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
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
                value={form.firstName} 
                onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
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
              value={form.phone} 
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
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
              value={form.address} 
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          {/* Password Field */}
          {showPasswordField && (
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <User size={16} className="text-gray-500" />
                Mật khẩu mới (để trống nếu không đổi)
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  className="w-full h-11 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Tối thiểu 6 ký tự (tùy chọn)"
                  value={form.password} 
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && form.password.length > 0 && form.password.length < 6 && (
                <p className="text-red-500 text-sm mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
              )}
            </div>
          )}
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
