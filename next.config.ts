import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    // Cuts dev compile time: only bundle the icons/motion fns actually used.
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default withPayload(nextConfig);
