/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Explicitly externalize child_process so Turbopack ignores it during the build
  serverExternalPackages: ['child_process'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',           // Allows ANY https domain
      },
      {
        protocol: 'http',
        hostname: '**',           // Allows ANY http domain
      },
    ],
  },
};

export default nextConfig;