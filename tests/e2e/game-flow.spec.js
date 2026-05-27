// =========================================================
//  game-flow.spec.js — ゲームフローのE2Eテスト
// =========================================================
import { test, expect } from '@playwright/test'

test.describe('タイトル画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('タイトル画面が表示される', async ({ page }) => {
    await expect(page.locator('#title-screen')).toHaveClass(/active/)
    await expect(page.locator('.logo-main')).toBeVisible()
  })

  test('難易度選択ボタンが3つ表示される', async ({ page }) => {
    const diffBtns = page.locator('.diff-btn')
    await expect(diffBtns).toHaveCount(3)
  })

  test('名前入力フィールドが存在する', async ({ page }) => {
    await expect(page.locator('#name-input')).toBeVisible()
  })
})

test.describe('ゲーム開始〜プレイ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // ランキング・統計をクリアして初期状態に
    await page.evaluate(() => {
      ;['easy', 'medium', 'hard'].forEach(d =>
        localStorage.removeItem('ppt-dojo-ranks-' + d)
      )
    })
  })

  test('スタートボタンでゲーム画面に遷移する', async ({ page }) => {
    await page.locator('.start-btn').click()
    await expect(page.locator('#game-screen')).toHaveClass(/active/)
  })

  test('ゲーム画面にHUD要素が表示される', async ({ page }) => {
    await page.locator('.start-btn').click()
    await expect(page.locator('#g-timer')).toBeVisible()
    await expect(page.locator('#g-score')).toBeVisible()
    await expect(page.locator('#g-combo')).toBeVisible()
  })

  test('問題と4択ボタンが表示される', async ({ page }) => {
    await page.locator('.start-btn').click()
    await expect(page.locator('#plate-op')).toBeVisible()
    const buttons = page.locator('.c-btn')
    await expect(buttons).toHaveCount(4)
  })

  test('正解クリックでスコアが変化する', async ({ page }) => {
    await page.locator('.start-btn').click()
    await expect(page.locator('.c-btn').first()).toBeVisible()

    // 最初のボタンをクリック
    await page.locator('.c-btn').first().click()
    await page.waitForTimeout(300)

    // 正解または不正解のフラッシュが起きている
    const mainPlate = page.locator('#main-plate')
    const cls = await mainPlate.getAttribute('class')
    expect(cls).toMatch(/correct-flash|wrong-flash/)
  })

  test('キーボード「1」キーで回答できる', async ({ page }) => {
    await page.locator('.start-btn').click()
    await expect(page.locator('.c-btn').first()).toBeVisible()
    await page.keyboard.press('1')
    await page.waitForTimeout(300)
    // 正解か不正解かのフラッシュが起きている
    const mainPlate = page.locator('#main-plate')
    const cls = await mainPlate.getAttribute('class')
    expect(cls).toMatch(/correct-flash|wrong-flash/)
  })

  test('「2」「3」「4」キーでも回答できる', async ({ page }) => {
    for (const key of ['2', '3', '4']) {
      await page.goto('/')
      await page.locator('.start-btn').click()
      await expect(page.locator('.c-btn').first()).toBeVisible()
      await page.keyboard.press(key)
      await page.waitForTimeout(300)
      const cls = await page.locator('#main-plate').getAttribute('class')
      expect(cls).toMatch(/correct-flash|wrong-flash/)
    }
  })
})

test.describe('難易度選択', () => {
  test('「ふつう」選択でmediumに切り替わる', async ({ page }) => {
    await page.goto('/')
    const mediumBtn = page.locator('.diff-btn.medium')
    await mediumBtn.click()
    await expect(mediumBtn).toHaveClass(/selected/)
  })

  test('「むずかしい」選択でhardに切り替わる', async ({ page }) => {
    await page.goto('/')
    const hardBtn = page.locator('.diff-btn.hard')
    await hardBtn.click()
    await expect(hardBtn).toHaveClass(/selected/)
  })

  test('デフォルトは「かんたん」が選択済み', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.diff-btn.easy')).toHaveClass(/selected/)
  })
})

test.describe('モーダル操作', () => {
  test('ゲーム中に終了ボタンで確認モーダルが表示される', async ({ page }) => {
    await page.goto('/')
    await page.locator('.start-btn').click()
    await expect(page.locator('.c-btn').first()).toBeVisible()

    // 終了ボタンをクリック
    await page.locator('.g-ctrl-btn.quit').click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/)
  })

  test('モーダルのキャンセルでゲームに戻れる', async ({ page }) => {
    await page.goto('/')
    await page.locator('.start-btn').click()
    await expect(page.locator('.c-btn').first()).toBeVisible()
    await page.locator('.g-ctrl-btn.quit').click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/)

    await page.locator('#modal-cancel').click()
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/)
    await expect(page.locator('#game-screen')).toHaveClass(/active/)
  })

  test('ESCキーでモーダルをキャンセルできる', async ({ page }) => {
    await page.goto('/')
    await page.locator('.start-btn').click()
    await expect(page.locator('.c-btn').first()).toBeVisible()
    await page.locator('.g-ctrl-btn.quit').click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/)

    await page.keyboard.press('Escape')
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/)
  })
})
