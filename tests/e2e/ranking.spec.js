// =========================================================
//  ranking.spec.js — ランキング画面のE2Eテスト
// =========================================================
import { test, expect } from '@playwright/test'

test.describe('ランキング画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // ランキングをクリア
    await page.evaluate(() => {
      ;['easy', 'medium', 'hard'].forEach(d =>
        localStorage.removeItem('ppt-dojo-ranks-' + d)
      )
    })
  })

  test('ランキングボタンでランキング画面に遷移', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    await expect(page.locator('#ranking-screen')).toHaveClass(/active/)
  })

  test('データなしの場合は「まだ記録がありません」と表示', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    await expect(page.locator('.rank-empty')).toBeVisible()
  })

  test('難易度タブが3つ存在する', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    await expect(page.locator('.rank-tab')).toHaveCount(3)
  })

  test('タブ切替でアクティブタブが変わる', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    // mediumタブをクリック
    await page.locator('.rank-tab.medium').click()
    await expect(page.locator('.rank-tab.medium')).toHaveClass(/active/)
    await expect(page.locator('.rank-tab.easy')).not.toHaveClass(/active/)
  })

  test('ランキングデータがある場合にテーブルが表示される', async ({ page }) => {
    // ランキングデータを事前設定
    await page.evaluate(() => {
      const data = [
        { name: 'テスト太郎', score: 1000, correct: 10, wrong: 2, maxCombo: 5, acc: 83, date: '2026/1/1', ts: 1000 }
      ]
      localStorage.setItem('ppt-dojo-ranks-easy', JSON.stringify(data))
    })
    await page.reload()
    await page.locator('.rank-open-btn').click()
    await expect(page.locator('.rank-row')).toBeVisible()
    await expect(page.locator('.rank-name').first()).toContainText('テスト太郎')
  })

  test('自分のスコアに「YOU」タグが表示される', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('ppt-dojo-name', 'テスト太郎')
      const data = [
        { name: 'テスト太郎', score: 1000, correct: 10, wrong: 2, maxCombo: 5, acc: 83, date: '2026/1/1', ts: 1000 }
      ]
      localStorage.setItem('ppt-dojo-ranks-easy', JSON.stringify(data))
    })
    await page.reload()
    await page.locator('.rank-open-btn').click()
    await expect(page.locator('.you-tag')).toBeVisible()
  })

  test('クリアボタンで確認モーダルが表示される', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    await page.locator('.rank-clear-btn').click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/)
  })

  test('「戻る」ボタンでタイトルに戻る', async ({ page }) => {
    await page.locator('.rank-open-btn').click()
    await page.locator('.rank-back-btn').click()
    await expect(page.locator('#title-screen')).toHaveClass(/active/)
  })
})
