import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites from /<repository>/.
// Local development and custom-domain hosting use the root path.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/vortiv.id/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
