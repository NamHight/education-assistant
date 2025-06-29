import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ask-api.cimigo.com",
      "lh3.googleusercontent.com",
      "localhost:8000",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
};

export default nextConfig;
