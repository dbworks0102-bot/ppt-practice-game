// =========================================================
//  マイページ画面（プレイヤー統計・カテゴリー別・苦手問題）
// =========================================================
import { getPlayerName, getPlayerStats, getStatsKey, getCategoryStats, getWeakQuestions } from '../core/storage.js'
import { escHtml } from '../utils/helpers.js'
import { showModal } from './modal.js'
import { showScreen, goTitle } from './screens.js'

let _mpFrom = 'title'

export function showMyPage(from) {
  _mpFrom = from || 'title'
  const name = getPlayerName() || 'ゲスト'
  renderMyPage(name)
  showScreen('mypage')
}

export function mpBack() {
  if (_mpFrom === 'result') {
    showScreen('result')
  } else {
    goTitle()
  }
}

export function renderMyPage(name) {
  const stats    = getPlayerStats(name)
  const catStats = getCategoryStats(stats)
  const weakQs   = getWeakQuestions(stats)
  const avgScore = stats.games > 0 ? Math.round(stats.totalScore / stats.games) : 0
  const totalAtt = stats.totalCorrect + stats.totalWrong
  const totalAcc = totalAtt > 0 ? Math.round(stats.totalCorrect / totalAtt * 100) : 0

  let html = `<div style="font-size:0.78rem;color:var(--muted);margin-bottom:1.2rem;">
    <strong style="color:#a78bfa;font-size:1rem;">${escHtml(name)}</strong> さんの成績
  </div>`

  // ── 総合成績グリッド ──
  html += `<div class="mp-overview">
    <div class="mp-stat-card games">
      <div class="sv">${stats.games}</div><div class="sl">🎮 ゲーム数</div>
    </div>
    <div class="mp-stat-card best">
      <div class="sv">${stats.bestScore.toLocaleString()}</div><div class="sl">🏆 最高スコア</div>
    </div>
    <div class="mp-stat-card avg">
      <div class="sv">${avgScore.toLocaleString()}</div><div class="sl">📊 平均スコア</div>
    </div>
    <div class="mp-stat-card acc">
      <div class="sv">${totalAcc}%</div><div class="sl">🎯 通算正答率</div>
    </div>
    <div class="mp-stat-card correct">
      <div class="sv">${stats.totalCorrect}</div><div class="sl">✅ 通算正解数</div>
    </div>
    <div class="mp-stat-card wrong">
      <div class="sv">${stats.totalWrong}</div><div class="sl">❌ 通算不正解数</div>
    </div>
  </div>`

  // ── カテゴリー別正答率バーチャート ──
  html += `<div class="mp-section-title">📁 カテゴリー別正答率</div>`
  if (catStats.length === 0) {
    html += `<div class="mp-empty">まだデータがありません。<br>ゲームをプレイしてみよう！</div>`
  } else {
    catStats.forEach(c => {
      const color = _accColor(c.acc)
      html += `
        <div class="mp-cat-bar-row">
          <div class="mp-cat-name">${escHtml(c.cat)}</div>
          <div class="mp-cat-bar-bg">
            <div class="mp-cat-bar-fill" style="width:${c.acc}%;background:${color};"></div>
          </div>
          <div class="mp-cat-pct" style="color:${color}">${c.acc}%</div>
          <div class="mp-cat-count">${c.c}/${c.total}問</div>
        </div>`
    })
  }

  // ── 苦手な問題 TOP10 ──
  html += `<div class="mp-section-title" style="margin-top:1.6rem;">
    ⚠️ 苦手な問題 TOP10
    <small style="font-weight:400;font-size:0.68rem;margin-left:0.4rem;">(3回以上回答した問題を正答率の低い順に表示)</small>
  </div>`
  if (weakQs.length === 0) {
    html += `<div class="mp-empty">まだ十分なデータがありません。<br>各問題を3回以上回答すると表示されます。</div>`
  } else {
    html += `
      <div style="display:grid;grid-template-columns:1fr 80px 70px;gap:0.5rem;
        padding:0.3rem 0.9rem;margin-bottom:0.3rem;font-size:0.65rem;
        color:var(--muted);letter-spacing:0.08em;">
        <span>操作名</span>
        <span style="text-align:right">正答率</span>
        <span style="text-align:right">試行回数</span>
      </div>`
    weakQs.forEach(q => {
      const color = _accColor(q.acc)
      html += `
        <div class="mp-weak-row">
          <div>
            <div class="mp-weak-op">${escHtml(q.op)}</div>
            <div class="mp-weak-cat">${escHtml(q.cat)}</div>
          </div>
          <div class="mp-weak-acc" style="color:${color}">${q.acc}%</div>
          <div class="mp-weak-tries">${q.total}回</div>
        </div>`
    })
  }

  document.getElementById('mp-content').innerHTML = html
}

export function confirmResetStats() {
  const name = getPlayerName() || 'ゲスト'
  showModal(
    '🗑', 'データをリセット',
    `${name} さんのマイページデータを\n全て削除します。よろしいですか？`,
    '削除する',
    () => { localStorage.removeItem(getStatsKey(name)); renderMyPage(name) }
  )
}

// ── プライベートヘルパー ──
function _accColor(acc) {
  if (acc >= 80) return 'var(--teal)'
  if (acc >= 60) return '#f4a261'
  if (acc >= 40) return '#e07030'
  return 'var(--red)'
}
