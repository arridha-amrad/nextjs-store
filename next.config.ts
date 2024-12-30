import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'fzsbsdqssixryyzeanoc.supabase.co',
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
