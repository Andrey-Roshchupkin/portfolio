import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path
// Set VITE_BASE_URL environment variable in GitHub Actions
// For repository named 'username.github.io', use '/'
// For other repositories, use '/repository-name/'
const base = process.env.VITE_BASE_URL || '/';

export default defineConfig({
  base,
  plugins: [react()],
  assetsInclude: ['**/*.md'], // Allow importing .md files
  define: {
    // Polyfill for gray-matter in browser
    'process.env': {}, 
    global: 'window',
  },
});