import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// base '/'：BrowserRouter 嵌套路由（/projects/:id）下必须使用绝对资源路径
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5173, host: true, allowedHosts: true },
  preview: { port: 4173, host: true, allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-katex': ['katex'],
        },
      },
    },
  },
});
