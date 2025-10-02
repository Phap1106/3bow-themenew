// app/news/_data.ts
export type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // nội dung chi tiết
  author: string;
  publishedAt: string; // ISO
  image: string; // dùng ảnh online cho nhanh
};

const NEWS: News[] = [
  {
    id: "1",
    slug: "gpt-5-thinking-sdk-ai-ra-mat",
    title: "SDK-AI công bố GPT-5 Thinking cho ứng dụng doanh nghiệp",
    excerpt:
      "Bản mới tăng tốc suy luận, giảm chi phí 30% và hỗ trợ tool use tốt hơn trên production.",
    content:
      `Bản GPT-5 Thinking tập trung vào khả năng lập luận nhiều bước, hỗ trợ tool use (function calling) tốt hơn, 
streaming ổn định và kiểm soát chi phí ở môi trường thật. 
Nhóm phát triển cũng công bố SDK đồng bộ cho Next.js/NestJS, cho phép triển khai agent dễ hơn.\n\n
Điểm đáng chú ý: latency thấp hơn, độ chính xác cao hơn ở các tác vụ phức tạp, 
và cơ chế sandbox để chạy code an toàn trong hạ tầng cloud/private.`,
    author: "Tech Reporter",
    publishedAt: "2025-08-28T09:10:00.000Z",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    slug: "nextjs-15-app-router-toi-uu-ssr",
    title: "Next.js 15 tối ưu SSR và streaming route handlers",
    excerpt:
      "App Router tiếp tục là mặc định. Nâng cấp giúp giảm TTFB đáng kể trên các dự án tin tức.",
    content:
      `Next.js 15 tập trung vào hiệu suất: cải tiến kiến trúc routing và khả năng streaming dữ liệu động. 
Đối với các website tin tức, TTFB giảm 10–25% tuỳ cấu hình. 
Kết hợp cùng edge runtime và cache fine-grained cho trang danh mục, trải nghiệm người dùng mượt hơn.`,
    author: "Dev Daily",
    publishedAt: "2025-08-25T05:30:00.000Z",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    slug: "nestjs-12-trinh-bay-module-graph",
    title: "NestJS 12 giới thiệu Module Graph Viewer",
    excerpt:
      "Công cụ mới giúp quan sát dependencies module, debug kiến trúc microservices nhanh hơn.",
    content:
      `Module Graph Viewer trực quan hoá mối quan hệ giữa các module/provider trong dự án. 
Điều này đặc biệt hữu ích khi scale kiến trúc microservices, 
giảm thời gian debug circular deps và tối ưu hoá boundaries.`,
    author: "Code Insight",
    publishedAt: "2025-08-20T13:45:00.000Z",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    slug: "database-edge-supabase-rls",
    title: "Database at Edge + RLS: best practices 2025",
    excerpt:
      "Tổng hợp các chiến lược cache, chính sách RLS và migration zero-downtime.",
    content:
      `Bài viết tổng hợp kinh nghiệm triển khai database tại edge kết hợp RLS. 
Focus: cache key chiến lược, fallbacks khi edge cold start, 
và quy trình migration không downtime cho các bảng traffic lớn.`,
    author: "Data Notes",
    publishedAt: "2025-08-18T08:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "5",
    slug: "ui-trend-2025-glassmorphism",
    title: "UI trend 2025: Glassmorphism + Card feed cho trang tin",
    excerpt:
      "Card layout + hover subtle + dark mode: trải nghiệm đọc tự nhiên hơn.",
    content:
      `Xu hướng giao diện 2025 cho các trang tin tức: 
card feed 3 cột, hover rất nhẹ, khoảng trắng lớn, font legible, dark mode chuẩn. 
Kết hợp lazy image và ưu tiên nội dung trước JS để đạt điểm Core Web Vitals cao.`,
    author: "UX Studio",
    publishedAt: "2025-08-15T10:20:00.000Z",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1600&auto=format&fit=crop",
  }  ,
  {
    id: "6",
    slug: "vercel-ai-sdk-2025-streaming-tool-calls",
    title: "Vercel AI SDK 2025 nâng cấp streaming & tool-calls",
    excerpt:
      "Tích hợp function-calling mượt hơn, hỗ trợ multi-model và telemetry built-in.",
    content: `Bản cập nhật tập trung vào DX: hook mới cho streaming token/event, 
tool-calls song song (parallel) và fallback theo model. 
Ngoài ra có telemetry nhẹ để đo latency từng chunk.\n\n
Kết hợp Next.js App Router, bạn có thể dựng chat/agent realtime chỉ với vài API route.`,
    author: "AI Weekly",
    publishedAt: "2025-08-12T09:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "7",
    slug: "tailwind-css-4-atomic-jit",
    title: "Tailwind CSS v4 thử nghiệm Atomic JIT Engine",
    excerpt:
      "Build nhỏ hơn, loại bỏ CSS dead code tốt hơn và compile nhanh hơn đáng kể.",
    content: `Atomic JIT tạo class ở mức thuộc tính, giảm trùng lặp và cải thiện treeshake. 
Plugin cũ vẫn dùng được với adapter tương thích.\n\n
Đối với feed tin tức, kích thước CSS giảm 20–35% so với v3 trong thử nghiệm.`,
    author: "Frontend Notes",
    publishedAt: "2025-08-10T07:30:00.000Z",
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "8",
    slug: "bun-1-2-node-esm-compat",
    title: "Bun 1.2 cải thiện tương thích Node & ESM",
    excerpt:
      "Hỗ trợ nhiều package phổ biến, test runner nhanh và bun:sqlite ổn định.",
    content: `Bun 1.2 làm tốt hơn việc resolve ESM/CJS, đồng thời tối ưu I/O. 
Các dự án Next/Nest có thể dùng Bun để dev/test nhằm rút ngắn thời gian khởi động.\n\n
Điểm cộng: test runner tích hợp, snapshot nhanh.`,
    author: "Runtime Lab",
    publishedAt: "2025-08-08T14:15:00.000Z",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "9",
    slug: "deno-2-edge-runtime-web-standards",
    title: "Deno 2: Edge runtime đồng nhất Web Standards",
    excerpt:
      "Tập trung fetch, WebSocket, WebCrypto chuẩn; NPM compat tiếp tục hoàn thiện.",
    content: `Deno 2 hướng đến một runtime thuần web-API, 
giảm phụ thuộc polyfill riêng. Deploy edge dễ hơn nhờ bundle gọn.\n\n
Use case: API tin tức SSR nhẹ, latency thấp tại nhiều region.`,
    author: "JS Runtime Watch",
    publishedAt: "2025-08-05T03:40:00.000Z",
    image:
      "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "10",
    slug: "react-server-actions-cache-strategy",
    title: "React Server Actions mở rộng chiến lược cache",
    excerpt:
      "Tích hợp revalidateTag/Path tốt hơn, giảm round-trip cho hành động trên server.",
    content: `Server Actions giúp gửi form/triggers trực tiếp lên server mà không cần REST riêng. 
Bản mới bổ sung API cache tinh chỉnh, hữu ích cho trang tin có thao tác lọc/sort.\n\n
Tác động: UX mượt, số request giảm đáng kể.`,
    author: "React Radar",
    publishedAt: "2025-08-02T16:50:00.000Z",
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "11",
    slug: "typescript-6-variadic-generics-satisfies-boost",
    title: "TypeScript 6 nâng cấp variadic generics & satisfies",
    excerpt:
      "Inference chính xác hơn, error message dễ hiểu và build nhanh hơn.",
    content: `TS6 tối ưu hoá inference cho tuple/variadic, 
cải thiện operator 'satisfies' để validate shape mà không làm nặng type system.\n\n
Codebase lớn (Next/Nest mono-repo) build ổn định hơn nhờ incremental cải tiến.`,
    author: "Type Nerd",
    publishedAt: "2025-07-31T12:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab9b1cee5f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "12",
    slug: "supabase-vector-2-rag-pipeline",
    title: "Supabase Vector 2.0: dựng RAG pipeline đơn giản",
    excerpt:
      "Hỗ trợ hybrid search, index background và quota theo project.",
    content: `Phiên bản mới bổ sung hybrid BM25 + vector và job index nền. 
Kết hợp RLS để kiểm soát truy cập tài liệu cho từng người dùng.\n\n
RAG cho trang tin nội bộ trở nên an toàn và dễ triển khai.`,
    author: "Data Stack",
    publishedAt: "2025-07-28T10:10:00.000Z",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "13",
    slug: "kafka-raft-mode-stable-microservices",
    title: "Kafka: Raft mode ổn định cho microservices",
    excerpt:
      "Đơn giản hoá quorum, rút ngắn thời gian khôi phục và giảm độ phức tạp ZooKeeper.",
    content: `Chế độ Raft giúp cluster dễ vận hành và scale. 
Đối với hệ thống log tin/bình luận thời gian thực, độ trễ giảm và failover nhanh.\n\n
Khuyến nghị: chuẩn hoá observability với OpenTelemetry.`,
    author: "Infra Diary",
    publishedAt: "2025-07-25T06:25:00.000Z",
    image:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "14",
    slug: "redis-8-tiered-memory-observability",
    title: "Redis 8 giới thiệu tiered memory & observability",
    excerpt:
      "Khai thác RAM + SSD hợp lý, metrics chi tiết cho keyspace nóng.",
    content: `Tiered memory cho phép mở rộng dataset vượt RAM, 
vẫn giữ độ trễ thấp cho key nóng. Observability mới hỗ trợ truy vết TTL, hits/misses.\n\n
Ứng dụng: cache trang tin lưu lượng cao, ổn định chi phí.`,
    author: "Cache Today",
    publishedAt: "2025-07-22T09:45:00.000Z",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "15",
    slug: "prisma-6-edge-accelerate",
    title: "Prisma 6: Edge-ready + Accelerate cho database",
    excerpt:
      "Client nhẹ hơn, connection pooling thông minh và schema lint tốt hơn.",
    content: `Prisma 6 tối ưu cho môi trường edge/function, 
giảm chi phí kết nối và tăng tốc các truy vấn phổ biến.\n\n
Phù hợp backend tin tức cần SSR nhanh và tiết kiệm kết nối DB.`,
    author: "DB Tools",
    publishedAt: "2025-07-20T04:35:00.000Z",
    image:
      "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "16",
    slug: "opentelemetry-next-nest-end-to-end",
    title: "OpenTelemetry: theo dõi end-to-end cho Next.js & NestJS",
    excerpt:
      "Trace xuyên suốt frontend → API → DB, truy vết bottleneck chính xác.",
    content: `Thiết lập OTEL collector + exporter giúp quan sát đầy đủ chuỗi request. 
Dashboard hoá latency theo route và database span.\n\n
Kết quả: dễ tối ưu TTFB cho trang danh mục tin.`,
    author: "Obs Studio",
    publishedAt: "2025-07-18T08:20:00.000Z",
    image:
      "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "17",
    slug: "webassembly-rust-plugin-serverless",
    title: "WebAssembly + Rust cho plugin serverless",
    excerpt:
      "Sandbox an toàn, cold-start nhanh và porting dễ giữa nhiều nền tảng.",
    content: `Chạy logic nặng trong WASM cho phép tách biệt bảo mật và tái sử dụng. 
Rust mang lại tốc độ và footprint nhỏ.\n\n
Trang tin có thể dùng WASM để xử lý ảnh/markdown ngay tại edge.`,
    author: "Systems Post",
    publishedAt: "2025-07-15T11:55:00.000Z",
    image:
      "https://images.unsplash.com/photo-1478358161113-b0e11994a36b?q=80&w=1600&auto=format&fit=crop",
  }

];

export const getAllNews = () =>
  [...NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

export const getNewsBySlug = (slug: string) =>
  NEWS.find((n) => n.slug === slug);
