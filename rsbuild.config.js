// @ts-check
import fs from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const host = process.env.API_BASE_URL || 'localhost';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
  ],

  server: {
    host: '0.0.0.0',
    port: 5500,
    strictPort: true,
  },

  dev: {
    client: {
      protocol: 'ws',
      host: host,
      port: 443,
      path: '/rsbuild-hmr',
    },
  },

  source: {
    define: {
      'process.env.API_BASE_URL': JSON.stringify(`https://${host}`),
    },
  },
});