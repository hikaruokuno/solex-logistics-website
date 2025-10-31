# SOLEX LOGISTICS Web仕様書

## 1. プロジェクト概要
- 目的: 金融機関および新規取引企業に信頼感を与えるコーポレートサイトを制作し、社名変更（旧: 株式会社SOLEX → 新: 株式会社SOLEX LOGISTICS）を周知する。
- ページ構成: 基本は 1 ページ構成。将来的な下層ページ拡張（採用詳細・ニュース）を想定した設計とする。
- 使用技術: HTML5 + Tailwind CSS (CDN) + バニラ JavaScript。ビルドレスで Cloudflare Pages へデプロイ。
- 画像アセット: `logo_image.jpg`、`ribbon-texture.png`（斜め帯用ノイズテクスチャ）。すべて `/assets/images/` 配下に配置。

## 2. デプロイ要件
- Cloudflare Pages に静的サイトとして配置。リポジトリのルートに `index.html`, `assets/` フォルダを置く。
- Tailwind CDN を `<head>` 内で呼び出し。バージョンは `"https://cdn.jsdelivr.net/npm/tailwindcss@3.4.4/dist/tailwind.min.css"` を使用想定。
- カスタムスタイルは `<style>` または `tailwind.config` オブジェクトに対する `tailwind.config = { theme: { extend: {...} } }` で上書き。必要に応じて `@layer` で共通ユーティリティを追加。
- フォーム送信は初期段階ではダミー処理（JavaScript で送信完了メッセージ表示）とし、API 接続が決まり次第差し替える。

## 3. 配色・タイポグラフィ
| 用途 | カラーコード | Tailwind カスタム名 |
| ---- | ------------ | ------------------- |
| Primary | #0D4D8B | `brand-blue` |
| Secondary | #1DA0E6 | `brand-sky` |
| Accent | #102437 | `brand-ink` |
| Background | #F4F7FB | `base-cloud` |
| Line / Noise | #D4DFEB | `line-ice` |

Tailwind 設定例:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'brand-blue': '#0D4D8B',
          'brand-sky': '#1DA0E6',
          'brand-ink': '#102437',
          'base-cloud': '#F4F7FB',
          'line-ice': '#D4DFEB'
        },
        fontFamily: {
          sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
          serif: ['"Noto Serif JP"', 'serif']
        },
        letterSpacing: {
          'wide-en': '0.2em',
          'hero-ja': '0.08em'
        },
        borderRadius: {
          'card': '0.5rem',
          'ribbon': '2.5rem'
        },
        boxShadow: {
          'card': '0 18px 45px rgba(0, 70, 85, 0.12)'
        },
        keyframes: {
          'ribbon-drift': {
            '0%': { transform: 'translate3d(0, 0, 0) rotate(-8deg)' },
            '100%': { transform: 'translate3d(8px, -10px, 0) rotate(-6deg)' }
          },
          'ink-underline': {
            '0%': { transform: 'scaleX(0)' },
            '100%': { transform: 'scaleX(1)' }
          }
        },
        animation: {
          'ribbon-drift': 'ribbon-drift 18s ease-in-out infinite alternate',
          'ink-underline': 'ink-underline 0.48s ease forwards'
        }
      }
    }
  };
