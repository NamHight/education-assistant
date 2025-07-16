import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '192.168.7.73',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '192.168.2.60',
        port: '8000',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**'
      }
    ],
    // ✅ Image optimization settings
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  output: 'standalone', 
  telemetry: false,
  experimental: {
    optimizeCss: true, // Tối ưu CSS
  },
  productionBrowserSourceMaps: false,

  swcMinify: true
};

export default nextConfig;
