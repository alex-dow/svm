import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  webpack: (config) => {

    config.resolve.fallback = {
      'stream/web': require.resolve('web-streams-polyfill'),
      'stream': require.resolve('stream-browserify')
    };
    return config;
  },
 
  turbopack: {
    resolveAlias: {
      'stream/web': 'web-streams-polyfill',
      //'stream': 'stream-browersify'
    }
  }
 
};

export default nextConfig;
