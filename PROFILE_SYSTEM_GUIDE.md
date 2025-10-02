# 🔐 Hệ thống Profile Admin - Hướng dẫn sử dụng

## 📋 Tổng quan

Hệ thống Profile Admin cho phép quản lý thông tin cá nhân của admin và support admin, bao gồm:
- ✅ Xem, sửa, xóa profile
- ✅ Upload và quản lý avatar
- ✅ Đổi mật khẩu
- ✅ Quản lý thông tin liên hệ
- ✅ Phân quyền truy cập

## 🗄️ 1. Cập nhật Database

### Thêm trường `img` vào bảng `users`:

```sql
-- Chạy migration này trên database MySQL
ALTER TABLE `users` 
ADD COLUMN `img` VARCHAR(500) NULL COMMENT 'Avatar image URL or path' 
AFTER `address`;
```

### Cấu trúc bảng `users` sau khi cập nhật:
```sql
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(120) DEFAULT NULL,
  `lastName` varchar(120) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `img` varchar(500) DEFAULT NULL,        -- ⬅️ TRƯỜNG MỚI
  `role` varchar(32) DEFAULT 'USER',
  `sessionVersion` int DEFAULT '0',
  `lockedUntil` datetime DEFAULT NULL,
  `loginAttemptCount` int DEFAULT '0',
  `lastLoginAttemptAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);
```

## 🔧 2. Backend API Endpoints

### Profile Management APIs:

| Method | Endpoint | Mô tả | Quyền truy cập |
|--------|----------|-------|----------------|
| `GET` | `/api/users/profile` | Lấy profile của mình | Admin, Support Admin |
| `GET` | `/api/users/profile/:id` | Lấy profile theo ID | Admin (xem tất cả), Support Admin (chỉ xem của mình) |
| `PATCH` | `/api/users/profile` | Cập nhật profile của mình | Admin, Support Admin |
| `PATCH` | `/api/users/profile/:id` | Cập nhật profile theo ID | Admin (sửa tất cả), Support Admin (chỉ sửa của mình) |
| `DELETE` | `/api/users/profile` | Xóa profile của mình | Admin, Support Admin |
| `DELETE` | `/api/users/profile/:id` | Xóa profile theo ID | Admin (xóa tất cả), Support Admin (chỉ xóa của mình) |

### Support Admin Management APIs (đã cập nhật):

| Method | Endpoint | Mô tả | Thay đổi |
|--------|----------|-------|----------|
| `GET` | `/api/users/support-admins` | Danh sách support admin | ✅ Đã có trường `img` |
| `POST` | `/auth/register-support-admin` | Tạo support admin | ✅ Hỗ trợ trường `img` |
| `PATCH` | `/users/support-admins/:id` | Cập nhật support admin | ✅ Hỗ trợ `img` và `password` |

## 🎨 3. Frontend Components

### Các component mới:

1. **`ProfileView.tsx`** - Hiển thị thông tin profile
   - Avatar với khả năng upload
   - Thông tin cá nhân đầy đủ
   - Actions (Edit, Delete)
   - Responsive design

2. **`ProfileEdit.tsx`** - Form chỉnh sửa profile
   - Upload avatar với preview
   - Validation form
   - Password change
   - Modern UI với icons

3. **`/admin/profile/page.tsx`** - Trang profile admin
   - Tích hợp ProfileView và ProfileEdit
   - Authentication check
   - Toast notifications
   - Error handling

### Các component đã cập nhật:

1. **`SupportForm.tsx`** - Form tạo support admin
   - ✅ UI hiện đại với icons
   - ✅ Password visibility toggle
   - ✅ Validation cải thiện
   - ✅ Responsive design

2. **`EditSupportForm.tsx`** - Form sửa support admin
   - ✅ Avatar upload
   - ✅ Password change
   - ✅ UI cải thiện
   - ✅ Validation

3. **`AdminSidebar.tsx`** - Sidebar admin
   - ✅ Thêm menu "Profile của tôi"
   - ✅ Navigation đến `/admin/profile`

## 🔐 4. Phân quyền và Bảo mật

### Quyền truy cập:

| Vai trò | Quyền hạn |
|---------|-----------|
| **ADMIN** | - Xem/sửa/xóa profile của tất cả support admin<br>- Quản lý profile của chính mình<br>- Tạo support admin mới |
| **SUPPORT_ADMIN** | - Chỉ xem/sửa/xóa profile của chính mình<br>- Không thể tạo support admin mới |

### Bảo mật:
- ✅ JWT Authentication required
- ✅ Role-based access control
- ✅ Password hashing với bcrypt
- ✅ Session version để kick user
- ✅ File upload validation (type, size)

## 📱 5. Cách sử dụng

### Cho Admin:

1. **Truy cập profile:**
   - Vào Admin Dashboard
   - Click "Profile của tôi" trong sidebar
   - Xem thông tin chi tiết

2. **Chỉnh sửa profile:**
   - Click nút "Edit" trên profile
   - Cập nhật thông tin cần thiết
   - Upload avatar mới (nếu muốn)
   - Đổi mật khẩu (tùy chọn)
   - Click "Lưu thay đổi"

3. **Quản lý Support Admin:**
   - Vào "Quản lý supportAdmin"
   - Click "Edit" trên user cần sửa
   - Cập nhật thông tin, avatar, mật khẩu
   - Lưu thay đổi

### Cho Support Admin:

1. **Truy cập profile:**
   - Đăng nhập với tài khoản support admin
   - Click "Profile của tôi" trong sidebar

2. **Chỉnh sửa profile:**
   - Tương tự như Admin
   - Chỉ có thể sửa profile của chính mình

## 🖼️ 6. Upload Avatar

### Quy định:
- **Định dạng:** JPG, PNG, GIF, WebP
- **Kích thước tối đa:** 5MB
- **Lưu trữ:** Base64 trong database (demo)

### Trong production:
```javascript
// Thay thế phần upload bằng service như AWS S3, Cloudinary
const uploadToS3 = async (file) => {
  // Upload logic
  return imageUrl;
};

