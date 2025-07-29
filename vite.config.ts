import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // GitHub Pages 배포 시 기본 경로 (반드시 repo 이름과 동일하게)
  base: '/student-academic-ass/',

  plugins: [react()],

  // public 폴더 지정
  publicDir: 'public',

  // @ 경로 alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',     // 빌드 결과 폴더
    emptyOutDir: true,  // 기존 dist 삭제 후 새 빌드
  },

  server: {
    port: 3000,         // 로컬 개발 서버 포트
    open: true,         // npm run dev 시 자동 브라우저 열기
  },
});
