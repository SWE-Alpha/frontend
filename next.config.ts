import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  }
  }
export default nextConfig;
