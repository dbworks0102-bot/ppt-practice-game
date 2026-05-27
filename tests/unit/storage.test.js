// =========================================================
//  storage.test.js — localStorage操作のユニットテスト
//  Vitest + jsdom 環境で localStorage を使用
// =========================================================
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getHi, setHi,
  getPlayerName, savePlayerName,
  getRankings, saveScore, clearRankings, RANK_MAX,
  getPlayerStats, savePlayerStats, getStatsKey,
  getCategoryStats, getWeakQuestions,
} from '../../src/core/storage.js'

beforeEach(() => {
  localStorage.clear()
})

// ── ハイスコア ────────────────────────────────────────────
describe('getHi / setHi', () => {
  it('初期値は 0', () => {
    expect(getHi()).toBe(0)
  })
  it('setHi で値を保存し getHi で取得できる', () => {
    setHi(1500)
    expect(getHi()).toBe(1500)
  })
  it('複数回上書き可能', () => {
    setHi(100)
    setHi(2000)
    expect(getHi()).toBe(2000)
  })
})

// ── プレイヤー名 ──────────────────────────────────────────
describe('getPlayerName / savePlayerName', () => {
  it('未保存の場合は空文字', () => {
    expect(getPlayerName()).toBe('')
  })
  it('savePlayerName で保存して getPlayerName で取得', () => {
    savePlayerName('テストユーザー')
    expect(getPlayerName()).toBe('テストユーザー')
  })
  it('空文字トリム → "ゲスト" として保存', () => {
    const result = savePlayerName('   ')
    expect(result).toBe('ゲスト')
    expect(getPlayerName()).toBe('ゲスト')
  })
  it('前後スペースをトリムして保存', () => {
    savePlayerName('  Alice  ')
    expect(getPlayerName()).toBe('Alice')
  })
})

// ── ランキング ────────────────────────────────────────────
describe('getRankings / saveScore', () => {
  it('未保存の場合は空配列', () => {
    expect(getRankings('easy')).toEqual([])
  })

  it('saveScore でエントリが追加される', () => {
    const entry = { name: 'A', score: 100, correct: 5, wrong: 1, maxCombo: 3, acc: 83, date: '2026/1/1', ts: 1000 }
    saveScore('easy', entry)
    const ranks = getRankings('easy')
    expect(ranks).toHaveLength(1)
    expect(ranks[0].name).toBe('A')
  })

  it('スコア降順でソートされる', () => {
    saveScore('easy', { name: 'B', score: 200, ts: 2000 })
    saveScore('easy', { name: 'A', score: 500, ts: 1000 })
    saveScore('easy', { name: 'C', score: 300, ts: 3000 })
    const ranks = getRankings('easy')
    expect(ranks[0].score).toBe(500)
    expect(ranks[1].score).toBe(300)
    expect(ranks[2].score).toBe(200)
  })

  it('同スコアの場合はts（古い順）で並ぶ', () => {
    saveScore('easy', { name: 'B', score: 100, ts: 2000 })
    saveScore('easy', { name: 'A', score: 100, ts: 1000 })
    const ranks = getRankings('easy')
    expect(ranks[0].name).toBe('A')  // 先に登録した方が上位
    expect(ranks[1].name).toBe('B')
  })

  it(`${RANK_MAX}件を超えると切り詰められる`, () => {
    for (let i = 0; i < RANK_MAX + 5; i++) {
      saveScore('easy', { name: `P${i}`, score: i * 10, ts: i })
    }
    expect(getRankings('easy')).toHaveLength(RANK_MAX)
  })

  it('saveScore が rank と total を返す', () => {
    const { rank, total } = saveScore('easy', { name: 'X', score: 999, ts: 1 })
    expect(rank).toBe(1)
    expect(total).toBe(1)
  })

  it('難易度別に独立して保存される', () => {
    saveScore('easy',   { name: 'E', score: 100, ts: 1 })
    saveScore('medium', { name: 'M', score: 200, ts: 2 })
    expect(getRankings('easy')).toHaveLength(1)
    expect(getRankings('medium')).toHaveLength(1)
    expect(getRankings('hard')).toHaveLength(0)
  })
})

describe('clearRankings', () => {
  it('diff 指定でその難易度のみ削除', () => {
    saveScore('easy',   { name: 'E', score: 100, ts: 1 })
    saveScore('medium', { name: 'M', score: 200, ts: 2 })
    clearRankings('easy')
    expect(getRankings('easy')).toHaveLength(0)
    expect(getRankings('medium')).toHaveLength(1)
  })
  it('diff 無指定で全難易度削除', () => {
    saveScore('easy',   { name: 'E', score: 100, ts: 1 })
    saveScore('medium', { name: 'M', score: 200, ts: 2 })
    saveScore('hard',   { name: 'H', score: 300, ts: 3 })
    clearRankings()
    expect(getRankings('easy')).toHaveLength(0)
    expect(getRankings('medium')).toHaveLength(0)
    expect(getRankings('hard')).toHaveLength(0)
  })
})

