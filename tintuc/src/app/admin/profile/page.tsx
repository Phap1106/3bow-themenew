"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import ProfileView from "@/components/admin/ProfileView";
import ProfileEdit from "@/components/admin/ProfileEdit";
import { 
  getMyProfile, 
  updateMyProfile, 
  deleteMyProfile,
  type SupportUser, 
  type ProfileInput 
} from "@/lib/usersApi";

type Role = "ADMIN" | "SUPPORT_ADMIN";

// Temporary debug mode - set to false when fixed
const DEBUG_MODE = false;

export default function ProfilePage() {
  if (DEBUG_MODE) {
    const ProfileDebugPage = React.lazy(() => import('./debug'));
    return (
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading debug...</div>}>
        <ProfileDebugPage />
      </React.Suspense>
    );
  }
  const router = useRouter();
  
  // Auth state
  const [role, setRole] = React.useState<Role | null>(null);
  const [me, setMe] = React.useState<{ id: string; email: string; role: Role } | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  
  // Profile state
  const [profile, setProfile] = React.useState<SupportUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // UI state
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Check authentication
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const r = await fetch(`${API}/auth/me`, { credentials: "include", cache: "no-store" });
        if (!r.ok) throw new Error("unauth");
        const _me = await r.json();
        if (_me.role !== "ADMIN" && _me.role !== "SUPPORT_ADMIN") {
          router.replace("/login?next=/admin/profile");
          return;
        }
        if (mounted) {
          setRole(_me.role);
          setMe(_me);
        }
      } catch {
        router.replace("/login?next=/admin/profile");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  // Load profile
  const loadProfile = React.useCallback(async () => {
    if (!me) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log("Loading profile for user:", me);
      const profileData = await getMyProfile();
      console.log("Profile data loaded:", profileData);
      setProfile(profileData);
    } catch (e: any) {
      console.error("Profile loading error:", e);
      setError(e?.message || "Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  }, [me]);

  React.useEffect(() => {
    if (me && !authLoading) {
      loadProfile();
    }
  }, [me, authLoading, loadProfile]);

  // Handle edit
  const handleEdit = async (data: ProfileInput) => {
    try {
      const updated = await updateMyProfile(data);
      setProfile(updated);
      setShowEdit(false);
      toast.success("Cập nhật profile thành công!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Cập nhật profile thất bại!");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteMyProfile();
      toast.success("Xóa tài khoản thành công!");
      // Redirect to login after deletion
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      toast.error(error?.message || "Xóa tài khoản thất bại!");
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (file: File) => {
    try {
      // Convert file to base64 for demo purposes
      // In production, you should upload to a file storage service
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        try {
          const updated = await updateMyProfile({ img: result });
          setProfile(updated);
          toast.success("Cập nhật ảnh đại diện thành công!");
        } catch (error: any) {
          console.error("Error updating avatar:", error);
          toast.error(error?.message || "Cập nhật ảnh đại diện thất bại!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error("Error processing avatar:", error);
      toast.error("Không thể xử lý file ảnh!");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy thông tin profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile của tôi</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProfileView
          user={profile}
          isOwnProfile={true}
          canEdit={true}
          canDelete={true}
          onEdit={() => setShowEdit(true)}
          onDelete={() => setShowDeleteConfirm(true)}
          onAvatarChange={handleAvatarChange}
        />
      </main>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title=""
        size="lg"
      >
        <ProfileEdit
          user={profile}
          onSubmit={handleEdit}
          onCancel={() => setShowEdit(false)}
          showPasswordField={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Xác nhận xóa tài khoản"
        size="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa tài khoản của mình không? 
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa tài khoản
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
