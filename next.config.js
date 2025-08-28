/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features you're using
  },
  
  // Image optimization settings
  images: {
    domains: ['images.unsplash.com'], // Add domains you're using for images
  },
  
  // Output configuration for deployment
  output: 'standalone', // Use this for containerized deployments
  
  // Ensure ES modules work correctly
  transpilePackages: [],
};

module.exports = nextConfig;