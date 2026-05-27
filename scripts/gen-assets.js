// =========================================================
//  gen-assets.js — OGP画像・favicon・apple-touch-icon を生成
//  実行: node scripts/gen-assets.js
// =========================================================
import { chromium } from '@playwright/test'
import fs from 'fs'

const PUBLIC_DIR = 'public'

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

// ─── OGP 画像 HTML (1200×630) ─────────────────────────
const OGP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width:1200px; height:630px;
      background:#0f0e17;
      font-family:'Noto Sans JP','Segoe UI',sans-serif;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      position:relative; overflow:hidden;
    }
    .bar {
      position:absolute; top:0; left:0; right:0; height:10px;
      background:linear-gradient(90deg,#e63946,#f4a261,#2a9d8f,#e63946);
    }
    .bar-b { top:auto; bottom:0; }
    .deco {
      position:absolute; font-size:220px;
      opacity:0.05; user-select:none;
    }
    .d1 { top:-30px; left:-20px; }
    .d2 { bottom:-30px; right:-20px; }
    .logo {
      font-size:100px; font-weight:900; color:#fff;
      letter-spacing:-3px; margin-bottom:14px;
      text-shadow:0 4px 20px rgba(230,57,70,0.4);
    }
    .logo em { color:#e63946; font-style:normal; }
    .sub {
      font-size:26px; color:#8892b0;
      letter-spacing:2px; margin-bottom:44px;
    }
    .tags { display:flex; gap:20px; }
    .tag {
      background:rgba(255,255,255,0.07);
      border:1.5px solid rgba(255,255,255,0.14);
      border-radius:50px; padding:12px 32px;
      font-size:22px; color:#ffd700; font-weight:700;
      letter-spacing:1px;
    }
  </style>
</head>
<body>
  <div class="bar"></div>
  <div class="bar bar-b"></div>
  <div class="deco d1">⌨️</div>
  <div class="deco d2">🥋</div>
  <div class="logo">🥋 <em>PPT</em>道場</div>
  <div class="sub">パワーポイント ショートカットキーゲーム</div>
  <div class="tags">
    <div class="tag">📚 150問</div>
    <div class="tag">⚡ 3難易度</div>
    <div class="tag">🏆 ランキング</div>
  </div>
</body>
</html>`

// ─── アイコン HTML (任意サイズ) ───────────────────────
function iconHtml(size) {
  const radius  = Math.round(size * 0.22)
  const emoji   = Math.round(size * 0.52)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      width:${size}px;height:${size}px;
      background:linear-gradient(135deg,#e63946,#c1121f);
      display:flex;align-items:center;justify-content:center;
      border-radius:${radius}px;
    }
    .e{font-size:${emoji}px;line-height:1;}
  </style>
</head>
<body><div class="e">🥋</div></body>
</html>`
}

// ─── メイン処理 ───────────────────────────────────────
async function generate() {
  console.log('🚀 アセット生成を開始します...\n')
  const browser = await chromium.launch()
  const ctx     = await browser.newContext({ deviceScaleFactor: 1 })

  // 1. OGP 画像 (1200×630)
  process.stdout.write('  📸 OGP画像 (1200×630)... ')
  const ogpPage = await ctx.newPage()
  await ogpPage.setViewportSize({ width: 1200, height: 630 })
  await ogpPage.setContent(OGP_HTML, { waitUntil: 'networkidle' })
  await ogpPage.screenshot({ path: `${PUBLIC_DIR}/ogp.png`, type: 'png' })
  console.log('✅  public/ogp.png')

  // 2. Apple Touch Icon (180×180)
  process.stdout.write('  📸 apple-touch-icon (180×180)... ')
  const atiPage = await ctx.newPage()
  await atiPage.setViewportSize({ width: 180, height: 180 })
  await atiPage.setContent(iconHtml(180), { waitUntil: 'networkidle' })
  await atiPage.screenshot({ path: `${PUBLIC_DIR}/apple-touch-icon.png`, type: 'png' })
  console.log('✅  public/apple-touch-icon.png')

  // 3. Favicon PNG (32×32)
  process.stdout.write('  📸 favicon-32.png (32×32)... ')
  const favPage = await ctx.newPage()
  await favPage.setViewportSize({ width: 32, height: 32 })
  await favPage.setContent(iconHtml(32), { waitUntil: 'networkidle' })
  await favPage.screenshot({ path: `${PUBLIC_DIR}/favicon-32.png`, type: 'png' })
  console.log('✅  public/favicon-32.png')

  await browser.close()
  console.log('\n🎉 アセット生成完了！\n')
  console.log('生成ファイル:')
  console.log('  public/ogp.png             (OGP / SNSシェア画像)')
  console.log('  public/apple-touch-icon.png (iOS ホーム画面アイコン)')
  console.log('  public/favicon-32.png       (ブラウザタブアイコン PNG)')
  console.log('  public/favicon.svg          (スケーラブルアイコン)')
}

generate().catch(err => {
  console.error('❌ エラー:', err)
  process.exit(1)
})
