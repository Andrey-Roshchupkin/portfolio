import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'], // Allow importing .md files
  define: {
    // Polyfill for gray-matter in browser
    'process.env': {}, 
    global: 'window',
  },
});