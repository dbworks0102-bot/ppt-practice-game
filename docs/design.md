# 設計書 — PPT道場

**バージョン:** 1.0  
**作成日:** 2026-05-27  
**ステータス:** Draft

---

## 1. アーキテクチャ概要

```
現在（v1）                    移行後（v2）
─────────────────────         ──────────────────────────────────────
index.html（単一ファイル）     ppt-practice-game/
                               ├── index.html
                               ├── package.json
                               ├── vite.config.js
                               ├── src/
                               │   ├── main.js          # エントリポイント
                               │   ├── data/
                               │   │   └── shortcuts.js # 問題データ
                               │   ├── core/
                               │   │   ├── game.js      # ゲームロジック
                               │   │   ├── scoring.js   # スコア計算
                               │   │   └── storage.js   # localStorage操作
                               │   ├── ui/
                               │   │   ├── screens.js   # 画面切替
                               │   │   ├── hud.js       # HUD更新
                               │   │   ├── ranking.js   # ランキング描画
                               │   │   └── mypage.js    # マイページ描画
                               │   └── utils/
                               │       ├── audio.js     # Web Audio API
                               │       ├── effects.js   # パーティクル等
                               │       └── helpers.js   # shuffle/escHtml等
                               ├── tests/
                               │   ├── unit/
                               │   │   ├── scoring.test.js
                               │   │   └── storage.test.js
                               │   └── e2e/
                               │       ├── game-flow.spec.js
                               │       ├── ranking.spec.js
                               │       └── mypage.spec.js
                               └── docs/
                                   ├── requirements.md
                                   ├── design.md
                                   └── tasks.md
```

---

## 2. 画面設計

### 2.1 画面一覧

| 画面ID | 画面名 | 遷移元 | 遷移先 |
|---|---|---|---|
| title | タイトル画面 | — | game, ranking, mypage |
| game | ゲーム画面 | title | result（ゲーム終了時） |
| result | リザルト画面 | game | title, game, ranking, mypage |
| ranking | ランキング画面 | title, result | title, result |
| mypage | マイページ画面 | title, result | title, result |

### 2.2 画面遷移図

```
[title] ──スタート──────────────────────────────→ [game]
   │                                                  │
   ├── ランキング → [ranking] ──戻る──┐         ゲーム終了
   │                                  │               ↓
   └── マイページ → [mypage] ──戻る───┘          [result]
                                                    │  │
                                          ランキング│  │マイページ
                                                    ↓  ↓
                                               [ranking] [mypage]
```

### 2.3 各画面のコンポーネント

#### タイトル画面
- ロゴ（PPT道場）
- プレイヤー名入力
- 遊び方説明
- 難易度選択（かんたん / ふつう / むずかしい）
- ゲームスタートボタン
- ランキングボタン / マイページボタン
- ハイスコア表示

#### ゲーム画面
- ヘッダー（終了・スコア・タイマー・コンボ・やり直し）
- コンベアベルトデコ
- 問題プレート（カテゴリ + 操作名）
- 問題タイマーバー
- コンボストリークドット
- 4択選択ボタン
- ヒントバー（キーボードショートカット案内）

#### リザルト画面
- グレード（S / A / B / C / D）
- スコア・難易度ラベル
- ランキングバッジ（順位）
- 統計（正解・不正解・正解率・最大コンボ）
- 新記録バナー
- ボタン群（ホーム / マイページ / ランキング / もう一度）

#### ランキング画面
- 難易度タブ切替
- ランキングテーブル（順位・名前・スコア・正解率・最大コンボ・日付）
- クリアボタン

#### マイページ画面
- 総合成績グリッド（ゲーム数・最高スコア・平均スコア・正答率・正解数・不正解数）
- カテゴリー別正答率バーチャート
- 苦手な問題TOP10リスト

---

## 3. データ設計

### 3.1 localStorage スキーマ

```javascript
// プレイヤー名
'ppt-dojo-name'  →  "田中"

// ハイスコア（全難易度共通）
'ppt-dojo-hi'  →  1234

// ランキング（難易度別）
'ppt-dojo-ranks-easy'   →  RankEntry[]
'ppt-dojo-ranks-medium' →  RankEntry[]
'ppt-dojo-ranks-hard'   →  RankEntry[]

// マイページ統計（プレイヤー別）
'ppt-dojo-mystats-{name}'  →  PlayerStats
```

### 3.2 型定義

