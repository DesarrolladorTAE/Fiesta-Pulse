/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // trailingSlash: true,     // 👈 importante para export estático
};
module.exports = nextConfig;
