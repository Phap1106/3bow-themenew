// // src/components/common/LogoutButton.tsx
// "use client";
// import { useRouter } from "next/navigation";
// import { logout } from "@/lib/adminApi";
// import { toast } from "sonner";

// export default function LogoutButton() {
//   const router = useRouter();

//   const onLogout = async () => {
//     try {
//       await logout();
//       toast.success("Đã đăng xuất");
//       router.replace("/login");
//       router.refresh();
//     } catch (e) {
//       console.error(e);
//       toast.error("Đăng xuất thất bại");
//     }
//   };

//   return (
//     <button onClick={onLogout} className="inline-flex items-center px-3 border rounded-md h-9">
//       Đăng xuất
//     </button>
//   );
// }


"use client";
import { logout } from "@/lib/adminApi";
import { toast } from "sonner";

export default function LogoutButton() {
  const onLogout = async () => {
    // 1. Thử gọi API để báo Server (Không quan trọng thành công hay thất bại)
    try {
      await logout();
    } catch (e) {
      console.warn("API Logout lỗi (nhưng sẽ vẫn logout ở client):", e);
    } finally {
      // 2. BẮT BUỘC: Xóa sạch Cookie ở phía Client bằng JS thuần
      // Xóa trường hợp domain .3bowdigital.com
      document.cookie = "access_token=; Path=/; Domain=.3bowdigital.com; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "refresh_token=; Path=/; Domain=.3bowdigital.com; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      // Xóa trường hợp domain hiện tại (để chắc chắn không sót)
      document.cookie = "access_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "refresh_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      toast.success("Đã đăng xuất");

      // 3. Dùng window.location để ép tải lại trang hoàn toàn (Tránh cache của Next.js giữ lại state cũ)
      window.location.href = "/login";
    }
  };

  return (
    <button 
      onClick={onLogout} 
      className="inline-flex items-center px-3 border rounded-md h-9 hover:bg-gray-100 transition-colors text-sm font-medium"
    >
      Đăng xuất
    </button>
  );
}