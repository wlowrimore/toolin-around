import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@sanity/pane', 'refractor', 'prismjs'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});