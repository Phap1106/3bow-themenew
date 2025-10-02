"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forceLogout } from "@/lib/usersApi";
import { toast } from "sonner";
import { AlertTriangle, LogOut, Mail } from "lucide-react";

export default function EmergencyLogoutPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForceLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const result = await forceLogout(email.trim());
      if (result.ok) {
        toast.success("Đã xóa tất cả session thành công!");
        // Clear local storage và cookies
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        }
        setTimeout(() => {
          router.push("/login?message=session-cleared");
        }, 1500);
      } else {
        toast.error(result.message || "Không thể xóa session");
      }
    } catch (error: any) {
      console.error("Force logout error:", error);
      toast.error("Có lỗi xảy ra: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Emergency Logout
            </h1>
            <p className="text-gray-600 text-sm">
              Nếu bạn không thể đăng xuất bình thường, sử dụng tính năng này để xóa tất cả session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleForceLogout} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email tài khoản của bạn
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Xóa tất cả Session
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Lưu ý:</h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Tính năng này sẽ xóa tất cả session đang hoạt động</li>
              <li>• Bạn sẽ bị đăng xuất khỏi tất cả thiết bị</li>
              <li>• Sau khi xóa, bạn cần đăng nhập lại</li>
            </ul>
          </div>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Quay lại trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
