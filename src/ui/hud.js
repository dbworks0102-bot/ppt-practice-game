// =========================================================
//  HUD（スコア・タイマー・コンボ・ストリーク・問題表示）
// =========================================================
import { G } from '../core/state.js'
import { keysHTML } from '../utils/helpers.js'

export function updateHUD() {
  document.getElementById('g-score').textContent = G.score.toLocaleString()
  const comboEl = document.getElementById('g-combo')
  comboEl.textContent = G.combo
  comboEl.style.color =
    G.combo >= 10 ? '#ff6b35' :
    G.combo >=  5 ? '#ffd700' :
    G.combo >=  3 ? '#f4a261' : '#e63946'
  renderStreak()
}

export function renderStreak() {
  const row = document.getElementById('streak-row')
  row.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    const d    = document.createElement('div')
    const on   = i < G.combo
    const fire = G.combo >= 10 && on
    d.className = 'streak-dot' + (on ? (fire ? ' fire' : ' on') : '')
    row.appendChild(d)
  }
}

/**
 * 現在の問題を描画する
 * @param {function} onAnswer - 選択肢ボタンが押された時のコールバック (idx: number) => void
 */
export function renderQ(onAnswer) {
  const q     = G.q
  const plate = document.getElementById('main-plate')
  plate.className = 'main-plate pulse'
  document.getElementById('plate-cat').textContent = q.cat

  const opEl = document.getElementById('plate-op')
  opEl.textContent = q.op
  opEl.className   = 'plate-op' + (q.op.length > 8 ? ' long' : '')

  const container = document.getElementById('choices')
  container.innerHTML = ''
  G.choices.forEach((c, i) => {
    const btn = document.createElement('button')
    btn.className = 'c-btn'
    btn.innerHTML = `<span class="c-num">${i + 1}</span><span class="key-chips">${keysHTML(c.keys)}</span>`
    btn.addEventListener('click', () => onAnswer(i))
    container.appendChild(btn)
  })

  document.getElementById('q-bar').style.width = '100%'
  document.getElementById('q-bar').className   = 'q-bar'
  renderStreak()
}
