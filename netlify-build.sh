#!/bin/bash

# Netlify Build Script
echo "🚀 Starting Netlify build process..."

# Set default environment variables if not provided
export MONGODB_URI=${MONGODB_URI:-"mongodb://localhost:27017/unified-toolkit-build"}
export JWT_SECRET=${JWT_SECRET:-"build-time-jwt-secret-change-in-production-32-chars"}
export JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET:-"build-time-refresh-secret-change-in-production-32-chars"}
export NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-"https://app.netlify.com"}

echo "✅ Environment variables set for build"
echo "📦 Installing dependencies..."

# Install dependencies
pnpm install

echo "🔨 Building Next.js application..."

# Build the application
pnpm build

echo "🎉 Build completed successfully!"