```typescript
// ランキングエントリー
type RankEntry = {
  name:     string;   // プレイヤー名
  score:    number;   // スコア
  correct:  number;   // 正解数
  wrong:    number;   // 不正解数
  maxCombo: number;   // 最大コンボ
  acc:      number;   // 正解率（%）
  date:     string;   // "2026/5/27"
  ts:       number;   // Unix timestamp（ソート用）
};

// プレイヤー累計統計
type PlayerStats = {
  games:        number;  // 総プレイ回数
  totalScore:   number;  // 累計スコア
  bestScore:    number;  // 最高スコア
  totalCorrect: number;  // 累計正解数
  totalWrong:   number;  // 累計不正解数
  questions: {
    [op: string]: {      // キー = 操作名（例："上書き保存"）
      c:   number;       // 正解数
      w:   number;       // 不正解数
      cat: string;       // カテゴリ名
    }
  }
};

// セッション統計（1ゲーム中のみ）
type SessionStats = {
  [op: string]: { c: number; w: number; cat: string; }
};

// ショートカット問題
type Shortcut = {
  op:   string;    // 操作名 例："上書き保存"
  keys: string[];  // キー配列 例：["Ctrl","S"]
  cat:  string;    // カテゴリ名
  lv:   1 | 2 | 3; // 難易度レベル
};

// ゲーム状態
type GameState = {
  diff:         'easy' | 'medium' | 'hard';
  score:        number;
  combo:        number;
  maxCombo:     number;
  timeLeft:     number;
  correct:      number;
  wrong:        number;
  active:       boolean;
  paused:       boolean;
  pausedAt:     number;
  q:            Shortcut | null;
  choices:      Shortcut[];
  answered:     boolean;
  qStart:       number;   // 問題開始時刻（ms）
  qDur:         number;   // 問題制限時間（秒）
  t_game:       number | null;
  rankFrom:     'title' | 'result';
  sessionStats: SessionStats;
};
```

---

## 4. スコアリング設計

### 4.1 速度ティア

| speedRatio | ティア | 表示 | 倍率 |
|---|---|---|---|
| > 0.85 | ULTRA | ⚡ 超速！ | ×3.0 |
| > 0.65 | FAST | 🔥 速い！ | ×2.5 |
| > 0.40 | GOOD | ✨ Good！ | ×2.0 |
| > 0.15 | OK | 👍 正解！ | ×1.5 |
| 0〜0.15 | SLOW | ✅ 正解 | ×1.0 |

`speedRatio = 1 - (回答時間ms / 1000) / 問題制限時間秒`

### 4.2 コンボ倍率

| コンボ数 | 倍率 |
|---|---|
| 10以上 | ×2.0 |
| 5〜9 | ×1.6 |
| 3〜4 | ×1.3 |
| 0〜2 | ×1.0 |

### 4.3 ベーススコア（難易度別）

| 難易度 | ベーススコア | 問題制限時間 |
|---|---|---|
| かんたん | 80 | 10秒 |
| ふつう | 100 | 7秒 |
| むずかしい | 120 | 4秒 |

### 4.4 スコア計算式

```
得点 = round( ベーススコア × 速度倍率 × コンボ倍率 )
```

### 4.5 ペナルティ

- **不正解・時間切れ:** 残り時間 −2秒（スコア減点なし）

### 4.6 グレード閾値

| グレード | スコア |
|---|---|
| S | 2000点以上 |
| A | 1200点以上 |
| B | 600点以上 |
| C | 200点以上 |
| D | 200点未満 |

---

## 5. テスト設計

### 5.1 ユニットテスト対象

| テストファイル | テスト内容 |
|---|---|
| `scoring.test.js` | getSpeedTier / スコア計算 / グレード判定 |
| `storage.test.js` | saveScore / getRankings / savePlayerStats / getPlayerStats |
| `helpers.test.js` | shuffle / pickChoices / escHtml |

### 5.2 E2Eテスト対象（Playwright）

| テストファイル | テストシナリオ |
|---|---|
| `game-flow.spec.js` | タイトル→ゲーム開始→回答→リザルト遷移 |
| `game-flow.spec.js` | 正解時のスコア加算・コンボ増加確認 |
| `game-flow.spec.js` | 不正解時のタイマー減算確認（−2秒） |
| `game-flow.spec.js` | キーボード1〜4で回答できる |
| `ranking.spec.js` | ゲーム後にランキングに登録される |
| `ranking.spec.js` | 難易度タブ切替が正しく動作する |
| `mypage.spec.js` | マイページにカテゴリー別正答率が表示される |
| `mypage.spec.js` | 3回以上回答すると苦手問題に表示される |
| `mypage.spec.js` | リセットでデータが削除される |

---

## 6. ホスティング設計

### 6.1 推奨ホスティング先

| サービス | 特徴 | 採用可否 |
|---|---|---|
| **Vercel** | 無料・高速CDN・Git連携自動デプロイ | ✅ 推奨 |
| GitHub Pages | 無料・静的サイト | ✅ 可 |
| Netlify | 無料・フォーム対応 | ✅ 可 |

### 6.2 OGP設定（SNSシェア用）

```html
<meta property="og:title"       content="PPT道場 〜ショートカットキー練習ゲーム〜">
<meta property="og:description" content="PowerPointのショートカットキーを楽しく覚えよう！30秒で何点取れる？">
<meta property="og:image"       content="https://your-domain/ogp.png">
<meta property="og:url"         content="https://your-domain/">
<meta name="twitter:card"       content="summary_large_image">
```
