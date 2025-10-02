

// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import AdminSidebar from "@/components/admin/AdminSidebar";
// import LogoutButton from "@/components/common/LogoutButton";
// import PostsPanel, { type PostsPanelHandle } from "./_panels/PostsPanel";
// import UsersPanel, { type UsersPanelHandle } from "./_panels/UsersPanel";

// type Mode = "posts" | "users";
// type Role = "ADMIN" | "SUPPORT_ADMIN";
// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// export default function AdminPage() {
//   const router = useRouter();
//   const [mode, setMode] = React.useState<Mode>("posts");
//   const [role, setRole] = React.useState<Role | null>(null);
//   const [authLoading, setAuthLoading] = React.useState(true);

//   const postsRef = React.useRef<PostsPanelHandle>(null);
//   const usersRef = React.useRef<UsersPanelHandle>(null);

//   // Auth guard
//   React.useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
//         if (!r.ok) throw new Error("unauth");
//         const me = await r.json();
//         if (me.role !== "ADMIN") {
//           router.replace("/supportAdmin");
//           return;
//         }
//         if (mounted) setRole(me.role);
//       } catch {
//         router.replace("/login?next=/admin");
//       } finally {
//         if (mounted) setAuthLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [router]);

//   if (authLoading) {
//     return <div className="flex items-center justify-center min-h-[60vh] text-zinc-500">Đang xác thực…</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
//       {/* Top bar */}
//       <div className="sticky top-0 z-20 border-b bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-zinc-200/70 dark:border-zinc-800/60">
//         <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
//           <h1 className="text-xl font-semibold">Admin</h1>
//           <LogoutButton />
//         </div>
//       </div>

//       <div className="flex max-w-6xl gap-6 px-4 py-6 mx-auto">
//         <AdminSidebar
//           role={role ?? undefined}
//           active={mode}
//           onGoPosts={() => setMode("posts")}
//           onAddPost={() => postsRef.current?.openCreate()}
//           onGoUsers={() => setMode("users")}
//           onAddSupport={() => usersRef.current?.openCreateSupport()}
//         />

//         <main className="flex-1">
//           {mode === "posts" ? <PostsPanel ref={postsRef} /> : <UsersPanel ref={usersRef} />}
//         </main>
//       </div>
//     </div>
//   );
// }























"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";
import PostsPanel, { type PostsPanelHandle } from "./_panels/PostsPanel";
import UsersPanel, { type UsersPanelHandle } from "./_panels/UsersPanel";
import { Shield, User, Activity, Bell } from "lucide-react";

type Mode = "posts" | "users";
type Role = "ADMIN" | "SUPPORT_ADMIN";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("posts");
  const [role, setRole] = React.useState<Role | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  const postsRef = React.useRef<PostsPanelHandle>(null);
  const usersRef = React.useRef<UsersPanelHandle>(null);

  // Auth guard
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
        if (!r.ok) throw new Error("unauth");
        const me = await r.json();
        if (me.role !== "ADMIN") {
          router.replace("/supportAdmin");
          return;
        }
        if (mounted) setRole(me.role);
      } catch {
        router.replace("/login?next=/admin");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">Đang xác thực quyền truy cập</p>
            <p className="mt-1 text-sm text-slate-500">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b shadow-lg backdrop-blur-xl bg-white/90 border-slate-200/60">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                ADMIN 3BOW DIGITAL
              </h1>
              <p className="text-sm font-medium text-slate-500">Hệ thống quản lý nội dung</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative p-2 transition-colors rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></span>
            </button>
            
            {/* Status Badge */}
            <div className="flex items-center px-3 py-2 text-sm font-semibold rounded-full shadow-sm bg-emerald-100 text-emerald-700">
              <div className="w-2 h-2 mr-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Online
            </div>
            
            {/* User Info */}
            <div className="flex items-center px-4 py-2 space-x-3 bg-white border shadow-sm rounded-xl border-slate-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  {role === "ADMIN" ? "Quản trị viên" : "Hỗ trợ"}
                </p>
                <p className="text-xs text-slate-500">Đang hoạt động</p>
              </div>
            </div>
            
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex gap-8 px-6 py-8 mx-auto max-w-7xl">
        <AdminSidebar
          role={role ?? undefined}
          active={mode}
          onGoPosts={() => setMode("posts")}
          onAddPost={() => postsRef.current?.openCreate()}
          onGoUsers={() => setMode("users")}
          onAddSupport={() => usersRef.current?.openCreateSupport()}
        />

        {/* Enhanced Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-10rem)]">
          <div className="overflow-hidden bg-white border shadow-xl rounded-2xl border-slate-200/60">
            {/* Content Header */}
            <div className="px-8 py-6 border-b bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 border-slate-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    mode === "posts" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                      : "bg-gradient-to-br from-purple-500 to-purple-600"
                  } shadow-lg`}>
                    {mode === "posts" ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {mode === "posts" ? "Quản lý bài viết" : "Quản lý người dùng"}
                    </h2>
                    <p className="mt-1 font-medium text-slate-600">
                      {mode === "posts" 
                        ? "Tạo, chỉnh sửa và quản lý nội dung website" 
                        : "Quản lý tài khoản và phân quyền người dùng"
                      }
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Tab Buttons */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setMode("posts")}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === "posts"
                        ? "bg-white text-blue-600 shadow-md transform scale-105"
                        : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                    }`}
                  >
                    📝 Bài viết
                  </button>
                  <button
                    onClick={() => setMode("users")}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      mode === "users"
                        ? "bg-white text-purple-600 shadow-md transform scale-105"
                        : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                    }`}
                  >
                    👥 Người dùng
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-8">
              {mode === "posts" ? <PostsPanel ref={postsRef} /> : <UsersPanel ref={usersRef} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}