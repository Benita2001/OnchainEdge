/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "@resvg/resvg-js",
      ];
    }
    return config;
  },
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
