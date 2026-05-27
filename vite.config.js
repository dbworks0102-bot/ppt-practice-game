import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    // vitest の設定（vite.config.js に同居）
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.js'],
  },
})
