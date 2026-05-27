// =========================================================
//  ショートカットデータ（問題データ・難易度設定・絵文字）
// =========================================================

export const SHORTCUTS = [
  // ─── 基本操作 ───
  { op: "上書き保存",                    keys: ["Ctrl","S"],             cat: "基本操作",       lv: 1 },
  { op: "元に戻す",                      keys: ["Ctrl","Z"],             cat: "基本操作",       lv: 1 },
  { op: "コピー",                        keys: ["Ctrl","C"],             cat: "基本操作",       lv: 1 },
  { op: "貼り付け",                      keys: ["Ctrl","V"],             cat: "基本操作",       lv: 1 },
  { op: "切り取り",                      keys: ["Ctrl","X"],             cat: "基本操作",       lv: 1 },
  { op: "すべて選択",                    keys: ["Ctrl","A"],             cat: "基本操作",       lv: 1 },
  { op: "印刷",                          keys: ["Ctrl","P"],             cat: "基本操作",       lv: 1 },
  { op: "新規作成",                      keys: ["Ctrl","N"],             cat: "基本操作",       lv: 1 },
  { op: "ファイルを開く",                keys: ["Ctrl","O"],             cat: "基本操作",       lv: 1 },
  { op: "複製する",                      keys: ["Ctrl","D"],             cat: "基本操作",       lv: 1 },
  { op: "テキストを検索",                keys: ["Ctrl","F"],             cat: "基本操作",       lv: 1 },
  { op: "ヘルプを表示",                  keys: ["F1"],                   cat: "基本操作",       lv: 1 },
  { op: "やり直す (Redo)",               keys: ["Ctrl","Y"],             cat: "基本操作",       lv: 2 },
  { op: "名前を付けて保存",              keys: ["Ctrl","Shift","S"],     cat: "基本操作",       lv: 2 },
  { op: "名前を付けて保存 (F12)",        keys: ["F12"],                  cat: "基本操作",       lv: 2 },
  { op: "ファイルを閉じる",              keys: ["Ctrl","W"],             cat: "基本操作",       lv: 2 },
  { op: "PowerPointを終了",              keys: ["Ctrl","Q"],             cat: "基本操作",       lv: 2 },
  { op: "文字を置換",                    keys: ["Ctrl","H"],             cat: "基本操作",       lv: 2 },
  { op: "ハイパーリンクを挿入",          keys: ["Ctrl","K"],             cat: "基本操作",       lv: 2 },
  { op: "書式のコピー",                  keys: ["Ctrl","Shift","C"],     cat: "基本操作",       lv: 2 },
  { op: "書式の貼り付け",               keys: ["Ctrl","Shift","V"],     cat: "基本操作",       lv: 2 },
  { op: "スペルチェック",                keys: ["F7"],                   cat: "基本操作",       lv: 2 },
  { op: "最後の操作を繰り返す",          keys: ["F4"],                   cat: "基本操作",       lv: 3 },
  { op: "シソーラスを表示",              keys: ["Shift","F7"],           cat: "基本操作",       lv: 3 },
  { op: "形式を選択して貼り付け",        keys: ["Ctrl","Alt","V"],       cat: "基本操作",       lv: 3 },
  { op: "印刷プレビューを表示",          keys: ["Ctrl","F2"],            cat: "基本操作",       lv: 3 },

  // ─── テキスト書式 ───
  { op: "太字にする",                    keys: ["Ctrl","B"],             cat: "テキスト書式",   lv: 1 },
  { op: "斜体にする",                    keys: ["Ctrl","I"],             cat: "テキスト書式",   lv: 1 },
  { op: "下線を引く",                    keys: ["Ctrl","U"],             cat: "テキスト書式",   lv: 1 },
  { op: "フォントサイズを大きく",        keys: ["Ctrl","Shift",">"],     cat: "テキスト書式",   lv: 2 },
  { op: "フォントサイズを小さく",        keys: ["Ctrl","Shift","<"],     cat: "テキスト書式",   lv: 2 },
  { op: "大文字・小文字を切り替え",      keys: ["Shift","F3"],           cat: "テキスト書式",   lv: 2 },
  { op: "テキスト書式をクリア",          keys: ["Ctrl","Space"],         cat: "テキスト書式",   lv: 2 },
  { op: "テキスト編集モードへ",          keys: ["F2"],                   cat: "テキスト書式",   lv: 2 },
  { op: "フォントを1pt大きく",           keys: ["Ctrl","]"],             cat: "テキスト書式",   lv: 3 },
  { op: "フォントを1pt小さく",           keys: ["Ctrl","["],             cat: "テキスト書式",   lv: 3 },
  { op: "上付き文字にする",              keys: ["Ctrl","Shift","+"],     cat: "テキスト書式",   lv: 3 },
  { op: "下付き文字にする",              keys: ["Ctrl","="],             cat: "テキスト書式",   lv: 3 },
  { op: "フォントダイアログを開く",      keys: ["Ctrl","T"],             cat: "テキスト書式",   lv: 3 },

  // ─── 段落・配置 ───
  { op: "左揃え",                        keys: ["Ctrl","L"],             cat: "段落・配置",     lv: 2 },
  { op: "中央揃え",                      keys: ["Ctrl","E"],             cat: "段落・配置",     lv: 2 },
  { op: "右揃え",                        keys: ["Ctrl","R"],             cat: "段落・配置",     lv: 2 },
  { op: "両端揃え",                      keys: ["Ctrl","J"],             cat: "段落・配置",     lv: 2 },
  { op: "行間を1行にする",               keys: ["Ctrl","1"],             cat: "段落・配置",     lv: 3 },
  { op: "行間を1.5行にする",             keys: ["Ctrl","5"],             cat: "段落・配置",     lv: 3 },
  { op: "行間を2行にする",               keys: ["Ctrl","2"],             cat: "段落・配置",     lv: 3 },

  // ─── スライド操作 ───
  { op: "新しいスライドを追加",          keys: ["Ctrl","M"],             cat: "スライド操作",   lv: 1 },
  { op: "次のスライドへ",                keys: ["Page Down"],            cat: "スライド操作",   lv: 1 },
  { op: "前のスライドへ",                keys: ["Page Up"],              cat: "スライド操作",   lv: 1 },
  { op: "スライドを削除する",            keys: ["Delete"],               cat: "スライド操作",   lv: 2 },
  { op: "最初のスライドへ移動",          keys: ["Ctrl","Home"],          cat: "スライド操作",   lv: 2 },
  { op: "最後のスライドへ移動",          keys: ["Ctrl","End"],           cat: "スライド操作",   lv: 2 },

  // ─── スライドショー ───
  { op: "スライドショーを開始（最初から）", keys: ["F5"],               cat: "スライドショー", lv: 1 },
  { op: "現在のスライドから開始",        keys: ["Shift","F5"],           cat: "スライドショー", lv: 1 },
  { op: "スライドショーを終了",          keys: ["Esc"],                  cat: "スライドショー", lv: 1 },
  { op: "次のスライドへ進む（SS中）",            keys: ["Enter"],                cat: "スライドショー", lv: 1 },
  { op: "次のスライドへ進む・スペース（SS中）",  keys: ["Space"],                cat: "スライドショー", lv: 2 },
  { op: "次のスライドへ進む・右矢印（SS中）",    keys: ["→"],                    cat: "スライドショー", lv: 2 },
  { op: "次のスライドへ進む・下矢印（SS中）",    keys: ["↓"],                    cat: "スライドショー", lv: 2 },
  { op: "次のアニメーションを進める（SS中）",    keys: ["N"],                    cat: "スライドショー", lv: 2 },
  { op: "前のスライドへ戻る（SS中）",            keys: ["Backspace"],            cat: "スライドショー", lv: 2 },
  { op: "前のスライドへ戻る・左矢印（SS中）",    keys: ["←"],                    cat: "スライドショー", lv: 2 },
  { op: "前のスライドへ戻る・上矢印（SS中）",    keys: ["↑"],                    cat: "スライドショー", lv: 2 },
  { op: "前のアニメーションへ戻る（SS中）", keys: ["P"],                 cat: "スライドショー", lv: 2 },
  { op: "最初のスライドへ（SS中）",      keys: ["Home"],                 cat: "スライドショー", lv: 2 },
  { op: "最後のスライドへ（SS中）",      keys: ["End"],                  cat: "スライドショー", lv: 2 },
  { op: "画面を黒にする（SS中）",        keys: ["B"],                    cat: "スライドショー", lv: 2 },
  { op: "画面を白にする（SS中）",        keys: ["W"],                    cat: "スライドショー", lv: 2 },
  { op: "発表者ビューを表示",            keys: ["Alt","F5"],             cat: "スライドショー", lv: 3 },
  { op: "ペンに切り替え（SS中）",        keys: ["Ctrl","P"],             cat: "スライドショー", lv: 2 },
  { op: "矢印ポインターに戻す（SS中）",  keys: ["Ctrl","A"],             cat: "スライドショー", lv: 3 },
  { op: "消しゴムに切り替え（SS中）",    keys: ["Ctrl","E"],             cat: "スライドショー", lv: 3 },
  { op: "書き込みを全消去（SS中）",      keys: ["E"],                    cat: "スライドショー", lv: 3 },
  { op: "レーザーポインター（SS中）",    keys: ["Ctrl","L"],             cat: "スライドショー", lv: 3 },
  { op: "蛍光ペン（SS中）",              keys: ["Ctrl","I"],             cat: "スライドショー", lv: 3 },
  { op: "スライド一覧表示に切り替え（SS中）", keys: ["Ctrl","-"],        cat: "スライドショー", lv: 3 },
  { op: "マウスカーソルを隠す（SS中）",  keys: ["A"],                    cat: "スライドショー", lv: 3 },
  { op: "スライドショー中のヘルプ",      keys: ["F1"],                   cat: "スライドショー", lv: 2 },

  // ─── オブジェクト操作 ───
  { op: "グループ化する",                keys: ["Ctrl","G"],             cat: "オブジェクト操作", lv: 2 },
  { op: "グループを解除する",            keys: ["Ctrl","Shift","G"],     cat: "オブジェクト操作", lv: 2 },
  { op: "1つ前面に移動する",             keys: ["Ctrl","]"],             cat: "オブジェクト操作", lv: 2 },
  { op: "1つ背面に移動する",             keys: ["Ctrl","["],             cat: "オブジェクト操作", lv: 2 },
  { op: "最前面に移動する",              keys: ["Ctrl","Shift","]"],     cat: "オブジェクト操作", lv: 3 },
  { op: "最背面に移動する",              keys: ["Ctrl","Shift","["],     cat: "オブジェクト操作", lv: 3 },
  { op: "次のオブジェクトを選択",        keys: ["Tab"],                  cat: "オブジェクト操作", lv: 2 },
  { op: "前のオブジェクトを選択",        keys: ["Shift","Tab"],          cat: "オブジェクト操作", lv: 2 },
  { op: "アニメーションをコピー",        keys: ["Alt","Shift","C"],      cat: "オブジェクト操作", lv: 3 },
  { op: "アニメーションを貼り付け",      keys: ["Alt","Shift","V"],      cat: "オブジェクト操作", lv: 3 },

  // ─── カーソル移動 ───
  { op: "1単語右へ移動",                 keys: ["Ctrl","→"],             cat: "カーソル移動",   lv: 2 },
  { op: "1単語左へ移動",                 keys: ["Ctrl","←"],             cat: "カーソル移動",   lv: 2 },
  { op: "行頭へ移動",                    keys: ["Home"],                 cat: "カーソル移動",   lv: 2 },
  { op: "行末へ移動",                    keys: ["End"],                  cat: "カーソル移動",   lv: 2 },
  { op: "テキストボックスの先頭へ",      keys: ["Ctrl","Home"],          cat: "カーソル移動",   lv: 3 },
  { op: "テキストボックスの末尾へ",      keys: ["Ctrl","End"],           cat: "カーソル移動",   lv: 3 },
  { op: "段落の先頭へ移動",              keys: ["Ctrl","↑"],             cat: "カーソル移動",   lv: 3 },
  { op: "段落の末尾へ移動",              keys: ["Ctrl","↓"],             cat: "カーソル移動",   lv: 3 },

  // ─── テキスト選択 ───
  { op: "1文字右を選択",                 keys: ["Shift","→"],            cat: "テキスト選択",   lv: 2 },
  { op: "1文字左を選択",                 keys: ["Shift","←"],            cat: "テキスト選択",   lv: 2 },
  { op: "1行上まで選択",                 keys: ["Shift","↑"],            cat: "テキスト選択",   lv: 2 },
  { op: "1行下まで選択",                 keys: ["Shift","↓"],            cat: "テキスト選択",   lv: 2 },
  { op: "1単語右を選択",                 keys: ["Ctrl","Shift","→"],     cat: "テキスト選択",   lv: 2 },
  { op: "1単語左を選択",                 keys: ["Ctrl","Shift","←"],     cat: "テキスト選択",   lv: 2 },
  { op: "行頭まで選択",                  keys: ["Shift","Home"],         cat: "テキスト選択",   lv: 2 },
  { op: "行末まで選択",                  keys: ["Shift","End"],          cat: "テキスト選択",   lv: 2 },
  { op: "テキストボックスの先頭まで選択", keys: ["Ctrl","Shift","Home"], cat: "テキスト選択",   lv: 3 },
  { op: "テキストボックスの末尾まで選択", keys: ["Ctrl","Shift","End"],  cat: "テキスト選択",   lv: 3 },

  // ─── アウトライン操作 ───
  { op: "アウトラインで階層を下げる",    keys: ["Tab"],                  cat: "アウトライン",   lv: 2 },
  { op: "アウトラインで階層を上げる",    keys: ["Shift","Tab"],          cat: "アウトライン",   lv: 2 },
  { op: "アウトラインで段落を上へ移動",  keys: ["Alt","Shift","↑"],      cat: "アウトライン",   lv: 3 },
  { op: "アウトラインで段落を下へ移動",  keys: ["Alt","Shift","↓"],      cat: "アウトライン",   lv: 3 },
  { op: "アウトラインで見出し1に設定",   keys: ["Alt","Shift","1"],      cat: "アウトライン",   lv: 3 },
  { op: "アウトラインで見出し2に設定",   keys: ["Alt","Shift","2"],      cat: "アウトライン",   lv: 3 },
  { op: "アウトラインで見出し3に設定",   keys: ["Alt","Shift","3"],      cat: "アウトライン",   lv: 3 },

  // ─── 表操作 ───
  { op: "表の次のセルへ移動",            keys: ["Tab"],                  cat: "表操作",         lv: 2 },
  { op: "表の前のセルへ移動",            keys: ["Shift","Tab"],          cat: "表操作",         lv: 2 },
  { op: "表の行の最初のセルへ",          keys: ["Alt","Home"],           cat: "表操作",         lv: 3 },
  { op: "表の行の最後のセルへ",          keys: ["Alt","End"],            cat: "表操作",         lv: 3 },
  { op: "表の先頭行の最初のセルへ",      keys: ["Alt","Page Up"],        cat: "表操作",         lv: 3 },
  { op: "表の最終行の最後のセルへ",      keys: ["Alt","Page Down"],      cat: "表操作",         lv: 3 },

  // ─── ビュー・表示 ───
  { op: "リボンを表示/非表示",           keys: ["Ctrl","F1"],            cat: "ビュー・表示",   lv: 3 },
  { op: "グリッドを表示/非表示",         keys: ["Shift","F9"],           cat: "ビュー・表示",   lv: 3 },
  { op: "ガイドを表示/非表示",           keys: ["Alt","F9"],             cat: "ビュー・表示",   lv: 3 },
  { op: "リボンのキーヒントを表示",      keys: ["F10"],                  cat: "ビュー・表示",   lv: 3 },
  { op: "全画面表示の切り替え",          keys: ["Alt","F10"],            cat: "ビュー・表示",   lv: 3 },
  { op: "マクロダイアログを開く",        keys: ["Alt","F8"],             cat: "ビュー・表示",   lv: 3 },
  { op: "VBAエディタを開く",             keys: ["Alt","F11"],            cat: "ビュー・表示",   lv: 3 },

  // ─── 追加：基本操作 Lv.1/2 ───
  { op: "アプリを終了",                 keys: ["Alt","F4"],             cat: "基本操作",       lv: 1 },
  { op: "コンテキストメニューを表示",   keys: ["Shift","F10"],          cat: "基本操作",       lv: 2 },

  // ─── 追加：書式 Lv.2（均等割り・箇条書きレベル） ───
  { op: "均等割り付け（テキスト）",     keys: ["Ctrl","Shift","J"],     cat: "段落・配置",     lv: 2 },
  { op: "箇条書きレベルを1つ下げる",    keys: ["Shift","Alt","→"],      cat: "段落・配置",     lv: 2 },
  { op: "箇条書きレベルを1つ上げる",    keys: ["Shift","Alt","←"],      cat: "段落・配置",     lv: 2 },

  // ─── 追加：スライド操作 ───
  { op: "スライドを複製する",           keys: ["Ctrl","Shift","D"],     cat: "スライド操作",   lv: 2 },

  // ─── 追加：オブジェクト・ビュー Lv.1〜3 ───
  { op: "テキストボックスに入力開始",   keys: ["Enter"],                cat: "オブジェクト操作", lv: 1 },
  { op: "選択オブジェクトの回転（右）", keys: ["Alt","→"],              cat: "オブジェクト操作", lv: 3 },
  { op: "選択オブジェクトの回転（左）", keys: ["Alt","←"],              cat: "オブジェクト操作", lv: 3 },
  { op: "ズームイン",                   keys: ["Ctrl","+"],             cat: "ビュー・表示",   lv: 1 },
  { op: "ズームアウト",                 keys: ["Ctrl","−"],             cat: "ビュー・表示",   lv: 1 },

  // ─── 追加：スライドショー操作 Lv.3 ───
  { op: "注釈の表示/非表示（SS中）",    keys: ["Ctrl","M"],             cat: "スライドショー", lv: 3 },
  { op: "ポインターを非表示（SS中）",   keys: ["Ctrl","H"],             cat: "スライドショー", lv: 3 },

  // ─── 追加：ショートカット Lv.1〜3（補完） ───
  { op: "ウィンドウを切り替える",       keys: ["Ctrl","F6"],            cat: "基本操作",       lv: 2 },
  { op: "スライドサムネイルパネルへ移動", keys: ["F6"],                 cat: "スライド操作",   lv: 2 },
  { op: "次のプレースホルダーへ移動",   keys: ["Ctrl","Enter"],         cat: "オブジェクト操作", lv: 2 },
  { op: "スペルチェック（ダイアログ）", keys: ["Alt","F7"],             cat: "基本操作",       lv: 3 },

  // ─── 追加：テキスト編集 Lv.2〜3 ───
  { op: "ソフトリターン（改行のみ）",   keys: ["Shift","Enter"],        cat: "テキスト書式",   lv: 2 },
  { op: "カーソル右の単語を削除",       keys: ["Ctrl","Delete"],        cat: "テキスト書式",   lv: 2 },
  { op: "カーソル左の単語を削除",       keys: ["Ctrl","Backspace"],     cat: "テキスト書式",   lv: 2 },
  { op: "次を検索（再検索）",           keys: ["Shift","F4"],           cat: "基本操作",       lv: 2 },
  { op: "ノーブレークスペースを挿入",   keys: ["Ctrl","Shift","Space"], cat: "テキスト書式",   lv: 3 },
  { op: "フォント名フィールドへフォーカス", keys: ["Ctrl","Shift","F"], cat: "テキスト書式",   lv: 3 },
  { op: "フォントサイズフィールドへフォーカス", keys: ["Ctrl","Shift","P"], cat: "テキスト書式", lv: 3 },
]

export const DIFF_CFG = {
  easy:   { lvs: [1],     dur: 10, base:  80, label: "かんたん 🌱" },
  medium: { lvs: [1,2],   dur:  7, base: 100, label: "ふつう 🔥"  },
  hard:   { lvs: [1,2,3], dur:  4, base: 120, label: "むずかしい ⚡" },
}

export const EMOJIS_CORRECT = ["🍣","🍱","🍙","🍡","🌸","⭐","✨","🎊"]
export const EMOJIS_FIRE    = ["🔥","💥","⚡","🌟","🎉"]
