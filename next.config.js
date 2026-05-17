/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000"}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
