// =========================================================
//  ゲームロジック（状態管理・フロー制御・回答処理）
// =========================================================
import { G, initState }                         from './state.js'
import { SHORTCUTS, DIFF_CFG, EMOJIS_FIRE }     from '../data/shortcuts.js'
import { shuffle, pickChoices }                  from '../utils/helpers.js'
import { sndCorrect, sndCombo, sndWrong, sndTimeout } from '../utils/audio.js'
import { floatText, spawnParticles, showComboBurst, startBelt, stopBelt } from '../utils/effects.js'
import { getSpeedTier, calcScore, getGrade }     from './scoring.js'
import { getPlayerName, getHi, setHi, saveScore, savePlayerStats, savePlayerName } from './storage.js'
import { showModal }                             from '../ui/modal.js'
import { updateHUD, renderQ }                    from '../ui/hud.js'
import { showScreen, goTitle }                   from '../ui/screens.js'

// 問題タイマーバーのRAFフレームID
let qBarFrame = null

// =========================================================
//  問題タイマーバー（RAF）
// =========================================================
export function startQBar() {
  cancelAnimationFrame(qBarFrame)
  function tick() {
    if (G.paused || G.answered || !G.active) return
    const elapsed = (Date.now() - G.qStart) / 1000
    const pct     = Math.max(0, 1 - elapsed / G.qDur) * 100
    const bar     = document.getElementById('q-bar')
    if (bar) {
      bar.style.width = pct + '%'
      bar.className   = 'q-bar' + (pct < 30 ? ' danger' : '')
    }
    if (pct <= 0) { timeOut(); return }
    qBarFrame = requestAnimationFrame(tick)
  }
  qBarFrame = requestAnimationFrame(tick)
}

// =========================================================
//  時間ペナルティ
// =========================================================
export function applyTimePenalty(seconds) {
  G.timeLeft = Math.max(0, G.timeLeft - seconds)
  const el = document.getElementById('g-timer')
  el.textContent = G.timeLeft
  el.classList.remove('time-loss')
  void el.offsetWidth              // reflow でアニメーションリセット
  el.className = 'h-value time-loss' + (G.timeLeft <= 10 ? ' danger' : '')
  if (G.timeLeft <= 0) {
    setTimeout(() => { if (G.active) endGame() }, 1300)
  }
}

// =========================================================
//  問題ピック
// =========================================================
function availableShortcuts() {
  const lvs = DIFF_CFG[G.diff].lvs
  return SHORTCUTS.filter(s => lvs.includes(s.lv))
}

export function nextQ() {
  const pool = availableShortcuts()
  G.q        = pool[Math.floor(Math.random() * pool.length)]
  G.choices  = pickChoices(G.q)
  G.answered = false
  G.qDur     = DIFF_CFG[G.diff].dur
  G.qStart   = Date.now()
  renderQ(answer)   // hud.js に answer コールバックを渡す（循環依存を回避）
  startQBar()
}

// =========================================================
//  回答処理
// =========================================================
export function answer(idx) {
  if (G.answered || !G.active || G.paused) return
  G.answered = true
  cancelAnimationFrame(qBarFrame)

  const chosen     = G.choices[idx]
  const correct    = G.q
  const isOK       = chosen === correct
  const buttons    = document.querySelectorAll('.c-btn')
  const speedRatio = Math.max(0, 1 - (Date.now() - G.qStart) / 1000 / G.qDur)

  if (isOK) {
    G.combo++
    if (G.combo > G.maxCombo) G.maxCombo = G.combo
    G.correct++
    _trackStat(G.q, true)

    const tier = getSpeedTier(speedRatio)
    const pts  = calcScore(G.diff, tier, G.combo)
    G.score   += pts

    buttons[idx].classList.add('correct')
    document.getElementById('main-plate').className = 'main-plate correct-flash'
    floatText(`${tier.label}  +${pts}`, tier.color, window.innerWidth * .5 - 60, window.innerHeight * .38)
    sndCorrect()

    if (G.combo >= 3)  { showComboBurst(G.combo); sndCombo() }
    if (G.combo >= 5)  spawnParticles(6)
    if (G.combo >= 10) spawnParticles(12, EMOJIS_FIRE)

    updateHUD()
    setTimeout(() => { if (G.active && !G.paused) nextQ() }, 650)

  } else {
    G.combo = 0
    G.wrong++
    _trackStat(G.q, false)
    applyTimePenalty(2)

    buttons[idx].classList.add('wrong')
    buttons[G.choices.indexOf(correct)].classList.add('correct')
    document.getElementById('main-plate').className = 'main-plate wrong-flash'
    floatText('−2秒 ⏱', '#ff6b6b', window.innerWidth * .5 - 30, window.innerHeight * .38)
    sndWrong()
    updateHUD()
    buttons.forEach(b => b.disabled = true)
    setTimeout(() => { if (G.active && !G.paused && G.timeLeft > 0) nextQ() }, 1400)
  }
}

