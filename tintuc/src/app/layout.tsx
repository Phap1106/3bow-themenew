

// // src/app/layout.tsx
// import "./globals.css";
// import type { Metadata } from "next";
// import { Toaster } from "sonner";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
// export const metadata: Metadata = {
//   title: "3BOW DIGITAL",
//   description: "Tăng trưởng thông minh, bền vững theo dữ liệu.",
//  icons: {
//     icon: [
//       // { url: "/icon.png", type: "image/png", sizes: "32x32" },
//       { url: "/icon.png", type: "image/png", sizes: "192x192" },
//     ],
//     apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
//   },
//   themeColor: "#0ea5e9", // màu thanh tab trên mobile (tùy chọn)
// };
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="vi" className="scroll-smooth">
//       <body>
//         {children}
//         {/* toast toàn cục */}
//         <Toaster richColors position="top-right" />
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
 icons: {
    icon: [{ url: "/favicon.ico" }],                  // CHỈ favicon.ico cho tab
    apple: [{ url: "/icon.png", sizes: "180x180" }], // từ /public (tùy chọn)
  },
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
