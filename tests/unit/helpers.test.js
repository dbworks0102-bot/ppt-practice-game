// =========================================================
//  helpers.test.js — ユーティリティ関数のユニットテスト
// =========================================================
import { describe, it, expect } from 'vitest'
import { shuffle, escHtml, pickChoices, keysHTML } from '../../src/utils/helpers.js'
import { SHORTCUTS } from '../../src/data/shortcuts.js'

// ── shuffle ───────────────────────────────────────────────
describe('shuffle', () => {
  it('要素数が変わらない', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr)).toHaveLength(5)
  })
  it('元の配列を破壊しない（新しい配列を返す）', () => {
    const arr = [1, 2, 3]
    const shuffled = shuffle(arr)
    expect(shuffled).not.toBe(arr)
    expect(arr).toEqual([1, 2, 3])
  })
  it('全ての要素が含まれる', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr)
    expect(shuffled.sort()).toEqual(arr.sort())
  })
  it('空配列でも動作する', () => {
    expect(shuffle([])).toEqual([])
  })
  it('1要素でも動作する', () => {
    expect(shuffle([42])).toEqual([42])
  })
  it('十分な試行でランダム性を確認（同一順序が連続しない）', () => {
    const arr = [1, 2, 3, 4, 5]
    // 100回試行して少なくとも1回は順序が変わるはず
    const results = new Set(Array.from({ length: 100 }, () => shuffle(arr).join(',')))
    expect(results.size).toBeGreaterThan(1)
  })
})

// ── escHtml ───────────────────────────────────────────────
describe('escHtml', () => {
  it('& → &amp;', () => {
    expect(escHtml('A & B')).toBe('A &amp; B')
  })
  it('< → &lt;', () => {
    expect(escHtml('<div')).toBe('&lt;div')
  })
  it('> → &gt;', () => {
    expect(escHtml('1 > 0')).toBe('1 &gt; 0')
  })
  it('XSSパターン全体のエスケープ', () => {
    const input    = '<img src=x onerror="alert(1)">'
    const expected = '&lt;img src=x onerror="alert(1)"&gt;'
    expect(escHtml(input)).toBe(expected)
  })
  it('通常文字はそのまま', () => {
    expect(escHtml('上書き保存')).toBe('上書き保存')
  })
  it('空文字列でも動作する', () => {
    expect(escHtml('')).toBe('')
  })
})

// ── keysHTML ──────────────────────────────────────────────
describe('keysHTML', () => {
  it('1キーの場合は1つの kc スパンのみ', () => {
    const html = keysHTML(['Enter'])
    expect(html).toBe('<span class="kc">Enter</span>')
  })
  it('2キーの場合は + スパンを含む', () => {
    const html = keysHTML(['Ctrl', 'S'])
    expect(html).toContain('kc-plus')
    expect(html).toContain('<span class="kc">Ctrl</span>')
    expect(html).toContain('<span class="kc">S</span>')
  })
  it('3キー（Ctrl+Shift+Z）でも正しく生成される', () => {
    const html = keysHTML(['Ctrl', 'Shift', 'Z'])
    const plusCount = (html.match(/kc-plus/g) || []).length
    expect(plusCount).toBe(2)  // + が2つ
  })
})

// ── pickChoices ───────────────────────────────────────────
describe('pickChoices', () => {
  it('4択を返す', () => {
    const correct = SHORTCUTS[0]
    const choices = pickChoices(correct)
    expect(choices).toHaveLength(4)
  })
  it('正解が必ず含まれる', () => {
    const correct = SHORTCUTS[0]
    const choices = pickChoices(correct)
    expect(choices).toContain(correct)
  })
  it('同一キー組み合わせの問題が2つ以上ない', () => {
    // 同じキー（例: Ctrl+S）を持つ別の問題が誤答に混入しない
    const correct = SHORTCUTS[0]
    const correctKey = correct.keys.join('+')
    const choices = pickChoices(correct)
    const sameKeys = choices.filter(c => c.keys.join('+') === correctKey)
    expect(sameKeys).toHaveLength(1)  // 正解のみ
  })
  it('重複がない（4択のうちユニークな問題が4つ）', () => {
    const correct = SHORTCUTS[0]
    const choices = pickChoices(correct)
    const unique = new Set(choices)
    expect(unique.size).toBe(4)
  })
  it('SHORTCUTSに存在する問題のみが選ばれる', () => {
    const correct = SHORTCUTS[10]
    const choices = pickChoices(correct)
    choices.forEach(c => {
      expect(SHORTCUTS).toContain(c)
    })
  })
})
