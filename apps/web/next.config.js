/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns :[
      {
        protocol: "https",
        hostname: "**",
      },
    ]
  }
  // async rewrites() {
  //   const backendUrl = process.env.BACKEND_URL;
  //   return [
  //     {
  //       source: '/api/backend/:path*',
  //       destination: `${backendUrl}/:path*`,
  //     },
  //   ];
  // },
}

module.exports = nextConfig