// ── プレイヤー統計 ────────────────────────────────────────
describe('getPlayerStats / savePlayerStats', () => {
  const SESSION = {
    '上書き保存': { c: 3, w: 1, cat: '基本操作' },
    'コピー':     { c: 2, w: 0, cat: '基本操作' },
  }

  it('初期状態は空のStats', () => {
    const stats = getPlayerStats('テスト')
    expect(stats.games).toBe(0)
    expect(stats.totalScore).toBe(0)
    expect(stats.totalCorrect).toBe(0)
    expect(stats.totalWrong).toBe(0)
  })

  it('savePlayerStats でゲーム数・スコアが累積される', () => {
    savePlayerStats('テスト', SESSION, 500)
    const stats = getPlayerStats('テスト')
    expect(stats.games).toBe(1)
    expect(stats.totalScore).toBe(500)
    expect(stats.bestScore).toBe(500)
  })

  it('複数回保存で累積される', () => {
    savePlayerStats('テスト', SESSION, 500)
    savePlayerStats('テスト', SESSION, 300)
    const stats = getPlayerStats('テスト')
    expect(stats.games).toBe(2)
    expect(stats.totalScore).toBe(800)
    expect(stats.bestScore).toBe(500)  // 最高スコアは500のまま
  })

  it('bestScore は最大値が保持される', () => {
    savePlayerStats('テスト', SESSION, 300)
    savePlayerStats('テスト', SESSION, 800)
    const stats = getPlayerStats('テスト')
    expect(stats.bestScore).toBe(800)
  })

  it('問題別正解・不正解が集計される', () => {
    savePlayerStats('テスト', SESSION, 500)
    const stats = getPlayerStats('テスト')
    expect(stats.questions['上書き保存'].c).toBe(3)
    expect(stats.questions['上書き保存'].w).toBe(1)
    expect(stats.totalCorrect).toBe(5)  // 3+2
    expect(stats.totalWrong).toBe(1)    // 1+0
  })

  it('プレイヤー名ごとに独立して保存される', () => {
    savePlayerStats('Alice', SESSION, 500)
    savePlayerStats('Bob',   SESSION, 300)
    expect(getPlayerStats('Alice').bestScore).toBe(500)
    expect(getPlayerStats('Bob').bestScore).toBe(300)
  })
})

// ── getCategoryStats ──────────────────────────────────────
describe('getCategoryStats', () => {
  it('カテゴリー別に集計される', () => {
    const stats = getPlayerStats('test-cat')
    stats.questions = {
      '操作A': { c: 8, w: 2, cat: '基本操作' },
      '操作B': { c: 3, w: 7, cat: '基本操作' },
      '操作C': { c: 5, w: 5, cat: '書式設定' },
    }
    const catStats = getCategoryStats(stats)
    const basic = catStats.find(c => c.cat === '基本操作')
    const fmt   = catStats.find(c => c.cat === '書式設定')
    expect(basic.c).toBe(11)
    expect(basic.w).toBe(9)
    expect(basic.total).toBe(20)
    expect(basic.acc).toBe(55)
    expect(fmt.acc).toBe(50)
  })
  it('正答率の低い順にソートされる', () => {
    const stats = getPlayerStats('test-sort')
    stats.questions = {
      'A': { c: 9, w: 1, cat: 'cat1' },  // acc 90
      'B': { c: 1, w: 9, cat: 'cat2' },  // acc 10
      'C': { c: 5, w: 5, cat: 'cat3' },  // acc 50
    }
    const catStats = getCategoryStats(stats)
    expect(catStats[0].acc).toBeLessThanOrEqual(catStats[1].acc)
    expect(catStats[1].acc).toBeLessThanOrEqual(catStats[2].acc)
  })
})

// ── getWeakQuestions ──────────────────────────────────────
describe('getWeakQuestions', () => {
  it('試行回数3回未満は除外される', () => {
    const stats = getPlayerStats('test-weak')
    stats.questions = {
      '頻度少': { c: 1, w: 1, cat: 'cat' },  // total 2 → 除外
      '頻度多': { c: 2, w: 4, cat: 'cat' },  // total 6 → 含む
    }
    const weak = getWeakQuestions(stats)
    expect(weak.find(q => q.op === '頻度少')).toBeUndefined()
    expect(weak.find(q => q.op === '頻度多')).toBeDefined()
  })
  it('最大10件に絞られる', () => {
    const stats = getPlayerStats('test-max')
    for (let i = 0; i < 15; i++) {
      stats.questions[`op${i}`] = { c: 1, w: 4, cat: 'cat' }  // total 5
    }
    const weak = getWeakQuestions(stats)
    expect(weak).toHaveLength(10)
  })
  it('正答率の低い順にソートされる', () => {
    const stats = getPlayerStats('test-weak-sort')
    stats.questions = {
      '高正答': { c: 9, w: 1, cat: 'cat' },  // acc 90
      '低正答': { c: 1, w: 9, cat: 'cat' },  // acc 10
    }
    const weak = getWeakQuestions(stats)
    expect(weak[0].op).toBe('低正答')
  })
})
