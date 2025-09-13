// src/components/common/LogoutButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/adminApi";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất");
      router.replace("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <button onClick={onLogout} className="inline-flex items-center px-3 border rounded-md h-9">
      Đăng xuất
    </button>
  );
}
