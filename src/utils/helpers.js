// =========================================================
//  汎用ユーティリティ（副作用なし）
// =========================================================
import { SHORTCUTS } from '../data/shortcuts.js'

/** Fisher-Yates シャッフル */
export function shuffle(a) {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

/** キー配列 → HTML文字列（例: <kc>Ctrl</kc>+<kc>S</kc>） */
export function keysHTML(keys) {
  return keys.map((k, i) =>
    (i > 0 ? '<span class="kc-plus">+</span>' : '') +
    `<span class="kc">${k}</span>`
  ).join('')
}

/** XSS対策エスケープ */
export function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 正解と同じキー組み合わせを除外した4択を返す
 * @param {object} correct - 正解のショートカットオブジェクト
 */
export function pickChoices(correct) {
  const correctKey = correct.keys.join('+')
  const pool = SHORTCUTS.filter(s => s !== correct && s.keys.join('+') !== correctKey)
  return shuffle([correct, ...shuffle(pool).slice(0, 3)])
}