// Cập nhật profile với URL
await updateProfile({ img: imageUrl });
```

## 🔄 7. API Usage Examples

### Lấy profile của mình:
```javascript
const profile = await getMyProfile();
console.log(profile);
```

### Cập nhật profile:
```javascript
const updatedProfile = await updateMyProfile({
  firstName: "Nguyễn",
  lastName: "Văn A",
  phone: "0123456789",
  address: "123 ABC Street",
  img: "data:image/jpeg;base64,/9j/4AAQ...",
  password: "newpassword123" // optional
});
```

### Xóa profile:
```javascript
await deleteMyProfile();
// User sẽ được redirect về login
```

## 🧪 8. Testing

### Test cases cần kiểm tra:

1. **Authentication:**
   - ✅ Chỉ admin/support admin mới truy cập được
   - ✅ Redirect về login nếu chưa đăng nhập

2. **Profile Management:**
   - ✅ Xem profile hiển thị đúng thông tin
   - ✅ Cập nhật profile thành công
   - ✅ Validation form hoạt động
   - ✅ Toast notifications hiển thị

3. **Avatar Upload:**
   - ✅ Upload file ảnh thành công
   - ✅ Validation file type và size
   - ✅ Preview ảnh trước khi lưu
   - ✅ Xóa avatar

4. **Password Change:**
   - ✅ Đổi mật khẩu thành công
   - ✅ Validation độ dài mật khẩu
   - ✅ Session invalidation sau khi đổi

5. **Permissions:**
   - ✅ Admin có thể sửa profile support admin
   - ✅ Support admin chỉ sửa được của mình

## 🚀 9. Deployment

### Checklist trước khi deploy:

1. **Database:**
   - [ ] Chạy migration thêm trường `img`
   - [ ] Backup database trước khi migrate
   - [ ] Test migration trên staging

2. **Backend:**
   - [ ] Build và test API endpoints
   - [ ] Kiểm tra JWT authentication
   - [ ] Test file upload limits

3. **Frontend:**
   - [ ] Build production
   - [ ] Test responsive design
   - [ ] Kiểm tra toast notifications
   - [ ] Test navigation

## 🔧 10. Troubleshooting

### Lỗi thường gặp:

1. **404 API Error:**
   ```
   Lỗi: Cannot GET /api/users/support-admins
   Giải pháp: Kiểm tra UsersController đã được import trong UsersModule
   ```

2. **Avatar upload failed:**
   ```
   Lỗi: File quá lớn hoặc sai định dạng
   Giải pháp: Kiểm tra validation trong handleFileChange
   ```

3. **Permission denied:**
   ```
   Lỗi: 403 Forbidden
   Giải pháp: Kiểm tra JWT token và role trong request
   ```

4. **Database error:**
   ```
   Lỗi: Column 'img' doesn't exist
   Giải pháp: Chạy migration thêm trường img
   ```

## 📚 11. Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/)

---

## ✅ Tóm tắt các thay đổi

### Backend Changes:
- ✅ Thêm trường `img` vào User entity
- ✅ Cập nhật DTOs hỗ trợ avatar và password
- ✅ Tạo profile management APIs
- ✅ Cập nhật UsersController và UsersService
- ✅ Thêm authentication guards

### Frontend Changes:
- ✅ Tạo ProfileView và ProfileEdit components
- ✅ Tạo trang /admin/profile
- ✅ Cập nhật SupportForm và EditSupportForm
- ✅ Thêm profile menu vào AdminSidebar
- ✅ Cập nhật API types và functions
- ✅ Thêm toast notifications

### Features:
- ✅ Avatar upload với preview
- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Responsive design
- ✅ Role-based permissions
- ✅ Error handling
- ✅ Modern UI/UX

Hệ thống profile admin đã hoàn thiện và sẵn sàng sử dụng! 🎉
