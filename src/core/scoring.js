// =========================================================
//  スコア計算（純粋関数 — 副作用なし）
// =========================================================
import { DIFF_CFG } from '../data/shortcuts.js'

/** 回答速度から倍率ティアを返す */
export function getSpeedTier(speedRatio) {
  if (speedRatio > 0.85) return { label: "⚡ 超速！", color: "#00f5d4", mult: 3.0 }
  if (speedRatio > 0.65) return { label: "🔥 速い！", color: "#ff9f43", mult: 2.5 }
  if (speedRatio > 0.40) return { label: "✨ Good！",  color: "#a8e6cf", mult: 2.0 }
  if (speedRatio > 0.15) return { label: "👍 正解！", color: "#ccc",    mult: 1.5 }
  return                         { label: "✅ 正解",   color: "#999",    mult: 1.0 }
}

/** ベーススコア × 速度倍率 × コンボ倍率 */
export function calcScore(diff, tier, combo) {
  const base      = DIFF_CFG[diff].base
  const comboMult = combo >= 10 ? 2.0 : combo >= 5 ? 1.6 : combo >= 3 ? 1.3 : 1.0
  return Math.round(base * tier.mult * comboMult)
}

/** スコアからグレードを返す */
export function getGrade(score) {
  if (score >= 2000) return 'S'
  if (score >= 1200) return 'A'
  if (score >= 600)  return 'B'
  if (score >= 200)  return 'C'
  return 'D'
}
