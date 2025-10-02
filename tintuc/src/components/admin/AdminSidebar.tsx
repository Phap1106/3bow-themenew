

"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText, PlusCircle, Users, UserPlus2, Wand2,
  ChevronsLeft, ChevronsRight, MessageSquare, Sparkles,
  BarChart3, Settings, NotebookPen, User,
} from "lucide-react";

type Role = "ADMIN" | "SUPPORT_ADMIN";

type Props = {
  role?: Role | null;
  active: "posts" | "users";
  onGoPosts: () => void;
  onAddPost: () => void;
  onGoUsers: () => void;
  onAddSupport: () => void;
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
  const [leadsCount, setLeadsCount] = React.useState<number>(0);
  const [toast, setToast] = React.useState<string | null>(null);
  const [postsCount, setPostsCount] = React.useState<number>(0);
  const [usersCount, setUsersCount] = React.useState<number>(0);

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

  // ===== Dynamic leads count polling =====
  React.useEffect(() => {
    let alive = true;
    let prev = -1;
    const API = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchCount() {
      try {
        const u = `${API}/leads?page=1&limit=1&status=NEW`;
        const r = await fetch(u, { credentials: "include", cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        const meta = j?.meta || {};
        const total = Number(j?.total ?? meta?.total ?? 0) || 0;
        if (!alive) return;
        setLeadsCount(total);
        if (prev >= 0 && total > prev) {
          setToast(`Có ${total - prev} thư mới`);
          setTimeout(() => setToast(null), 2500);
        }
        prev = total;
      } catch {}
    }

    async function fetchStats() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "";
        const [ra, ru] = await Promise.all([
          fetch(`${API}/articles?page=1&limit=1`, { credentials: "include", cache: "no-store" }),
          fetch(`${API}/users/support-admins?page=1&limit=1`, { credentials: "include", cache: "no-store" }),
        ]);
        const ja = await ra.json().catch(() => ({}));
        const ju = await ru.json().catch(() => ({}));
        const aTotal = Number(ja?.total ?? ja?.meta?.total ?? 0) || 0;
        const uTotal = Number(ju?.total ?? ju?.meta?.total ?? 0) || 0;
        if (!alive) return;
        setPostsCount(aTotal);
        setUsersCount(uTotal);
      } catch {}
    }

    fetchCount();
    fetchStats();
    const t = setInterval(fetchCount, 15000);
    const s = setInterval(fetchStats, 60000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) =>
    collapsed ? null : (
      <div className="flex items-center px-3 py-2 mb-3">
        {Icon && <Icon className="w-4 h-4 mr-2 text-slate-500" />}
        <div className="text-xs font-bold tracking-wider uppercase text-slate-500">
          {children}
        </div>
      </div>
    );

  const NavItem = ({
    icon: Icon, label, onClick, href, active, primary, disabled, badge
  }: {
    icon: React.ElementType; label: string; onClick?: () => void; href?: string;
    active?: boolean; primary?: boolean; disabled?: boolean; badge?: string;
  }) => {
    const baseClasses = "group relative w-full inline-flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-medium";
    
    let stateClasses = "";
    if (primary) {
      stateClasses = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transform";
    } else if (active) {
      stateClasses = "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200 shadow-sm";
    } else {
      stateClasses = "text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-sm";
    }
    
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
    const cls = `${baseClasses} ${stateClasses} ${disabledClasses}`;

    const inner = (
      <>
        <Icon className={`w-5 h-5 shrink-0 ${primary ? "text-white" : active ? "text-blue-600" : "text-slate-500"}`} />
        {!collapsed && (
          <span className="text-sm truncate">{label}</span>
        )}
        {!collapsed && badge && (
          <span className="px-2 py-1 ml-auto text-xs font-bold text-white bg-red-500 rounded-full">
            {badge}
          </span>
        )}
        {!collapsed && primary && (
          <Sparkles className="w-4 h-4 ml-auto text-white/80" />
        )}
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
        "h-fit rounded-2xl border border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[320px]",
        "sticky top-24",
      ].join(" ")}
    >
      {toast && (
        <div className="fixed right-4 top-4 z-50">
          <div className="px-3 py-2 text-sm rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700 shadow">
            {toast}
          </div>
        </div>
      )}
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Bảng điều khiển</div>
              <div className="text-xs text-slate-500">Quản lý hệ thống</div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center w-10 h-10 transition-all duration-200 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
          aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
          title={collapsed ? "Mở" : "Thu gọn"}
        >
          {collapsed ? <ChevronsRight className="w-5 h-5 text-slate-600" /> : <ChevronsLeft className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Posts Section */}
        <div>
          <SectionTitle icon={FileText}>Nội dung</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={FileText} 
              label="Quản lý bài viết" 
              onClick={onGoPosts} 
              active={active === "posts"} 
            />
            <NavItem 
              icon={PlusCircle} 
              label="Thêm bài viết" 
              onClick={onAddPost} 
              primary 
            />
          </div>
        </div>

        {/* Users Section */}
        <div>
          <SectionTitle icon={Users}>Người dùng</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={Users} 
              label="Quản lý supportAdmin" 
              onClick={onGoUsers} 
              active={active === "users"} 
            />
            {role === "ADMIN" && (
              <NavItem 
                icon={UserPlus2} 
                label="Thêm supportAdmin" 
                onClick={onAddSupport} 
                primary 
              />
            )}
          </div>
        </div>

        {/* AI Tools Section */}
        <div>
          <SectionTitle icon={Wand2}>Công cụ AI</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={Wand2} 
              label="Viết nội dung bằng AI" 
              href="/admin/ai-writer" 
              primary 
            />
            <NavItem 
              icon={PlusCircle} 
              label="Tạo nhiều bài đăng" 
              href="/admin/bulk-writer" 
            />
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <SectionTitle icon={MessageSquare}>Phản hồi</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={MessageSquare} 
              label="Thư khách hàng gửi" 
              href="/admin/leads" 
              badge={leadsCount > 0 ? String(leadsCount) : undefined}
            />
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <SectionTitle icon={NotebookPen}>Ghi nhớ</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={NotebookPen} 
              label="Ghi nhớ Admin" 
              href="/admin/notes" 
            />
          </div>
        </div>

        {/* Profile Section */}
        <div>
          <SectionTitle icon={User}>Tài khoản</SectionTitle>
          <div className="space-y-2">
            <NavItem 
              icon={User} 
              label="Profile của tôi" 
              href="/admin/profile" 
            />
          </div>
        </div>
        
        {/* Analytics Section */}
        {!collapsed && (
          <div className="pt-4 border-t border-slate-200/60">
            <SectionTitle icon={BarChart3}>Thống kê</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                <div className="text-2xl font-bold text-blue-600">{postsCount}</div>
                <div className="text-xs text-blue-600/80">Bài viết</div>
              </div>
              <div className="p-3 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50">
                <div className="text-2xl font-bold text-purple-600">{usersCount}</div>
                <div className="text-xs text-purple-600/80">Người dùng</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}