// =========================================================
//  ビジュアルエフェクト（パーティクル・フロートテキスト・ベルト）
// =========================================================
import { EMOJIS_CORRECT } from '../data/shortcuts.js'

/** スコアなどを画面に浮かび上がらせる */
export function floatText(txt, color, x, y) {
  const el = document.createElement('div')
  el.className = 'popup'
  el.textContent = txt
  el.style.cssText = `color:${color};font-size:1.4rem;left:${x}px;top:${y}px;`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1000)
}

/** コンボ数を画面中央に大きく表示 */
export function showComboBurst(combo) {
  const el = document.createElement('div')
  el.className = 'combo-burst'
  if      (combo >= 10) { el.textContent = `🔥 ${combo} COMBO!!`; el.style.color = '#ff6b35' }
  else if (combo >= 5)  { el.textContent = `⚡ ${combo} COMBO!`;  el.style.color = '#ffd700' }
  else                  { el.textContent = `✨ ${combo} COMBO`;   el.style.color = '#f4a261' }
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 900)
}

/** 絵文字パーティクルを飛ばす */
export function spawnParticles(count = 8, emojis = EMOJIS_CORRECT) {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div')
      p.className = 'particle'
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      const angle = Math.random() * 2 * Math.PI
      const dist  = 100 + Math.random() * 150
      p.style.cssText = [
        `left:${cx + (Math.random() - .5) * 200}px`,
        `top:${cy  + (Math.random() - .5) * 120}px`,
        `--dx:${Math.cos(angle) * dist}px`,
        `--dy:${Math.sin(angle) * dist - 80}px`,
        `--dr:${(Math.random() - .5) * 360}deg`,
      ].join(';')
      document.body.appendChild(p)
      setTimeout(() => p.remove(), 1400)
    }, i * 80)
  }
}

// ── コンベアベルト ──
let beltInterval = null

export function startBelt() {
  const belt = document.getElementById('belt-strip')
  belt.innerHTML = ''
  clearInterval(beltInterval)

  function spawnMini() {
    const m = document.createElement('div')
    m.className = 'mini-plate'
    m.textContent = EMOJIS_CORRECT[Math.floor(Math.random() * EMOJIS_CORRECT.length)]
    const dur = 6 + Math.random() * 5
    m.style.animationDuration = dur + 's'
    belt.appendChild(m)
    setTimeout(() => m.remove(), dur * 1000 + 500)
  }
  spawnMini()
  beltInterval = setInterval(spawnMini, 2000)
}

export function stopBelt() { clearInterval(beltInterval) }
