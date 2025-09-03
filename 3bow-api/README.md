# 3bow-api-backend (NestJS + Prisma + PostgreSQL)

Backend tin tức khớp kiểu dữ liệu frontend của bạn.

## Tính năng
- CRUD bài viết (`id, slug, title, excerpt, content, author, publishedAt, image`)
- REST API:
  - `GET /api/articles?page=1&limit=10&q=keyword`
  - `GET /api/articles/:slug`
  - `POST /api/articles`
  - `PATCH /api/articles/:id`
  - `DELETE /api/articles/:id`
- Prisma + PostgreSQL (Docker), seed dữ liệu mẫu
- Tránh lỗi `authorName`/`ArticleCreateManyInput` và lỗi `beforeExit`
- `prisma db seed` chạy bằng `tsx` (không ghi vào `dist/prisma/seed.js` ⇒ tránh EPERM trên Windows)

## Chạy nhanh (Docker Postgres)
```bash
cp .env.example .env
docker compose up -d
pnpm i   # hoặc yarn / npm i
pnpm prisma:migrate   # hoặc: pnpm db:push
pnpm seed
pnpm dev
# API: http://localhost:4000/api
```

## Lệnh Prisma
```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:push
pnpm seed
```

## Note mapping với frontend
- `id`: dùng `cuid()` dạng string ⇒ khớp kiểu `id: string` ở frontend.
- `publishedAt`: ISO string; controller/service tự chuyển `string` → `Date` khi ghi DB.
- Truy vấn `q` tìm trong `title, excerpt, content, author`.

## Tránh lỗi thường gặp
- **TS2353 authorName**: schema chỉ có `author`, không có `authorName`. Seed/dto đã đồng bộ.
- **EPERM unlink dist/prisma/seed.js**: không tạo file `dist/prisma/seed.js` nữa; seed chạy trực tiếp bằng `tsx`.
- **Argument of type 'beforeExit'**: KHÔNG dùng `app.enableShutdownHooks('beforeExit')`. Thay vào đó `PrismaService.$on('beforeExit')` đóng app an toàn.

Chúc chạy mượt! 🚀
