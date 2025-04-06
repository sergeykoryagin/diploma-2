import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
