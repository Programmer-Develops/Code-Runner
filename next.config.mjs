/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Recommended for most projects with Node.js builtins in server code
  // until Turbopack fully supports them reliably
  experimental: {
    turbopack: false,
  },

  // externalize child_process explicitly (helps in some Turbopack cases)
  serverExternalPackages: ['child_process'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',           // ← Wildcard: allows ANY https domain (convenient for dev/production)
        // port: '',              // optional
        // pathname: '/**',       // optional: restrict path if needed
      },
      {
        protocol: 'http',
        hostname: '**',           // if you ever have http sources (rare)
      },
    ],
  },
};

export default nextConfig;