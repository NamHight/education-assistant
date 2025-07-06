import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.7.73",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.2.60",
        port: "8000",
        pathname: "/**",
      },
       {
        protocol: "http",
        hostname: "192.168.**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
    ],
    // ✅ Image optimization settings
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ External packages cho server components
  serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;