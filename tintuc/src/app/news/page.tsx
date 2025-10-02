
// // app/news/page.tsx
// import SiteShell from "@/components/siteHeaderFooter";
// import NewsClient from "./_client";

// export const metadata = { title: "3BOW • Tin tức" };

// export default function NewsPage() {
//   return (
//     <SiteShell>
//       <NewsClient />
//     </SiteShell>
//   );
// }





// app/news/page.tsx
import { Suspense } from "react";
import SiteShell from "@/components/siteHeaderFooter";
import NewsClient from "./_client";

export const dynamic = "force-dynamic"; // tắt SSG cho trang này
export const revalidate = 0;            // không ISR

export default function NewsPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Đang tải tin...</div>}>
        <NewsClient />
      </Suspense>
    </SiteShell>
  );
}



