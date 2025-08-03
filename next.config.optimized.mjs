/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Optimized webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Optimize chunk splitting for development
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 20,
            enforce: true,
          },
          ui: {
            chunks: 'all',
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 10,
            enforce: true,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
