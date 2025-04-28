/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  output: 'standalone',
  env: {
    API_ENDPOINT:
      process.env.API_ENDPOINT || 'https://api.spaceflow.captainistz.me',
  },
}

export default nextConfig
