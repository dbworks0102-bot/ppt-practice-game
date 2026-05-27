// =========================================================
//  モーダルダイアログ
// =========================================================

let _modalCallback = null
export let _modalCancelCb = null   // Escapeキー用にmain.jsからも参照

export function showModal(icon, title, msg, goLabel, onGo, onCancel) {
  document.getElementById('modal-icon').textContent  = icon
  document.getElementById('modal-title').textContent = title
  document.getElementById('modal-msg').textContent   = msg
  document.getElementById('modal-go').textContent    = goLabel
  _modalCallback = onGo
  _modalCancelCb = onCancel || null
  document.getElementById('modal-overlay').classList.add('open')
}

export function hideModal() {
  document.getElementById('modal-overlay').classList.remove('open')
}

/** ボタンへのイベントリスナーを設定（main.jsで1回だけ呼ぶ） */
export function initModal() {
  document.getElementById('modal-go').addEventListener('click', () => {
    hideModal()
    if (_modalCallback) _modalCallback()
  })
  document.getElementById('modal-cancel').addEventListener('click', () => {
    hideModal()
    if (_modalCancelCb) _modalCancelCb()
  })
}
