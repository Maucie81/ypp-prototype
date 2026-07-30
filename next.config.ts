import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Pin file tracing to this package so the build doesn't hang resolving multiple lockfiles
  outputFileTracingRoot: path.join(__dirname),
  // Disable webpack persistent cache in dev to avoid "is not a loader" / cache serialization errors
  webpack: (config, { dev }) => {
    if (dev && config.cache) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
