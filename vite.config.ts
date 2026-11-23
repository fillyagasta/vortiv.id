import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths make the build work on GitHub Pages project sites.
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
