// =========================================================
//  効果音（Web Audio API）
// =========================================================

let audioCtx = null

function ac() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function beep(freq, dur, type = 'sine', vol = 0.25) {
  try {
    const ctx  = ac()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch(e) {}
}

export function sndCorrect() {
  beep(523, .08)
  setTimeout(() => beep(659, .08),  80)
  setTimeout(() => beep(784, .15), 160)
}

export function sndCombo() {
  beep(1047, .06)
  setTimeout(() => beep(1319, .06),  60)
  setTimeout(() => beep(1568, .12), 120)
}

export function sndWrong()   { beep(180, .3, 'sawtooth', .15) }
export function sndTimeout() { beep(220, .2, 'triangle', .12) }
