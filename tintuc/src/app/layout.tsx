

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
    <html lang="vi" className="scroll-smooth">
      <body>
        {children}
        {/* toast toàn cục */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

