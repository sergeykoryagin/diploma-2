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
            {
        protocol: 'https',
        hostname: 'yastatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]; // Fix for Yandex Maps
    return config;
  },
};

export default nextConfig;
