// =========================================================
//  check-duplicates.js — ショートカット問題の重複チェック
//  実行: node scripts/check-duplicates.js
// =========================================================
import { SHORTCUTS } from '../src/data/shortcuts.js'

console.log('=== PPT道場 ショートカット重複チェック ===\n')
console.log(`総問題数: ${SHORTCUTS.length} 問\n`)

// ── 1. 操作名の重複チェック ──────────────────────────────
const opMap = new Map()
SHORTCUTS.forEach((s, i) => {
  if (!opMap.has(s.op)) opMap.set(s.op, [])
  opMap.get(s.op).push({ index: i, lv: s.lv, cat: s.cat, keys: s.keys.join('+') })
})

const dupOps = [...opMap.entries()].filter(([, entries]) => entries.length > 1)
if (dupOps.length === 0) {
  console.log('✅ 操作名の重複: なし')
} else {
  console.log(`⚠️  操作名の重複: ${dupOps.length} 件`)
  dupOps.forEach(([op, entries]) => {
    console.log(`  「${op}」 (${entries.length}件)`)
    entries.forEach(e => console.log(`    [${e.index}] lv:${e.lv} cat:${e.cat} keys:${e.keys}`))
  })
}

// ── 2. キー組み合わせの重複チェック ──────────────────────
const keyMap = new Map()
SHORTCUTS.forEach((s, i) => {
  const key = s.keys.join('+')
  if (!keyMap.has(key)) keyMap.set(key, [])
  keyMap.get(key).push({ index: i, op: s.op, lv: s.lv, cat: s.cat })
})

const dupKeys = [...keyMap.entries()].filter(([, entries]) => entries.length > 1)
console.log('')
if (dupKeys.length === 0) {
  console.log('✅ キー組み合わせの重複: なし')
} else {
  console.log(`ℹ️  キー組み合わせの重複: ${dupKeys.length} 件（同キーで複数操作 = 正常な場合あり）`)
  dupKeys.forEach(([key, entries]) => {
    console.log(`  [${key}] (${entries.length}件)`)
    entries.forEach(e => console.log(`    [${e.index}] lv:${e.lv} cat:${e.cat} 「${e.op}」`))
  })
}

// ── 3. レベル別・カテゴリー別集計 ──────────────────────
console.log('\n── レベル別 ──────────────────────────────')
const lvMap = new Map()
SHORTCUTS.forEach(s => {
  if (!lvMap.has(s.lv)) lvMap.set(s.lv, 0)
  lvMap.set(s.lv, lvMap.get(s.lv) + 1)
})
;[1, 2, 3].forEach(lv => {
  const count = lvMap.get(lv) || 0
  console.log(`  Lv.${lv}: ${count} 問`)
})

console.log('\n── カテゴリー別 ────────────────────────────')
const catMap = new Map()
SHORTCUTS.forEach(s => {
  if (!catMap.has(s.cat)) catMap.set(s.cat, 0)
  catMap.set(s.cat, catMap.get(s.cat) + 1)
})
;[...catMap.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => console.log(`  ${cat}: ${count} 問`))

// ── 4. 150問への拡充ギャップ分析 ──────────────────────
console.log('\n── 150問拡充計画 ────────────────────────────')
const current = SHORTCUTS.length
const target  = 150
const gap     = target - current
console.log(`  現在: ${current} 問 / 目標: ${target} 問`)
console.log(`  不足: ${gap} 問`)
if (gap > 0) {
  console.log(`  推奨追加: Lv.1 ${Math.ceil(gap * 0.4)} 問 / Lv.2 ${Math.ceil(gap * 0.4)} 問 / Lv.3 ${Math.ceil(gap * 0.2)} 問`)
}

console.log('\n=== チェック完了 ===')
