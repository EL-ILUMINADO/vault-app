import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Tell Next.js to ignore these packages during bundling
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "@neondatabase/serverless",
    "@prisma/adapter-neon",
  ],
  experimental: {},
};

export default nextConfig;
