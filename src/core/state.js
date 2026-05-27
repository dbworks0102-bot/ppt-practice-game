// =========================================================
//  ゲーム状態 — ライブバインディングで全モジュールが共有
// =========================================================

export let G = {}

export function initState() {
  G = {
    diff:        G.diff     || 'easy',
    rankFrom:    G.rankFrom || 'title',
    score:       0,
    combo:       0,
    maxCombo:    0,
    timeLeft:    30,
    correct:     0,
    wrong:       0,
    active:      false,
    paused:      false,
    pausedAt:    0,
    q:           null,
    choices:     [],
    answered:    false,
    qStart:      0,
    qDur:        0,
    t_game:      null,
    sessionStats: {},
  }
}
