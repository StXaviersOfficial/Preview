import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    // Enable AVIF (best compression) with WebP fallback for browsers that
    // support them. next/image automatically negotiates the best format.
    formats: ["image/avif", "image/webp"],
    // Allow loading images from the school's mirror site if needed in future
    remotePatterns: [],
  },
};

export default nextConfig;