function timeOut() {
  if (!G.active || G.answered) return
  G.answered = true
  G.combo    = 0
  G.wrong++
  _trackStat(G.q, false)
  applyTimePenalty(2)

  const buttons = document.querySelectorAll('.c-btn')
  const ci = G.choices.indexOf(G.q)
  if (buttons[ci]) buttons[ci].classList.add('correct')
  buttons.forEach(b => b.disabled = true)

  floatText('時間切れ！ −2秒 ⏱', '#ff9f43', window.innerWidth * .5 - 70, window.innerHeight * .38)
  sndTimeout()
  updateHUD()
  setTimeout(() => { if (G.active && !G.paused && G.timeLeft > 0) nextQ() }, 1400)
}

/** セッション統計を記録（プライベート） */
function _trackStat(q, isCorrect) {
  const key = q.op
  if (!G.sessionStats[key]) G.sessionStats[key] = { c: 0, w: 0, cat: q.cat }
  if (isCorrect) G.sessionStats[key].c++
  else           G.sessionStats[key].w++
}

// =========================================================
//  ゲームタイマー（1秒カウントダウン）
// =========================================================
function startGameTimer() {
  clearInterval(G.t_game)
  G.t_game = setInterval(() => {
    if (G.paused || !G.active) return
    G.timeLeft--
    const el = document.getElementById('g-timer')
    el.textContent = G.timeLeft
    el.className   = 'h-value' + (G.timeLeft <= 10 ? ' danger' : '')
    if (G.timeLeft <= 0) endGame()
  }, 1000)
}

// =========================================================
//  ゲームフロー
// =========================================================
export function startGame() {
  const nameEl = document.getElementById('name-input')
  if (nameEl.value.trim()) savePlayerName(nameEl.value)

  initState()
  G.active = true
  showScreen('game')
  startBelt()
  updateHUD()
  document.getElementById('g-timer').textContent = '30'
  document.getElementById('g-timer').className   = 'h-value'
  startGameTimer()
  nextQ()
}

export function stopAll() {
  G.active = false
  G.paused = false
  clearInterval(G.t_game)
  cancelAnimationFrame(qBarFrame)
  stopBelt()
}

export function endGame() {
  stopAll()

  const sc      = G.score
  const grade   = getGrade(sc)
  const prev    = getHi()
  const newHi   = sc > prev
  if (newHi) setHi(sc)

  const total = G.correct + G.wrong
  const acc   = total > 0 ? Math.round(G.correct / total * 100) : 0
  const cfg   = DIFF_CFG[G.diff]
  const name  = getPlayerName() || 'ゲスト'

  const entry = { name, score: sc, correct: G.correct, wrong: G.wrong, maxCombo: G.maxCombo, acc, date: new Date().toLocaleDateString('ja-JP'), ts: Date.now() }
  const { rank, total: rankTotal } = saveScore(G.diff, entry)
  savePlayerStats(name, G.sessionStats, sc)

  const gradeEl = document.getElementById('r-grade')
  gradeEl.textContent = grade
  gradeEl.className   = 'r-grade ' + grade

  document.getElementById('r-score').textContent      = sc.toLocaleString() + ' 点'
  document.getElementById('r-difficulty').textContent = cfg.label
  document.getElementById('r-correct').textContent    = G.correct
  document.getElementById('r-wrong').textContent      = G.wrong
  document.getElementById('r-acc').textContent        = acc + '%'
  document.getElementById('r-maxcombo').textContent   = G.maxCombo

  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  document.getElementById('r-rank').textContent   = `${medals[rank] ?? '🏅'} ${rank}位 / ${rankTotal}人中`
  document.getElementById('r-newhs').style.display = newHi ? 'block' : 'none'

  showScreen('result')
  G.rankFrom = 'result'

  if (grade === 'S' || grade === 'A') {
    spawnParticles(12, EMOJIS_FIRE)
    setTimeout(() => spawnParticles(10), 400)
    setTimeout(() => spawnParticles(8),  800)
  }
}

// =========================================================
//  一時停止 / 再開
// =========================================================
export function pauseGame() {
  if (!G.active || G.paused) return
  G.paused   = true
  G.pausedAt = Date.now()
  cancelAnimationFrame(qBarFrame)
}

export function resumeGame() {
  if (!G.paused) return
  G.qStart  += Date.now() - G.pausedAt   // 一時停止分だけ開始時刻をずらす
  G.paused   = false
  if (!G.answered) startQBar()
}

// =========================================================
//  確認ダイアログ付きアクション
// =========================================================
export function confirmQuit() {
  if (!G.active) return
  pauseGame()
  showModal(
    '🚪', 'ゲームを終了しますか？',
    '現在のスコアは保存されません。\nホームに戻りますか？',
    'ホームへ戻る',
    () => { stopAll(); goTitle() },
    () => resumeGame()
  )
}

export function confirmRestart() {
  if (!G.active) return
  pauseGame()
  showModal(
    '🔄', 'やり直しますか？',
    '現在のスコアはリセットされます。\n最初からやり直しますか？',
    'やり直す',
    () => startGame(),
    () => resumeGame()
  )
}
