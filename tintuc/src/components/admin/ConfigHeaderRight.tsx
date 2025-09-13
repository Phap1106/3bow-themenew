// //ConfigHeaderRight
// "use client";
// import * as React from "react";
// import { Settings, Users, UserPlus, FileText, X } from "lucide-react";

// export default function ConfigHeaderRight({
//   onGoPosts,
//   onGoUsers,
//   onAddPost,
//   onAddSupportAdmin,
// }: {
//   onGoPosts: () => void;
//   onGoUsers: () => void;
//   onAddPost: () => void;
//   onAddSupportAdmin: () => void;
// }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <>
//       {/* Nút nổi mở panel */}
//       <button
//         onClick={() => setOpen(true)}
//         className="fixed z-40 p-3 text-white bg-black rounded-full shadow-md right-4 top-24 hover:opacity-90"
//         title="Cấu hình nhanh"
//       >
//         <Settings size={18} />
//       </button>

//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/30"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Panel trượt phải */}
//       <aside
//         className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 transform transition-transform ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
//           <div className="text-sm font-medium">Cấu hình nhanh</div>
//           <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
//             <X size={16} />
//           </button>
//         </div>

//         <div className="p-3 space-y-2">
//           <div className="px-1 text-xs uppercase text-zinc-500 dark:text-zinc-400">Bài viết</div>
//           <button
//             onClick={() => { onGoPosts(); setOpen(false); }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
//           >
//             <FileText size={16} /> Quản lý bài viết
//           </button>
//           <button
//             onClick={() => { onAddPost(); setOpen(false); }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
//           >
//             <FileText size={16} /> Thêm bài viết
//           </button>

//           <div className="px-1 pt-3 text-xs uppercase text-zinc-500 dark:text-zinc-400">User / Support</div>
//           <button
//             onClick={() => { onGoUsers(); setOpen(false); }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
//           >
//             <Users size={16} /> Quản lý supportAdmin
//           </button>
//           <button
//             onClick={() => { onAddSupportAdmin(); setOpen(false); }}
//             className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
//           >
//             <UserPlus size={16} /> Thêm supportAdmin
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }









// src/components/admin/ConfigHeaderRight.tsx
"use client";
import * as React from "react";
import { Settings, Users, UserPlus, FileText, X } from "lucide-react";

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
      {/* Nút nổi mở panel */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-40 p-3 text-white bg-black rounded-full shadow-md right-4 top-24 hover:opacity-90"
        title="Cấu hình nhanh"
        aria-label="Mở cấu hình nhanh"
      >
        <Settings size={18} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel trượt phải */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Cấu hình nhanh"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="text-sm font-medium">Cấu hình nhanh</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Đóng panel"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 space-y-2">
          {/* Bài viết */}
          <div className="px-1 text-xs uppercase text-zinc-500 dark:text-zinc-400">
            Bài viết
          </div>
          <button
            type="button"
            onClick={() => {
              onGoPosts();
              setOpen(false);
            }}
            className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <FileText size={16} /> Quản lý bài viết
          </button>
          <button
            type="button"
            onClick={() => {
              onAddPost();
              setOpen(false);
            }}
            className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
          >
            <FileText size={16} /> Thêm bài viết
          </button>

          {/* User / Support */}
          <div className="px-1 pt-3 text-xs uppercase text-zinc-500 dark:text-zinc-400">
            User / Support
          </div>
          <button
            type="button"
            onClick={() => {
              onGoUsers();
              setOpen(false);
            }}
            className="inline-flex items-center w-full gap-2 px-3 py-2 border rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Users size={16} /> Quản lý supportAdmin
          </button>

          {/* Chỉ ADMIN mới thấy nút này */}
          {role === "ADMIN" && (
            <button
              type="button"
              onClick={() => {
                onAddSupportAdmin();
                setOpen(false);
              }}
              className="inline-flex items-center w-full gap-2 px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
            >
              <UserPlus size={16} /> Thêm supportAdmin
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
