/** @type {import('next').NextConfig} */
const nextConfig = {  
  output: 'export',
}
const nextConfig = {  
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

