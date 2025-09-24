import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root warning by explicitly setting the root
  outputFileTracingRoot: __dirname,
  
  // Optimize for production
  experimental: {
    optimizePackageImports: ['lucide-react']
  },

  // Handle webpack config for Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
