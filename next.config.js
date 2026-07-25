/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
