// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "3 BOW • Dịch vụ chạy quảng cáo",
// };

// const noFlashScript = `
// (function() {
//   try {
//     var t = localStorage.getItem('theme');
//     var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   } catch (e) {}
// })();
// `;

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="vi" suppressHydrationWarning>
//       <head>
//         <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
//       </head>
//       <body className="bg-white text-zinc-800 dark:text-zinc-100 dark:bg-zinc-950">
//         {children}
//       </body>
//     </html>
//   );
// }



// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
export const metadata: Metadata = {
  title: "3BOW DIGITAL",
  description: "Tăng trưởng thông minh, bền vững theo dữ liệu.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        {children}
        {/* toast toàn cục */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
