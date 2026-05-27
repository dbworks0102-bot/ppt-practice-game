// =========================================================
//  ランキング画面
// =========================================================
import { G } from '../core/state.js'
import { getRankings, clearRankings, getPlayerName } from '../core/storage.js'
import { escHtml } from '../utils/helpers.js'
import { showModal } from './modal.js'
import { showScreen, goTitle } from './screens.js'

export let currentRankDiff = 'easy'

export function showRanking(diff) {
  currentRankDiff    = diff || 'easy'
  G.rankFrom         = G.rankFrom || 'title'
  showScreen('ranking')
  document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'))
  document.querySelector('.rank-tab.' + currentRankDiff).classList.add('active')
  renderRankTable(currentRankDiff)
}

export function showRankTab(diff) {
  currentRankDiff = diff
  document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'))
  document.querySelector('.rank-tab.' + diff).classList.add('active')
  renderRankTable(diff)
}

export function rankBack() {
  if (G.rankFrom === 'result') {
    showScreen('result')
  } else {
    goTitle()
  }
}

export function renderRankTable(diff) {
  const wrap   = document.getElementById('rank-table-wrap')
  const ranks  = getRankings(diff)
  const myName = getPlayerName() || 'ゲスト'

  if (ranks.length === 0) {
    wrap.innerHTML = `
      <div class="rank-empty">
        <div class="rank-empty-icon">📋</div>
        まだ記録がありません<br>
        <small>ゲームをプレイしてランキングに登録しよう！</small>
      </div>`
    return
  }

  const medals = { 0: '🥇', 1: '🥈', 2: '🥉' }
  let html = `
    <div class="rank-row-header">
      <span>順位</span><span>名前</span>
      <span style="text-align:right">スコア</span>
      <span style="text-align:right">正解率</span>
      <span style="text-align:right">最大コンボ</span>
      <span style="text-align:right">日付</span>
    </div>`

  ranks.slice(0, 10).forEach((r, i) => {
    const posIcon = medals[i] ?? (i + 1)
    const isMine  = r.name === myName
    const rowCls  = isMine ? 'rank-row mine' : i < 3 ? `rank-row top${i + 1}` : 'rank-row'
    const youTag  = isMine ? '<span class="you-tag">YOU</span>' : ''
    html += `
      <div class="${rowCls}">
        <span class="rank-pos">${posIcon}</span>
        <span class="rank-name">${escHtml(r.name)}${youTag}</span>
        <span class="rank-score">${r.score.toLocaleString()}</span>
        <span class="rank-acc">${r.acc}%</span>
        <span class="rank-combo">${r.maxCombo}</span>
        <span class="rank-date">${r.date}</span>
      </div>`
  })
  wrap.innerHTML = html
}

export function confirmClearRanks() {
  showModal(
    '🗑', 'ランキングをクリア',
    '全難易度のランキングデータを\n削除します。よろしいですか？',
    '全削除する',
    () => { clearRankings(); renderRankTable(currentRankDiff) }
  )
}
