// =========================================================
//  mypage.spec.js — マイページ画面のE2Eテスト
// =========================================================
import { test, expect } from '@playwright/test'

const MOCK_STATS = {
  games: 5,
  totalScore: 3500,
  bestScore: 1200,
  totalCorrect: 40,
  totalWrong: 10,
  questions: {
    '上書き保存': { c: 8, w: 2, cat: '基本操作' },
    'コピー':    { c: 9, w: 1, cat: '基本操作' },
    'ペースト':  { c: 5, w: 5, cat: '基本操作' },
    '元に戻す':  { c: 7, w: 3, cat: '基本操作' },
    '切り取り':  { c: 6, w: 4, cat: '基本操作' },
    '太字':      { c: 4, w: 6, cat: '書式設定' },
    '斜体':      { c: 3, w: 7, cat: '書式設定' },
    '下線':      { c: 2, w: 8, cat: '書式設定' },
  }
}

test.describe('マイページ画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // プレイヤー名と統計データを設定
    await page.evaluate((stats) => {
      localStorage.setItem('ppt-dojo-name', 'テスト太郎')
      localStorage.setItem('ppt-dojo-mystats-テスト太郎', JSON.stringify(stats))
    }, MOCK_STATS)
    await page.reload()
  })

  test('マイページボタンでマイページ画面に遷移', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('#mypage-screen')).toHaveClass(/active/)
  })

  test('プレイヤー名が表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('#mp-content')).toContainText('テスト太郎')
  })

  test('ゲーム数が正しく表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-stat-card.games .sv')).toHaveText('5')
  })

  test('最高スコアが正しく表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-stat-card.best .sv')).toHaveText('1,200')
  })

  test('平均スコアが正しく計算・表示される', async ({ page }) => {
    // 3500 / 5 = 700
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-stat-card.avg .sv')).toHaveText('700')
  })

  test('通算正答率が正しく表示される', async ({ page }) => {
    // 40 / (40+10) = 80%
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-stat-card.acc .sv')).toHaveText('80%')
  })

  test('カテゴリー別正答率バーが表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-cat-bar-row').first()).toBeVisible()
  })

  test('カテゴリー「基本操作」が表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('#mp-content')).toContainText('基本操作')
  })

  test('カテゴリー「書式設定」が表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('#mp-content')).toContainText('書式設定')
  })

  test('苦手な問題TOP10セクションが表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    // 3回以上回答した問題がある → リスト表示される
    await expect(page.locator('.mp-weak-row').first()).toBeVisible()
  })

  test('データリセットボタンで確認モーダルが表示される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await page.locator('.mp-reset-btn').click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/)
  })

  test('リセット実行でデータが削除される', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await page.locator('.mp-reset-btn').click()
    await page.locator('#modal-go').click()

    // リセット後はデータなし表示
    await expect(page.locator('.mp-empty').first()).toBeVisible()
  })

  test('「戻る」ボタンでタイトルに戻る', async ({ page }) => {
    await page.locator('.mp-open-btn').click()
    await page.locator('.mp-back-btn').click()
    await expect(page.locator('#title-screen')).toHaveClass(/active/)
  })

  test('データがない場合は「まだデータがありません」と表示', async ({ page }) => {
    // 統計データを削除
    await page.evaluate(() => {
      localStorage.removeItem('ppt-dojo-mystats-テスト太郎')
    })
    await page.reload()
    await page.locator('.mp-open-btn').click()
    await expect(page.locator('.mp-empty').first()).toBeVisible()
  })
})
