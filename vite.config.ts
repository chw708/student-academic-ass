import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/student-academic-ass/', // GitHub Pages용 base 경로
  plugins: [react()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // @를 src 폴더로 매핑
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
