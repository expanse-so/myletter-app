/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: true,
  },
  // Exclude test files and test configuration from the build
  webpack: (config, { dev, isServer }) => {
    // Only in production builds
    if (!dev) {
      // Add vitest.config.ts to ignored files
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [...(config.watchOptions.ignored || []), '**/vitest.config.ts'],
      };
    }
    return config;
  },
};

export default nextConfig;