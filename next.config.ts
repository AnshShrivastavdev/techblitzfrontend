import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensures backup folders or external scripts never fail the build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
