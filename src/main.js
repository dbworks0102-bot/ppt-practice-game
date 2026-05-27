// =========================================================
//  main.js — エントリポイント
//  HTMLのonclick属性はモジュールスコープを参照できないため
//  window に公開してグローバルアクセスを可能にする
// =========================================================
import { G }                                   from './core/state.js'
import { getPlayerName, savePlayerName, getHi } from './core/storage.js'
import { initModal, hideModal, _modalCancelCb } from './ui/modal.js'
import { selectDiff, goTitle }                  from './ui/screens.js'
import { startGame, confirmQuit, confirmRestart, answer } from './core/game.js'
import { showRanking, showRankTab, rankBack, confirmClearRanks } from './ui/ranking.js'
import { showMyPage, mpBack, confirmResetStats } from './ui/mypage.js'

// =========================================================
//  HTMLから呼び出せるようにwindowへ公開
// =========================================================
Object.assign(window, {
  startGame,
  confirmQuit,
  confirmRestart,
  selectDiff,
  goTitle,
  showRanking,
  showRankTab,
  rankBack,
  confirmClearRanks,
  showMyPage,
  mpBack,
  confirmResetStats,
  // リザルト画面の「ランキング」ボタン: onclick="showRankingCurrent()"
  showRankingCurrent: () => showRanking(G.diff),
})

// =========================================================
//  キーボード操作
// =========================================================
document.addEventListener('keydown', e => {
  // 1〜4 キーで回答
  if (['1', '2', '3', '4'].includes(e.key)) {
    e.preventDefault()
    answer(parseInt(e.key) - 1)
  }
  // Enter でゲームスタート（タイトル画面のみ）
  if (e.key === 'Enter') {
    if (document.getElementById('title-screen').classList.contains('active')) startGame()
  }
  // Escape でモーダルをキャンセル
  if (e.key === 'Escape') {
    if (document.getElementById('modal-overlay').classList.contains('open')) {
      const cb = _modalCancelCb   // ライブバインディングで現在値を取得
      hideModal()
      if (cb) cb()
    }
  }
})

// =========================================================
//  モーダルのボタンイベント初期化
// =========================================================
initModal()

// =========================================================
//  初期化
// =========================================================
G.diff     = 'easy'
G.rankFrom = 'title'

const savedName = getPlayerName()
if (savedName) document.getElementById('name-input').value = savedName

document.getElementById('name-input').addEventListener('blur', function () {
  if (this.value.trim()) savePlayerName(this.value)
})
document.getElementById('name-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') this.blur()
})

document.getElementById('hs-display').textContent = getHi().toLocaleString()
