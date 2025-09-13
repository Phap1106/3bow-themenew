/api
  ├─ Dockerfile
  ├─ package.json
  ├─ prisma/
  │   ├─ schema.prisma
  │   └─ seed.ts
  ├─ src/
  │   ├─ main.ts
  │   ├─ app.module.ts
  │   └─ posts/
  │       ├─ posts.module.ts
  │       ├─ posts.service.ts
  │       ├─ posts.controller.ts
  │       └─ dto/
  │           ├─ create-post.dto.ts
  │           └─ update-post.dto.ts
  └─ tsconfig.json
/docker-compose.yml



1) Database (Postgres trong Docker – cổng 5435)
cd D:\web-3bow\3bow-api
copy .env.example .env
# mở .env và đặt:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5435/threebow?schema=public"

docker compose down -v
docker compose up -d
docker compose ps


Test DB:

docker compose exec -e PGPASSWORD=postgres db psql -U postgres -d threebow -c "select now();"

2) Backend (NestJS + Prisma)
cd D:\web-3bow\3bow-api
yarn
yarn prisma:generate
yarn db:push
yarn seed
yarn dev


API base: http://localhost:4000/api

Danh sách: GET /articles?page=1&limit=12&q=keyword

Chi tiết: GET /articles/:slug

Xem DB bằng GUI:

yarn prisma studio   # http://localhost:5555

3) Frontend (Next.js)
cd D:\web-3bow   # thư mục FE (chứa app/, components/, v.v.)
# tạo env FE trỏ về API
echo NEXT_PUBLIC_API_URL=http://localhost:4000/api > .env.local

yarn
yarn dev    # http://localhost:3000


Trang tin: http://localhost:3000/news (lưới card: ảnh + tiêu đề + mô tả + tác giả + thời gian + phân trang)

Trang admin: http://localhost:3000/admin (CRUD bài viết)

4) Lỗi hay gặp & lệnh fix nhanh

Cổng DB bận: đổi ports trong docker-compose.yml & .env sang 5436 rồi:

docker compose down -v && docker compose up -d


Prisma “Engine was empty”:

Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
yarn prisma:generate



src/auth/
  auth.module.ts
  auth.service.ts
  auth.controller.ts
  roles.ts
  roles.decorator.ts
  auth.guard.ts
  roles.guard.ts"# 3bow-0109" 


src/
└─ app/
   └─ admin/
      ├─ page.tsx                      // nhẹ, chỉ điều hướng + layout
      └─ _panels/
         ├─ PostsPanel.tsx             // quản lý bài viết + phân trang
         ├─ UsersPanel.tsx             // quản lý supportAdmin + phân trang
         └─ EditSupportForm.tsx        // form sửa support inline
components/
└─ ui/Pagination.tsx                   // pager dùng chung (đã gửi trước)
