

// // next.config.ts
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//    images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "images.unsplash.com" },
//       { protocol: "https", hostname: "source.unsplash.com" },
//       { protocol: "https", hostname: "picsum.photos" },
//       { protocol: "https", hostname: "dummyimage.com" },
//     ],
//   },
//   // ❌ remove: output: "export"
  
// };
// export default nextConfig;








// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
    eslint: { ignoreDuringBuilds: true },
      typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "dummyimage.com" },
            { protocol: "https", hostname: "3bowdigital.com" },
      { protocol: "https", hostname: "www.3bowdigital.com" },
      { protocol: "https", hostname: "api.3bowdigital.com" },
      // các host ảnh bạn dùng: unsplash, picsum, v.v.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "dummyimage.com" },
    ],
  },
  async rewrites() {
    return [
      // DÙNG 1 RULE DUY NHẤT: FE gọi /bapi/... -> BE /api/...
      { source: "/bapi/:path*", destination: "http://localhost:4000/api/:path*" },
    ];
  },
};
export default nextConfig;
