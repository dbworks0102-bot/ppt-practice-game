# タスクリスト — PPT道場 WEB公開プロジェクト

**作成日:** 2026-05-27  
**ステータス:** In Progress

---

## フェーズ 0：ドキュメント整備 ✅

- [x] 要求定義書 (`docs/requirements.md`) 作成
- [x] 設計書 (`docs/design.md`) 作成
- [x] タスクリスト (`docs/tasks.md`) 作成

---

## フェーズ 1：現状の品質確認・整理 ✅

- [x] 1-1. 既存 `index.html` の動作確認（E2Eテスト37件・全画面・全機能グリーン確認）
- [x] 1-2. ショートカット問題の重複チェック（`scripts/check-duplicates.js` 作成・操作名重複ゼロ確認）
- [x] 1-3. 問題数の確認・150問拡充完了（Lv.1:26問 / Lv.2:70問 / Lv.3:54問）

---

## フェーズ 2：ビルド環境の整備 ✅

- [x] 2-1. `package.json` 初期化 (`npm init -y`)
- [x] 2-2. Vite / Vitest / Playwright インストール
- [x] 2-3. `vite.config.js` / `playwright.config.js` 作成
- [x] 2-4. `src/` ディレクトリ構成を作成（フェーズ3でファイルを充填）
- [x] 2-5. ビルドが通ることを確認 → `dist/index.html` (81KB, gzip:18.6KB) ✅

---

## フェーズ 3：モジュール分割（リファクタリング） ✅

### データ層
- [x] 3-1. `src/data/shortcuts.js` — SHORTCUTS配列・DIFF_CFG・EMOJIS を抽出
- [x] 3-2. `src/core/storage.js` — localStorage操作を集約（ranking/stats/name/hi）

### ロジック層
- [x] 3-3. `src/core/scoring.js` — getSpeedTier / スコア計算 / グレード判定を抽出
- [x] 3-4. `src/core/game.js` — ゲーム状態管理・フロー制御（initState/startGame/endGame等）

### UI層
- [x] 3-5. `src/utils/helpers.js` — shuffle / keysHTML / escHtml / pickChoices
- [x] 3-6. `src/utils/audio.js` — Web Audio API（beep/sndCorrect/sndWrong等）
- [x] 3-7. `src/utils/effects.js` — floatText / spawnParticles / showComboBurst / belt
- [x] 3-8. `src/ui/screens.js` — showScreen / goTitle / showRanking / showMyPage
- [x] 3-9. `src/ui/hud.js` — updateHUD / renderStreak / renderQ / startQBar
- [x] 3-10. `src/ui/ranking.js` — renderRankTable / confirmClearRanks
- [x] 3-11. `src/ui/mypage.js` — renderMyPage / confirmResetStats
- [x] 3-12. `src/main.js` — エントリポイント（イベントリスナー・初期化）
- ビルド結果: `18 modules transformed`, `index.html 34.93kB + assets/index.js 29.49kB` ✅

---

## フェーズ 4：テスト環境の整備

### ユニットテスト
- [x] 4-1. Vitest インストール (`npm install -D vitest`)
- [x] 4-2. `tests/unit/scoring.test.js` 作成・グリーン確認 ✅
  - [x] getSpeedTier の境界値テスト（5ティア）
  - [x] スコア計算の正確性テスト
  - [x] グレード判定テスト（S/A/B/C/D）
- [x] 4-3. `tests/unit/storage.test.js` 作成・グリーン確認 ✅
  - [x] saveScore / getRankings のテスト
  - [x] savePlayerStats / getPlayerStats のテスト
  - [x] 最大件数（20件）超過時の切り詰めテスト
- [x] 4-4. `tests/unit/helpers.test.js` 作成・グリーン確認 ✅
  - [x] shuffle の出力要素数テスト
  - [x] pickChoices の重複キー除外テスト
  - [x] escHtml のXSS文字エスケープテスト

### E2Eテスト（Playwright MCP）
- [x] 4-5. Playwright インストール (`npm install -D @playwright/test`)
- [x] 4-6. `playwright.config.js` 作成（Port 4173 使用 ※3000/3001はRemotionが占有）
- [x] 4-7. `tests/e2e/game-flow.spec.js` 作成・グリーン確認 ✅
  - [x] タイトル画面の表示確認
  - [x] 名前入力 → スタート → ゲーム画面遷移
  - [x] 正解ボタンクリック → スコア変化確認
  - [x] キーボード「1」〜「4」で回答できる
  - [x] モーダル操作（終了・キャンセル・ESC）
- [x] 4-8. `tests/e2e/ranking.spec.js` 作成・グリーン確認 ✅
  - [x] ランキングデータの表示・追加確認
  - [x] 難易度タブ切替が正しく動作する
  - [x] クリア機能でランキングが削除される
- [x] 4-9. `tests/e2e/mypage.spec.js` 作成・グリーン確認 ✅
  - [x] マイページにゲーム数・スコアが反映される
  - [x] カテゴリー別正答率が表示される
  - [x] 苦手問題TOP10が正しく表示される
  - [x] リセットでデータが削除される

---

## フェーズ 5：WEB公開準備 ✅

- [x] 5-1. OGP 画像（`public/ogp.png`）作成（1200×630px）— `scripts/gen-assets.js` で自動生成
- [x] 5-2. `index.html` に OGP / Twitter Card メタタグ追加（URL: https://ppt-dojo.vercel.app/）
- [x] 5-3. `public/favicon.svg` / `public/favicon-32.png` / `public/apple-touch-icon.png` 作成
- [x] 5-4. Google Analytics タグ追加（**要変更**: `G-XXXXXXXXXX` → 実際の測定ID）
- [x] 5-5. `public/robots.txt` / `public/sitemap.xml` 作成

---

## フェーズ 6：デプロイ

- [ ] 6-1. GitHub リポジトリ作成（`ppt-practice-game`）
- [ ] 6-2. `.gitignore` 作成（`node_modules/` / `dist/` を除外）
- [ ] 6-3. Vercel プロジェクト作成・GitHub連携
- [ ] 6-4. 本番環境でのE2Eテスト実行確認
- [ ] 6-5. カスタムドメイン設定（任意）

---

## フェーズ 7：コンテンツ拡充（公開後）

- [ ] 7-1. ショートカット問題を150問に拡充
- [ ] 7-2. SNSシェア機能（スコア画像生成）
- [ ] 7-3. PWA対応（Service Worker・マニフェスト）
- [ ] 7-4. オンラインランキング（Supabase / Firebase）

---

## 進捗サマリー

| フェーズ | 完了タスク | 全タスク | 進捗 |
|---|---|---|---|
| 0. ドキュメント整備 | 3 | 3 | ✅ 100% |
| 1. 品質確認 | 3 | 3 | ✅ 100% |
| 2. ビルド環境 | 5 | 5 | ✅ 100% |
| 3. モジュール分割 | 12 | 12 | ✅ 100% |
| 4. テスト環境 | 14 | 14 | ✅ 100% |
| 5. 公開準備 | 5 | 5 | ✅ 100% |
| 6. デプロイ | 0 | 5 | ⬜ 0% |
| 7. 拡充（公開後）| 0 | 4 | ⬜ 0% |
