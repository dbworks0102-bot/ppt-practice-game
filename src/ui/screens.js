// =========================================================
//  画面切替・タイトル・難易度選択
// =========================================================
import { G } from '../core/state.js'
import { getHi } from '../core/storage.js'

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(id + '-screen').classList.add('active')
}

/** タイトル画面へ（stopAllはgame.jsの呼び出し元が事前に実行） */
export function goTitle() {
  showScreen('title')
  document.getElementById('hs-display').textContent = getHi().toLocaleString()
}

export function selectDiff(d) {
  G.diff = d
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'))
  document.querySelector('.diff-btn.' + d).classList.add('selected')
}
