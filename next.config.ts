import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Netlifyでは秘密情報がビルドキャッシュに保存されるのを防ぐ
    turbopackFileSystemCacheForBuild: process.env.NETLIFY !== "true",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "yhotta240.gallerycdn.vsassets.io",
      },
    ],
  },
};

export default nextConfig;
