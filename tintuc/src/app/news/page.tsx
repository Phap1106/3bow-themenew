
// app/news/page.tsx
import SiteShell from "@/components/siteHeaderFooter";
import NewsClient from "./_client";

export const metadata = { title: "3BOW • Tin tức" };

export default function NewsPage() {
  return (
    <SiteShell>
      <NewsClient />
    </SiteShell>
  );
}



