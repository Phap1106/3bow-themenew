

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";
import PostsPanel, { type PostsPanelHandle } from "./_panels/PostsPanel";
import UsersPanel, { type UsersPanelHandle } from "./_panels/UsersPanel";

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
    return <div className="flex items-center justify-center min-h-[60vh] text-zinc-500">Đang xác thực…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-zinc-200/70 dark:border-zinc-800/60">
        <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
          <h1 className="text-xl font-semibold">Admin</h1>
          <LogoutButton />
        </div>
      </div>

      <div className="flex max-w-6xl gap-6 px-4 py-6 mx-auto">
        <AdminSidebar
          role={role ?? undefined}
          active={mode}
          onGoPosts={() => setMode("posts")}
          onAddPost={() => postsRef.current?.openCreate()}
          onGoUsers={() => setMode("users")}
          onAddSupport={() => usersRef.current?.openCreateSupport()}
        />

        <main className="flex-1">
          {mode === "posts" ? <PostsPanel ref={postsRef} /> : <UsersPanel ref={usersRef} />}
        </main>
      </div>
    </div>
  );
}
