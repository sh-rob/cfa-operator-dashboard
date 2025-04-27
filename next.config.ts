import type { NextConfig } from "next";

// next.config.ts
// @ts-ignore
import withLess from "next-with-less";

const nextConfig = {
  reactStrictMode: true,

  // other Next.js settings if you have
};

export default withLess(nextConfig);
