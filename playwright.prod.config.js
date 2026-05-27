// 本番環境E2Eテスト用設定
// 実行: npx playwright test --config=playwright.prod.config.js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'https://ppt-practice-game-dbworks0102-bots-projects.vercel.app',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // 本番はwebServerを起動しない（外部URLに直接アクセス）
})
