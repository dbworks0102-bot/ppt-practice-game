// =========================================================
//  localStorage 操作（ハイスコア・名前・ランキング・統計）
// =========================================================

// ── ハイスコア ──
export function getHi()  { return parseInt(localStorage.getItem('ppt-dojo-hi') || '0') }
export function setHi(v) { localStorage.setItem('ppt-dojo-hi', v) }

// ── プレイヤー名 ──
export function getPlayerName() {
  return localStorage.getItem('ppt-dojo-name') || ''
}
export function savePlayerName(name) {
  const n = name.trim() || 'ゲスト'
  localStorage.setItem('ppt-dojo-name', n)
  return n
}

// ── ランキング ──
export const RANK_MAX = 20

export function getRankKey(diff) { return 'ppt-dojo-ranks-' + diff }

export function getRankings(diff) {
  try { return JSON.parse(localStorage.getItem(getRankKey(diff)) || '[]') }
  catch(e) { return [] }
}

export function saveScore(diff, entry) {
  let ranks = getRankings(diff)
  ranks.push(entry)
  ranks.sort((a, b) => b.score - a.score || a.ts - b.ts)
  if (ranks.length > RANK_MAX) ranks = ranks.slice(0, RANK_MAX)
  localStorage.setItem(getRankKey(diff), JSON.stringify(ranks))
  return { rank: ranks.indexOf(entry) + 1, total: ranks.length }
}

export function clearRankings(diff) {
  if (diff) {
    localStorage.removeItem(getRankKey(diff))
  } else {
    ;['easy', 'medium', 'hard'].forEach(d => localStorage.removeItem(getRankKey(d)))
  }
}

// ── プレイヤー統計（マイページ） ──
export function getStatsKey(name) { return 'ppt-dojo-mystats-' + (name || 'ゲスト') }

export function getPlayerStats(name) {
  try {
    return JSON.parse(localStorage.getItem(getStatsKey(name)) || 'null') || _emptyStats()
  } catch(e) { return _emptyStats() }
}

function _emptyStats() {
  return { games: 0, totalScore: 0, bestScore: 0, totalCorrect: 0, totalWrong: 0, questions: {} }
}

export function savePlayerStats(name, sessionStats, score) {
  const stats = getPlayerStats(name)
  stats.games++
  stats.totalScore += score
  if (score > stats.bestScore) stats.bestScore = score

  Object.entries(sessionStats).forEach(([op, s]) => {
    if (!stats.questions[op]) stats.questions[op] = { c: 0, w: 0, cat: s.cat }
    stats.questions[op].c += s.c
    stats.questions[op].w += s.w
  })
  stats.totalCorrect = Object.values(stats.questions).reduce((sum, q) => sum + q.c, 0)
  stats.totalWrong   = Object.values(stats.questions).reduce((sum, q) => sum + q.w, 0)
  localStorage.setItem(getStatsKey(name), JSON.stringify(stats))
}

export function getCategoryStats(stats) {
  const cats = {}
  Object.entries(stats.questions).forEach(([, s]) => {
    const cat = s.cat || '不明'
    if (!cats[cat]) cats[cat] = { c: 0, w: 0 }
    cats[cat].c += s.c
    cats[cat].w += s.w
  })
  return Object.entries(cats)
    .map(([cat, s]) => ({
      cat, c: s.c, w: s.w,
      total: s.c + s.w,
      acc: s.c + s.w > 0 ? Math.round(s.c / (s.c + s.w) * 100) : 0,
    }))
    .sort((a, b) => a.acc - b.acc)
}

export function getWeakQuestions(stats, minAttempts = 3) {
  return Object.entries(stats.questions)
    .map(([op, s]) => ({
      op, cat: s.cat, c: s.c, w: s.w,
      total: s.c + s.w,
      acc: s.c + s.w > 0 ? Math.round(s.c / (s.c + s.w) * 100) : 0,
    }))
    .filter(q => q.total >= minAttempts)
    .sort((a, b) => a.acc - b.acc || b.total - a.total)
    .slice(0, 10)
}
