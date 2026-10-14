/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/services', destination: '/#services', permanent: false }];
  },
};

export default nextConfig;
