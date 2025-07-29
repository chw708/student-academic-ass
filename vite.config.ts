import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // 👈 public 폴더를 빌드에 포함
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
