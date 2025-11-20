import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path
// For repository named 'username.github.io', use '/'
// For other repositories, use '/repository-name/'
// Change this value before building for deployment
const base = process.env.VITE_BASE_URL || '/';

export default defineConfig({
  base,
  build: {
    outDir: 'docs',
  },
  plugins: [react()],
  assetsInclude: ['**/*.md'], // Allow importing .md files
  define: {
    // Polyfill for gray-matter in browser
    'process.env': {}, 
    global: 'window',
  },
});