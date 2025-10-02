# 🔧 Profile System Troubleshooting Guide

## ❌ Lỗi đã sửa: "Cannot GET /api/users?page=1&limit=1"

### Nguyên nhân:
- AdminSidebar.tsx đang gọi endpoint `/users?page=1&limit=1` không tồn tại
- Endpoint đúng phải là `/users/support-admins?page=1&limit=1`

### Giải pháp:
✅ **Đã sửa** trong `tintuc/src/components/admin/AdminSidebar.tsx` dòng 88:
```javascript
// Trước (SAI):
fetch(`${API}/users?page=1&limit=1`, { credentials: "include", cache: "no-store" })

// Sau (ĐÚNG):
fetch(`${API}/users/support-admins?page=1&limit=1`, { credentials: "include", cache: "no-store" })
```

## 📋 Checklist để Profile hoạt động

### 1. ✅ Database Setup
- [ ] Chạy migration SQL để thêm trường `img`:
```sql
ALTER TABLE `users` 
ADD COLUMN `img` VARCHAR(500) NULL COMMENT 'Avatar image URL or path' 
AFTER `address`;
```

### 2. ✅ Backend Setup
- [x] UsersController đã được thêm vào UsersModule
- [x] User entity có trường `img`
- [x] Profile API endpoints đã được tạo
- [ ] Backend server đang chạy

### 3. ✅ Frontend Setup
- [x] ProfileView và ProfileEdit components đã được tạo
- [x] Profile page tại `/admin/profile` đã được tạo
- [x] AdminSidebar có menu "Profile của tôi"
- [x] API calls đã được sửa đúng endpoint
- [ ] Frontend server đang chạy

## 🚀 Cách test Profile System

### Bước 1: Khởi động servers
```bash
# Terminal 1: Backend
cd 3bow-api
npm run start:dev

# Terminal 2: Frontend  
cd tintuc
npm run dev
```

### Bước 2: Kiểm tra authentication
1. Truy cập `http://localhost:3000/admin`
2. Đăng nhập với tài khoản admin
3. Kiểm tra console browser có lỗi không

### Bước 3: Test Profile page
1. Click "Profile của tôi" trong sidebar
2. Kiểm tra trang profile có load được không
3. Test các chức năng:
   - ✅ Xem profile
   - ✅ Chỉnh sửa profile
   - ✅ Upload avatar
   - ✅ Đổi mật khẩu

### Bước 4: Test Support Admin management
1. Vào "Quản lý supportAdmin"
2. Test tạo support admin mới
3. Test chỉnh sửa support admin
4. Kiểm tra có thể upload avatar và đổi password

## 🐛 Các lỗi thường gặp và cách sửa

### Lỗi 1: "Cannot GET /api/users/profile"
**Nguyên nhân:** Backend chưa chạy hoặc UsersController chưa được import
**Giải pháp:**
```bash
cd 3bow-api
npm run start:dev
```

### Lỗi 2: "Column 'img' doesn't exist"
**Nguyên nhân:** Chưa chạy migration database
**Giải pháp:**
```sql
ALTER TABLE `users` ADD COLUMN `img` VARCHAR(500) NULL AFTER `address`;
```

### Lỗi 3: "Cannot read properties of undefined"
**Nguyên nhân:** Component import sai hoặc thiếu
**Giải pháp:** Kiểm tra import trong ProfilePage:
```typescript
import ProfileView from "@/components/admin/ProfileView";
import ProfileEdit from "@/components/admin/ProfileEdit";
import Modal from "@/components/ui/Modal";
```

### Lỗi 4: "401 Unauthorized"
**Nguyên nhân:** Chưa đăng nhập hoặc session hết hạn
**Giải pháp:** Đăng nhập lại tại `/login`

### Lỗi 5: Profile page trắng/không load
**Nguyên nhân:** Lỗi JavaScript hoặc API
**Giải pháp:**
1. Mở Developer Tools (F12)
2. Kiểm tra Console tab có lỗi
3. Kiểm tra Network tab xem API calls
4. Kiểm tra backend logs

## 🔍 Debug Commands

### Kiểm tra API endpoints:
```bash
# Test auth
curl -X GET http://localhost:4000/api/auth/me \
  -H "Cookie: your-session-cookie"

# Test profile
curl -X GET http://localhost:4000/api/users/profile \
  -H "Cookie: your-session-cookie"

# Test support admins list
curl -X GET "http://localhost:4000/api/users/support-admins?page=1&limit=10" \
  -H "Cookie: your-session-cookie"
```

### Kiểm tra database:
```sql
-- Kiểm tra cấu trúc bảng users
DESCRIBE users;

-- Kiểm tra dữ liệu users
SELECT id, email, firstName, lastName, img, role FROM users LIMIT 5;
```

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi, hãy cung cấp:
1. **Error message** chính xác từ console
2. **Network requests** từ Developer Tools
3. **Backend logs** nếu có
4. **Database schema** hiện tại

## ✅ Xác nhận hoạt động

Profile system hoạt động đúng khi:
- [x] Không có lỗi 404 API
- [ ] Profile page load được
- [ ] Có thể xem thông tin profile
- [ ] Có thể chỉnh sửa profile
- [ ] Có thể upload avatar
- [ ] Có thể đổi mật khẩu
- [ ] Support admin management hoạt động
- [ ] Toast notifications hiển thị đúng
