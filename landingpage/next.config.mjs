/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The landing page is self-contained; images are inline SVG/CSS so the
  // default optimizer is left untouched for zero-config deployment.
};

export default nextConfig;
