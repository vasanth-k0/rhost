import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'


// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../../../../server/app/console/ui/default',
    emptyOutDir: true
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    AutoImport({
      imports: ['react'],
      dirs: ['./src/**',],
    }),
  ],
  server: {
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
