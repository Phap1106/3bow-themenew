"use client";
import * as React from "react";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { SupportUser, ProfileInput } from "@/lib/usersApi";

interface ProfileViewProps {
  user: SupportUser;
  isOwnProfile?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAvatarChange?: (file: File) => void;
}

export default function ProfileView({
  user,
  isOwnProfile = false,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onAvatarChange,
}: ProfileViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (canEdit && onAvatarChange) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
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
      onAvatarChange(file);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'SUPPORT_ADMIN': return 'Hỗ trợ Admin';
      default: return 'Người dùng';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'SUPPORT_ADMIN': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div 
                className={`w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg ${
                  canEdit && onAvatarChange ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                }`}
                onClick={handleAvatarClick}
              >
                {user.img ? (
                  <img 
                    src={user.img} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <User size={32} className="text-gray-600" />
                  </div>
                )}
              </div>
              {canEdit && onAvatarChange && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 shadow-lg">
                  <Upload size={12} className="text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            {/* Name and Role */}
            <div>
              <h1 className="text-2xl font-bold">
                {user.firstName || user.lastName 
                  ? `${user.lastName || ''} ${user.firstName || ''}`.trim()
                  : 'Chưa có tên'
                }
              </h1>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                <Shield size={12} />
                {getRoleDisplay(user.role)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canEdit && onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Chỉnh sửa profile"
              >
                <Edit size={18} />
              </button>
            )}
            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                title="Xóa profile"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email || 'Chưa có email'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{user.phone || 'Chưa có số điện thoại'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {user.address && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ</h2>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={18} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Địa chỉ hiện tại</p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Ngày tạo</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                <p className="font-medium">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ID Information (for debugging) */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
