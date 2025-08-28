/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // Disable optimization to avoid issues
  },
  
  // Ensure static files are properly handled
  trailingSlash: false,
  
  // Force include public directory
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;