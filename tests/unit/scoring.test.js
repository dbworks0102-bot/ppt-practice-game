// =========================================================
//  scoring.test.js — スコアリングロジックのユニットテスト
// =========================================================
import { describe, it, expect } from 'vitest'
import { getSpeedTier, calcScore, getGrade } from '../../src/core/scoring.js'

// ── getSpeedTier ──────────────────────────────────────────
describe('getSpeedTier', () => {
  it('speedRatio > 0.85 → ⚡ 超速！ (mult 3.0)', () => {
    const tier = getSpeedTier(0.90)
    expect(tier.label).toContain('超速')
    expect(tier.mult).toBe(3.0)
  })
  it('speedRatio 0.86 (境界値) → ⚡ 超速！', () => {
    const tier = getSpeedTier(0.86)
    expect(tier.mult).toBe(3.0)
  })
  it('speedRatio 0.85 (境界値ちょうど) → 🔥 速い！ (mult 2.5)', () => {
    const tier = getSpeedTier(0.85)
    expect(tier.mult).toBe(2.5)
  })
  it('speedRatio 0.70 → 🔥 速い！ (mult 2.5)', () => {
    const tier = getSpeedTier(0.70)
    expect(tier.label).toContain('速い')
    expect(tier.mult).toBe(2.5)
  })
  it('speedRatio 0.65 (境界値ちょうど) → ✨ Good！ (mult 2.0)', () => {
    const tier = getSpeedTier(0.65)
    expect(tier.mult).toBe(2.0)
  })
  it('speedRatio 0.50 → ✨ Good！ (mult 2.0)', () => {
    const tier = getSpeedTier(0.50)
    expect(tier.mult).toBe(2.0)
  })
  it('speedRatio 0.40 (境界値ちょうど) → 👍 正解！ (mult 1.5)', () => {
    const tier = getSpeedTier(0.40)
    expect(tier.mult).toBe(1.5)
  })
  it('speedRatio 0.20 → 👍 正解！ (mult 1.5)', () => {
    const tier = getSpeedTier(0.20)
    expect(tier.mult).toBe(1.5)
  })
  it('speedRatio 0.15 (境界値ちょうど) → ✅ 正解 (mult 1.0)', () => {
    const tier = getSpeedTier(0.15)
    expect(tier.mult).toBe(1.0)
  })
  it('speedRatio 0.0 → ✅ 正解 (mult 1.0)', () => {
    const tier = getSpeedTier(0.0)
    expect(tier.mult).toBe(1.0)
  })
})

// ── calcScore ─────────────────────────────────────────────
describe('calcScore', () => {
  it('easy × mult1.0 × コンボなし → Math.round(80 * 1.0 * 1.0) = 80', () => {
    const tier = { mult: 1.0 }
    expect(calcScore('easy', tier, 1)).toBe(80)
  })
  it('easy × mult3.0 × コンボなし → 80 * 3.0 * 1.0 = 240', () => {
    const tier = { mult: 3.0 }
    expect(calcScore('easy', tier, 1)).toBe(240)
  })
  it('medium × mult2.5 × コンボ3 → Math.round(100 * 2.5 * 1.3) = 325', () => {
    const tier = { mult: 2.5 }
    expect(calcScore('medium', tier, 3)).toBe(325)
  })
  it('hard × mult3.0 × コンボ5 → Math.round(120 * 3.0 * 1.6) = 576', () => {
    const tier = { mult: 3.0 }
    expect(calcScore('hard', tier, 5)).toBe(576)
  })
  it('hard × mult3.0 × コンボ10 → Math.round(120 * 3.0 * 2.0) = 720', () => {
    const tier = { mult: 3.0 }
    expect(calcScore('hard', tier, 10)).toBe(720)
  })
  it('コンボ9（×1.6の境界未満）→ comboMult 1.3', () => {
    const tier = { mult: 1.0 }
    // combo 4 → mult 1.0 (< 5)
    const score4 = calcScore('easy', tier, 4)
    const score5 = calcScore('easy', tier, 5)
    expect(score5).toBeGreaterThan(score4)
  })
})

// ── getGrade ──────────────────────────────────────────────
describe('getGrade', () => {
  it('2000点以上 → S', () => expect(getGrade(2000)).toBe('S'))
  it('2001点 → S', () => expect(getGrade(2001)).toBe('S'))
  it('1999点 → A', () => expect(getGrade(1999)).toBe('A'))
  it('1200点 → A', () => expect(getGrade(1200)).toBe('A'))
  it('1199点 → B', () => expect(getGrade(1199)).toBe('B'))
  it('600点 → B', () => expect(getGrade(600)).toBe('B'))
  it('599点 → C', () => expect(getGrade(599)).toBe('C'))
  it('200点 → C', () => expect(getGrade(200)).toBe('C'))
  it('199点 → D', () => expect(getGrade(199)).toBe('D'))
  it('0点 → D', () => expect(getGrade(0)).toBe('D'))
})
