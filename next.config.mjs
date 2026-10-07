/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // Upload multiple photos at once from the admin
    serverActions: { bodySizeLimit: "45mb" },
  },
};
export default nextConfig;
