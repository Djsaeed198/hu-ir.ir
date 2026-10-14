import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      { source: "/hungary/budapest", destination: "/hungary/cities/budapest", permanent: true },
      { source: "/hungary/debrecen", destination: "/hungary/cities/debrecen", permanent: true },
      { source: "/hungary/szeged", destination: "/hungary/cities/szeged", permanent: true },
      { source: "/hungary/pecs", destination: "/hungary/cities/pecs", permanent: true },
      { source: "/hungary/gyor", destination: "/hungary/cities/gyor", permanent: true },
      { source: "/services/work-immigration", destination: "/services/work-permit", permanent: true },
      { source: "/services/study-immigration", destination: "/services/study-admission", permanent: true },
      { source: "/services/permanent-residence", destination: "/services/citizenship", permanent: true },
      { source: "/tools/assessment", destination: "/assess", permanent: true },
      { source: "/blog/:slug*", destination: "/news/:slug*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
