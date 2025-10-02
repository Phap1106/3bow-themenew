


// // src/components/admin/ConfigHeaderRight.tsx
// "use client";
// import * as React from "react";
// import { Settings, Users, UserPlus, FileText, X } from "lucide-react";

// type Role = "ADMIN" | "SUPPORT_ADMIN";

// export default function ConfigHeaderRight({
//   role,
//   onGoPosts,
//   onGoUsers,
//   onAddPost,
//   onAddSupportAdmin,
// }: {
//   role: Role;
//   onGoPosts: () => void;
//   onGoUsers: () => void;
//   onAddPost: () => void;
//   onAddSupportAdmin: () => void;
// }) {
//   const [open, setOpen] = React.useState(false);

//   React.useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <>
//       {/* Nút nổi mở panel */}
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="fixed z-40 p-3 text-white bg-black rounded-full shadow-md right-4 top-24 hover:opacity-90"
//         title="Cấu hình nhanh"
//         aria-label="Mở cấu hình nhanh"
//       >
//         <Settings size={18} />
//       </button>

//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/30"
//           onClick={() => setOpen(false)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Panel trượt phải */}
//       <aside
//         className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 transform transition-transform ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//         role="dialog"
//         aria-modal="true"
//         aria-label="Cấu hình nhanh"
//       >
//         <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
//           <div className="text-sm font-medium">Cấu hình nhanh</div>
//           <button
//             type="button"
//             onClick={() => setOpen(false)}
//             className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
//             aria-label="Đóng panel"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="p-3 space-y-2">
//           {/* Bài viết */}
//           <div className="px-1 text-xs uppercase text-zinc-500 dark:text-zinc-400">
//             Bài viết
//           </div>
//           <button
//             type="button"
//             onClick={() => {
//               onGoPosts();
//               setOpen(false);
//             }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
//           >
//             <FileText size={16} /> Quản lý bài viết
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               onAddPost();
//               setOpen(false);
//             }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
//           >
//             <FileText size={16} /> Thêm bài viết
//           </button>

//           {/* User / Support */}
//           <div className="px-1 pt-3 text-xs uppercase text-zinc-500 dark:text-zinc-400">
//             User / Support
//           </div>
//           <button
//             type="button"
//             onClick={() => {
//               onGoUsers();
//               setOpen(false);
//             }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
//           >
//             <Users size={16} /> Quản lý supportAdmin
//           </button>

//           {/* Chỉ ADMIN mới thấy nút này */}
//           {role === "ADMIN" && (
//             <button
//               type="button"
//               onClick={() => {
//                 onAddSupportAdmin();
//                 setOpen(false);
//               }}
//               className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
//             >
//               <UserPlus size={16} /> Thêm supportAdmin
//             </button>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }




















"use client";
import * as React from "react";
import { Settings, Users, UserPlus, FileText, X, Zap, Activity } from "lucide-react";

type Role = "ADMIN" | "SUPPORT_ADMIN";

export default function ConfigHeaderRight({
  role,
  onGoPosts,
  onGoUsers,
  onAddPost,
  onAddSupportAdmin,
}: {
  role: Role;
  onGoPosts: () => void;
  onGoUsers: () => void;
  onAddPost: () => void;
  onAddSupportAdmin: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Enhanced Floating Action Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-40 p-4 text-white transition-all duration-200 transform rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 right-6 top-28 hover:shadow-3xl hover:scale-110 group"
        title="Cấu hình nhanh"
        aria-label="Mở cấu hình nhanh"
      >
        <Settings size={20} className="transition-transform duration-300 group-hover:rotate-90" />
        <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1 animate-pulse"></div>
      </button>

      {/* Enhanced Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Slide Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[360px] bg-white/95 backdrop-blur-xl border-l border-slate-200/60 shadow-2xl transform transition-all duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Cấu hình nhanh"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Cấu hình nhanh</div>
              <div className="text-xs text-slate-500">Truy cập nhanh các chức năng</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Đóng panel"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-blue-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-blue-600/80">Bài viết</div>
                </div>
                <FileText className="w-8 h-8 text-blue-500/50" />
              </div>
            </div>
            <div className="p-4 border bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-purple-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-purple-600/80">Người dùng</div>
                </div>
                <Users className="w-8 h-8 text-purple-500/50" />
              </div>
            </div>
          </div>

          {/* Quick Actions - Posts */}
          <div>
            <div className="flex items-center px-1 mb-3">
              <FileText className="w-4 h-4 mr-2 text-slate-500" />
              <div className="text-sm font-bold tracking-wider uppercase text-slate-500">
                Bài viết
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onGoPosts();
                  setOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm group"
              >
                <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-slate-100 group-hover:bg-slate-200">
                  <FileText size={18} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-800">Quản lý bài viết</div>
                  <div className="text-xs text-slate-500">Xem và chỉnh sửa nội dung</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  onAddPost();
                  setOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-white transition-all duration-200 transform bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:scale-105 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Thêm bài viết mới</div>
                  <div className="text-xs text-white/80">Tạo nội dung mới</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Actions - Users */}
          <div>
            <div className="flex items-center px-1 mb-3">
              <Users className="w-4 h-4 mr-2 text-slate-500" />
              <div className="text-sm font-bold tracking-wider uppercase text-slate-500">
                Người dùng
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onGoUsers();
                  setOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm group"
              >
                <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-slate-100 group-hover:bg-slate-200">
                  <Users size={18} className="text-slate-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-800">Quản lý supportAdmin</div>
                  <div className="text-xs text-slate-500">Xem danh sách người dùng</div>
                </div>
              </button>

              {/* Chỉ ADMIN mới thấy nút này */}
              {role === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => {
                    onAddSupportAdmin();
                    setOpen(false);
                  }}
                  className="flex items-center w-full gap-3 px-4 py-3 text-white transition-all duration-200 transform bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:scale-105 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                    <UserPlus size={18} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Thêm supportAdmin</div>
                    <div className="text-xs text-white/80">Tạo tài khoản mới</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between p-4 border bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-green-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium text-green-800">Hệ thống hoạt động tốt</div>
                  <div className="text-xs text-green-600">Tất cả dịch vụ đang online</div>
                </div>
              </div>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}