</script>
```

フォント: Google Fonts の Noto Sans JP（本文）と Noto Serif JP（ヒーローコピー・セクションタイトル）を `<link>` で読み込み。ヒーローの日本語コピーは `font-serif tracking-hero-ja` で伸びやかに見せる。英字キーワードは Noto Sans JP を使用し `uppercase tracking-wide-en` でアクセントを作る。ベース文字サイズ `text-base`, 行間 `leading-relaxed` を維持。

## 4. ページ構成
各セクションは `section` 要素で構成。最大コンテンツ幅 `max-w-6xl mx-auto px-6` を基準とし、上下余白は `py-20`（モバイルでは `py-12`）を目安とする。

### 4.1 Header
- 構造: `sticky top-0 bg-white/85 backdrop-blur` に `border-b border-line-ice/70`. 内部は `max-w-6xl mx-auto flex h-20 items-center justify-between px-6`.
- ナビ項目: 「ホーム」「事業紹介」「会社情報」「採用」「お問い合わせ」。テキストカラーは `text-brand-ink/80`、ホバーで `text-brand-ink`. 下線は `::after` に `bg-brand-sky` を伸ばし、遅延 140ms で出す。
- CTA: 右端に「お問い合わせ」ボタン。`inline-flex items-center gap-2 rounded-full border border-brand-ink/60 px-4 py-2 text-sm font-semibold text-brand-ink data-[active=true]:bg-brand-ink data-[active=true]:text-white`。ホバー中は `before` 擬似要素の `radial-gradient` がブランドブルーの光を描き、微かな輝きを加える。
- モバイル: `md:hidden` のハンバーガー。開閉時は `dialog` 相当のオーバーレイ (`fixed inset-0 bg-white/95 mobile-menu-backdrop`). メニューリストは `text-lg font-medium`, アイテム毎にスカイブルーのピル (`before` 小円) を表示し、タップでメニューを閉じる。
- オプション: 右上に「モーション」トグル (`button` + pause アイコン) を配置し、アニメーション停止フラグを JS で切り替えられるようにする。

### 4.2 Hero
- 背景: ベースは白で、`::before` と `::after` に斜めリボンを重ねる。`::before` は左上から右下へ伸びる `linear-gradient(110deg, rgba(13,77,139,0.92), rgba(29,160,230,0.55))` を `mask-image: linear-gradient(100deg, transparent 0%, black 25%, black 75%, transparent 100%)` で切り抜き、`clip-path: polygon(0 22%, 100% 0, 100% 42%, 0 60%)` に似せる。`::after` は反転させ、淡いノイズテクスチャ（SVG）を `mix-blend-mode: multiply` で重ねる。双方に `animate-ribbon-drift` を適用して微揺れ。写真は使わず余白を活かす。
- リボンアニメーション: 2本のリボンはカスタムプロパティ `--ribbon-entry` で `translateX` を制御し、初期値 `32%`・`opacity:0`。`@keyframes ribbon-reveal`（1.1s ease-out）で濃い青（primary）が先に `0%` へ到達 → 0.22s 遅れて薄い青（secondary）が追従。`prefers-reduced-motion` ではアニメーション無効化。
- コピー:
  - リードラベル: `inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-brand-ink`, 小さなタグで最新のトピックやスローガンを表示。
  - 見出し: 「創業25年目。WORK FOR GOOD――働く力で社会を動かす。」 (`font-serif text-3xl md:text-4xl lg:text-[3.25rem] text-brand-ink leading-relaxed md:leading-relaxed lg:leading-[1.5]`)。各フレーズは `span.block` で 3 行に分け、2 行目で英語キーメッセージ、3 行目で「――働く力で社会を動かす。」を独立させる。`letter-spacing` は `tracking-hero-ja`.
  - サブコピー: `max-w-2xl text-brand-ink/70 md:text-lg`.
  - CTA ボタン: プライマリは黒 (`bg-brand-ink text-white`)、セカンダリはアウトライン (`border border-brand-ink/30 text-brand-ink`). 両方 `data-glow` を共有し、ホバーでミント色の光が流れる。モバイルは縦積み、PC は左右配置。

### 4.3 信頼ポイント
- セクションCTA: 冒頭に「私たちについて」ピル型ボタン。黒地に白文字、周囲を薄いラインで囲み、右向き矢印アイコンを添える。モバイルでは中央、`md` 以上は右寄せ。ホバーでわずかに浮かせ、`outline` でフォーカスリング。
- ビジュアル: セクション冒頭にフォトコラージュ。`car1` と `car2` を左側の 2 カラムに配置し、`car3` をその下で横長に展開。右側に `car4` を大きく見せるカードを置き、淡いグラデーション帯でリズムを付ける。すべて `rounded-[1.75rem]`、白ベース＋シャドウでカード化し、ホバーで `scale-105` にトランジション。`loading="lazy"` を付与。モバイル時はセクションコンテナの `::before`/`::after` でターコイズの斜め帯を描き、コラージュの背面に差し込む。
- 画像比率: 上段 2 枚は縦長（約 4:5）、下段ワイドは 3:2、右側カードは 4:5 を目安に `object-cover` でトリミング。
- レイアウト: モバイルは中央寄せで幅 520px 以内の 2 カラム（上段2枚）+下段ワイド構成、PC ではコラージュ側を約 520px、右側の `car4` カードを約 360px に縮めて横並びにし、余白は `gap-12` 相当でバランスを取る。セクション導入に細い罫線 (`section-divider`) と「ミッション」の小ラベルを置く。
- カード内容:
  1. 「創業25年の物流パートナー」―沿革と実績を簡潔に。  
  2. 「24時間365日配車」―夜間・緊急対応。  
  3. 「全国ネットワーク」―広域連携説明。
- スタイル: `rounded-card bg-white p-8 shadow-card border border-line-ice/60`. `::before` にブルーの角丸リボン (`absolute -top-10 right-[-30%] h-40 w-64 rotate-[12deg] bg-brand-sky/12 blur-xl`). `::after` は底辺に 1px のネイビーライン (`scale-x` アニメで出現)。ホバーで `translate-y-[-6px]` と `shadow-[0_24px_45px_rgba(13,77,139,0.18)]` を付与。

### 4.4 リブランド告知
- 背景: `bg-base-cloud`. 上部に薄い斜め帯を跨がせ、セクション全体を柔らかく分節。
- コンテンツ: 左に本文、右にタイムライン。タイトルは `font-serif text-2xl text-brand-ink`.
- タイムライン: `border-l border-brand-ink/20 pl-6 space-y-5`, 年号バッジは `inline-flex items-center gap-2 rounded-full border border-line-ice px-3 py-1 text-xs font-semibold`. スクロールイン時に `timeline-step` クラスで 80ms ディレイ。
- 代表コメントリンク: `button` 「代表挨拶を読む」 (`inline-flex items-center gap-2 rounded-full border border-brand-ink/40 px-4 py-2 text-sm font-semibold`). ホバーで `background-color: rgba(16,24,32,0.04)`。

### 4.5 事業紹介
- レイアウト: `grid md:grid-cols-2 gap-8`. 各カード冒頭にカテゴリータグ (`bg-brand-sky/15 text-brand-blue px-3 py-1 rounded-full text-xs uppercase`) を添える。
- スタイル: `rounded-card bg-white/90 p-8 shadow-card border border-line-ice/60`. `::before` に細いテクスチャ帯 (`absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,rgba(29,160,230,0.45),transparent)]`). スクロールインで `opacity-0 translate-y-6` → `opacity-100 translate-y-0`.
- コンテンツ: 
  - 一般貨物運送事業：車両規模、主要エリア、強みを `ul` リストで記述。
  - 軽貨物運送事業：小ロット／チャーター／都市配送、対応品目など。
- CTA: 各カードの末尾に黒ボタン (`bg-brand-ink text-white px-5 py-2 rounded-full`) を設置。「詳細を相談する」。ホバーで `data-glow` によりミントのハイライトが流れる。

### 4.6 会社情報
- レイアウト: `md:grid md:grid-cols-[1.1fr_0.9fr] gap-12`. 背景には淡い斜め帯を再利用。
- 左カラム: 代表挨拶を `blockquote` (`border-l-4 border-brand-sky pl-6`) で表示。引用符アイコンを小さく配置。
- 右カラム: `dl` で会社概要を整列。区切り線に `border-t border-line-ice/60` を使用し、ラベル部は `font-semibold text-brand-ink`.
- 下部: 3 枚の沿革カード (`rounded-card bg-white shadow-card p-6 text-sm`). ホバーでわずかに浮かせる。
- セクション境界: `section-divider` を活用し、線がビューポートに入ると `animate-ink-underline` で左から伸びる。

### 4.7 採用導線
- 背景: `bg-white`, セクション内部にスカイブルーの斜め帯を薄く跨がせる (`absolute inset-x-0 top-1/3 h-2/3 bg-brand-sky/8 skew-y-[-6deg]`).
- 見出し: `font-serif text-2xl text-brand-ink`. サブ文は `text-brand-ink/70`.
- リスト: 3 項目を `grid sm:grid-cols-3 gap-4`, アイテムは `rounded-card border border-line-ice/60 bg-white/80 px-4 py-6 text-sm`. 左上に丸い番号ピル (`bg-brand-sky/20 text-brand-blue`).
- CTA: `採用情報を見る` → `class="inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white"`。ホバーでブランドスカイのハイライト。補足テキスト「採用に関するご相談もお問い合わせフォームへ」は `text-xs text-brand-ink/50`.

### 4.8 お問い合わせフォーム
- `section id="contact"`.
- フォーム構造: `<form class="space-y-6 max-w-3xl mx-auto bg-white rounded-card shadow-card p-8">`.
- 入力項目: 
  1. 名前 (`input type="text"` 必須)  
  2. 会社名 (`input type="text"`)  
  3. メールアドレス (`input type="email"` 必須)  
  4. 電話番号 (`input type="tel"`)  
  5. お問い合わせ内容 (`textarea rows="5"` 必須)  
  6. 希望連絡方法 (`radio` → メール/電話/どちらでも)  
  7. プライバシーポリシー同意チェック (`checkbox`)  
- 送信ボタン: `bg-brand-ink text-white px-6 py-3 rounded-full`.
- アフターメッセージ: JS で送信時にバリデーション → `preventDefault()` → `aria-live` 領域へ完了テキスト。フォームの代替連絡先 (`tel`,`mail`) を本文末に記載。
- フォームアニメーション: `focus` 時にラベルが `translate-y-[-0.75rem] text-xs text-brand-sky` へ移動するフローティングラベルを実装。入力完了 (`input` が `valid`) で右側のチェックアイコンが `scale-0 rotate-[-20deg]` → `scale-100 rotate-0` に弾む。送信ボタンはクリックで短い `scale-95` → `scale-100` バウンスを行う。

## 5. JavaScript 仕様
- ファイル: `main.js` を `assets/js/` に配置し、`<script src="/assets/js/main.js" defer></script>` で読み込み。
- 機能:
  1. ハンバーガーメニューの開閉 (`aria-expanded` 管理、`focus-trap` は簡易的に `tabindex` 操作)。  
  2. ナビリンク押下でスムーススクロール (`scrollIntoView({ behavior: 'smooth' })`).  
  3. お問い合わせフォームの簡易バリデーション（必須項目チェック、メール形式検証、エラー表示）。  
  4. フォーム送信完了モーダルまたはアラート（`aria-live="polite"`）。  
  5. Hero スクロールアイコン押下 → 信頼ポイントへ移動。  
  6. IntersectionObserver で `data-animate` 要素を監視し、初期状態 `opacity-0 translate-y-8` からスクロールイン時に `opacity-100 translate-y-0` へトランジション (`transition-all duration-500`)。信頼ポイント・事業紹介カードは `scale` と `translate` を併用し、タイムラインはステップごとに 80ms の遅延を付与。セクション境界ラインは `scale-x` で伸び、アイコンのパルスはクラス付け替えで制御。  
  7. ヒーローリボンの `transform` を `requestAnimationFrame` で微揺れ調整し、`animate-ribbon-drift` の速度を制御。`prefers-reduced-motion` ではアニメーションを停止。  
  8. CTA ボタンとカード内ボタンのパララックスグロー: `pointermove` で座標を取得し、CSS カスタムプロパティに反映させて `radial-gradient` グローが追従するよう制御。ホバーが外れたら元の位置へスムースに戻す。

## 6. レスポンシブ指針
- ブレイクポイント: `sm` (≥640px), `md` (≥768px), `lg` (≥1024px). `lg` 以上で最大幅 1080px。  
- モバイル: ナビは `drawer` 表示、カードは縦並び (`grid-cols-1`), Hero テキスト中央揃え。フォームは単列。
- タブレット: 信頼ポイントを 2 カラム (`md:grid-cols-2`), 事業紹介は 2 カラム維持。  
- デスクトップ: Hero テキストは左寄せ、CTA 横並び。`gap-12` で余白確保。

## 7. アクセシビリティ
- 画像の `alt` テキスト: ロゴ → 「SOLEX LOGISTICS ロゴ」, ヒーロー → 「SOLEX LOGISTICS を象徴する斜めリボンのグラフィック」。
- カラーコントラスト: 確認し、Primary 背景上の白文字は WCAG AA 準拠。
- フォームラベル常設 + エラーテキスト (`text-red-600 text-sm`) + アイコン（`heroicons` など）。
- スキップリンク: `<a href="#main" class="sr-only focus:not-sr-only ...">本文へスキップ</a>`.
- キーボード操作: メニュー開閉時に `trap`, `Escape` で閉じる。

## 8. SEO / メタ情報
- `<title>`: `株式会社SOLEX LOGISTICS｜一般・軽貨物運送`
- `<meta name="description">`: `25年の実績で全国物流を支える株式会社SOLEX LOGISTICS。一般貨物・軽貨物運送で迅速かつ安全なサービスを提供します。`
- Open Graph: `og:title`, `og:description`, `og:image` (`ogp-ribbon.jpg` を 1200x630 に加工)。`twitter:card` = `summary_large_image`.
- 構造化データ: `Organization` の JSON-LD で社名・所在地・電話・ロゴ URL を記述。

## 9. 実装タスクリスト
1. `index.html` 骨組み (`header`, `main`, `footer`) の作成。
2. Tailwind CDN とフォント読み込み、色拡張設定。
3. 各セクションの HTML + Tailwind クラス実装。
4. `main.js` でナビ・フォームの挙動実装＆テスト。
5. 画像最適化（WebP 生成、`<picture>` でフォールバック設定）。
6. Cloudflare Pages 用 `dist` なしでリポジトリ登録 → デプロイ。

## 10. 将来拡張メモ
- 採用専用ページ、ニュース／ブログ追加。ナビに新項目追加。
- お問い合わせフォームを CRM もしくは外部送信 API（例: Cloudflare Workers, Formspree 等）へ接続。
- 会社概要 PDF の準備が整ったらボタンを再設置。
- 事例紹介・顧客ロゴなどのトラストコンテンツを増やす場合は「信頼ポイント」下にセクションを追加。

---
この仕様に基づいて HTML + Tailwind + JavaScript の静的サイトを構築し、Cloudflare Pages へ配置できる。
