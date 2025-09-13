



// src/components/admin/AdminSidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText, PlusCircle, Users, UserPlus2, Wand2,
  ChevronsLeft, ChevronsRight,
} from "lucide-react";

type Role = "ADMIN" | "SUPPORT_ADMIN";

type Props = {
  role?: Role | null;
  active: "posts" | "users";
  onGoPosts: () => void;
  onAddPost: () => void;
  onGoUsers: () => void;
  onAddSupport: () => void;
  /** NEW: cho phép trang cha điều khiển collapse; nếu không truyền thì sidebar tự quản lý */
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export default function AdminSidebar(props: Props) {
  const {
    role, active, onGoPosts, onAddPost, onGoUsers, onAddSupport,
    collapsed: collapsedProp, onToggleCollapsed,
  } = props;

  const key = "admin.sidebar.collapsed";
  const controlled = typeof collapsedProp === "boolean";
  const [inner, setInner] = React.useState(false);

  // chỉ dùng localStorage khi không controlled
  React.useEffect(() => {
    if (controlled) return;
    const v = localStorage.getItem(key);
    if (v === "1") setInner(true);
  }, [controlled]);

  const collapsed = controlled ? !!collapsedProp : inner;

  const toggle = () => {
    if (controlled) {
      onToggleCollapsed?.();
    } else {
      setInner((s) => {
        const nx = !s;
        localStorage.setItem(key, nx ? "1" : "0");
        return nx;
      });
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) =>
    collapsed ? null : (
      <div className="px-2 pb-2 text-[11px] font-medium tracking-wide text-zinc-500/80 uppercase">
        {children}
      </div>
    );

  const NavItem = ({
    icon: Icon, label, onClick, href, active, primary, disabled,
  }: {
    icon: React.ElementType; label: string; onClick?: () => void; href?: string;
    active?: boolean; primary?: boolean; disabled?: boolean;
  }) => {
    const base = "group w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-colors";
    const state = primary
      ? "bg-black text-white hover:opacity-90"
      : active
        ? "bg-zinc-900 text-white"
        : "border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800";
    const cls = `${base} ${state} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

    const inner = (
      <>
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </>
    );
    return href ? (
      <Link href={href} className={cls} aria-label={label} title={collapsed ? label : ""}>
        {inner}
      </Link>
    ) : (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cls}
        aria-label={label}
        title={collapsed ? label : ""}
      >
        {inner}
      </button>
    );
  };

  return (
    <aside
      className={[
        "h-full rounded-2xl border shadow-sm bg-white p-3 md:p-4 transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[260px]",
        "sticky top-16",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-3">
        {!collapsed && (
          <div className="px-2 text-sm font-semibold tracking-tight text-zinc-800">
            Bảng điều khiển
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center w-8 h-8 border rounded-lg hover:bg-zinc-50"
          aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
          title={collapsed ? "Mở" : "Thu gọn"}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      <SectionTitle>Bài viết</SectionTitle>
      <div className="space-y-2">
        <NavItem icon={FileText} label="Quản lý bài viết" onClick={onGoPosts} active={active === "posts"} />
        <NavItem icon={PlusCircle} label="Thêm bài viết" onClick={onAddPost} primary />
      </div>

      <div className="my-4 border-t" />
      <SectionTitle>Support</SectionTitle>
      <div className="space-y-2">
        <NavItem icon={Users} label="Quản lý supportAdmin" onClick={onGoUsers} active={active === "users"} />
        {role === "ADMIN" && (
          <NavItem icon={UserPlus2} label="Thêm supportAdmin" onClick={onAddSupport} primary />
        )}
      </div>

      <div className="my-4 border-t" />
      <SectionTitle>AI</SectionTitle>
      <div className="space-y-2">
        <NavItem icon={Wand2} label="Viết nội dung bằng AI" href="/admin/ai-writer" primary />
        {/* NEW: nút bên dưới để tạo nhiều bài đăng */}
        <NavItem icon={PlusCircle} label="Tạo nhiều bài đăng" href="/admin/bulk-writer" />
      </div>

       <div className="my-4 border-t" />
      <SectionTitle>Phản hôi</SectionTitle>
      <div className="space-y-2">
        <NavItem icon={Wand2} label="Thư khách hàng gửi" href="/admin/leads" primary />
        {/* NEW: nút bên dưới để tạo nhiều bài đăng */}
        {/* <NavItem icon={PlusCircle} label="Tạo nhiều bài đăng" href="/admin/bulk-writer" /> */}
      </div>
    </aside>
  );
}
