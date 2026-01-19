/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable optimization for local images, disable for external (FAL.AI)
    unoptimized: false,

    // Allow FAL.AI generated images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        pathname: '/**',
      },
    ],

    // Image quality settings for best visual quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],

    // High quality for Studio Ghibli style images
    formats: ['image/avif', 'image/webp'],

    // Minimize compression artifacts for detailed anime artwork
    minimumCacheTTL: 31536000, // 1 year cache for static images
  },
}

export default nextConfig
