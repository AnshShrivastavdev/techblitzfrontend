import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    // Ensures backup folders or external scripts never fail the build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
