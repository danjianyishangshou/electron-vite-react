import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-frontend',
    emptyOutDir: true,
    sourcemap: false,  // 禁用 sourcemap 以提高构建性能
    copyPublicDir: true,  // 禁用复制 public 目录
    target: 'esnext',  // 构建目标为现代浏览器
  },
})
