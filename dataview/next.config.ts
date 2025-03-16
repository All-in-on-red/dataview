import type { NextConfig } from 'next';
import { PyodidePlugin } from '@pyodide/webpack-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // On the client, add the PyodidePlugin to bundle Pyodide assets.
    if (!isServer) {
      config.plugins.push(new PyodidePlugin());
      config.resolve.alias = {
        ...config.resolve.alias,
        'node-fetch': false, // Replace node-fetch with a dummy module for browser builds.
      };
    }
    // On the server, exclude Pyodide from the bundle.
    if (isServer) {
      config.externals = [...(config.externals || []), 'pyodide'];
    }
    return config;
  },
};

export default nextConfig;