import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    /* config options here */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'buddies.sirv.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photos.google.com',
        pathname: '/**' 
      }
    ],
  },
  async rewrites() {
    const target = 'https://backend-mmow.vercel.app';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
}
export default nextConfig;
