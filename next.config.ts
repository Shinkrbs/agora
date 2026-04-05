import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'japveggcagosmslyibdw.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/**', 
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

/* @type {import('next').NextConfig} 
 
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
}*/

export default nextConfig;
