# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SOLEX LOGISTICS コーポレートサイト - 25年目社名変更記念**

運送会社の社名変更記念サイト（静的サイト）
- 旧：株式会社SOLEX → 新：株式会社SOLEX LOGISTICS
- **主要目標**: 求人強化（特に女性ドライバー）
- **重要ポイント**: 25年の信頼実績 + 新しいスタート
- 5ページ構成の完全レスポンシブサイト

## Architecture

Static HTML/CSS/JavaScript website without a build system or package manager. Traditional web development approach with separate directories for different asset types.

### File Structure
```
/
├── index.html           # トップページ（社名変更告知メイン）
├── about.html          # 会社案内・25年の沿革
├── services.html       # サービス紹介（一般貨物・軽貨物）
├── recruit.html        # 求人特設ページ（女性ドライバー重点）
├── contact.html        # お問い合わせ
├── css/
│   ├── style.css       # メインスタイル
│   ├── responsive.css  # レスポンシブ対応
│   └── components.css  # コンポーネント別
├── js/
│   ├── main.js         # メイン機能
│   ├── animations.js   # アニメーション効果
│   └── form.js         # フォーム処理
├── images/
│   ├── placeholders/   # プレースホルダー画像
│   └── logo/           # ロゴファイル用
└── .claude/            # Claude Code設定
```

## デザインシステム

### カラーパレット（ロゴベース）
```css
/* メインカラー */
--primary-blue: #1E88E5;      /* ロゴの青 */
--secondary-blue: #42A5F5;    /* 明るい青 */
--accent-orange: #FF8F00;     /* ロゴのオレンジ */
--light-orange: #FFA726;      /* 明るいオレンジ */
--dark-blue: #0D47A1;         /* テキスト・ヘッダー用 */
--white: #FFFFFF;
--light-gray: #F5F5F5;        /* 背景用 */
--text-gray: #666666;         /* 本文用 */

/* グラデーション */
--primary-gradient: linear-gradient(135deg, #1E88E5, #42A5F5);
--accent-gradient: linear-gradient(135deg, #FF8F00, #FFA726);
--hero-gradient: linear-gradient(135deg, #0D47A1, #1E88E5);
```

### デザイン方針
- **信頼感**: 深い青を基調とした安定感のあるデザイン
- **親しみやすさ**: オレンジアクセントで温かみを演出
- **プロフェッショナル**: クリーンで整理されたレイアウト
- **アクセシビリティ**: WCAG 2.1準拠のコントラスト比
- **モダン**: 適度なグラデーションとマイクロアニメーション

## コンテンツ戦略

### 重要メッセージ
1. **社名変更告知**: 「25年の信頼と実績を新たな名前で」
2. **女性活躍**: 「女性ドライバーが活躍できる職場環境」
3. **安定経営**: 「創業25年の確かな実績」
4. **地域密着**: 「地域に根ざした物流サービス」

### 各ページの重点ポイント
- **トップ**: 社名変更 + 女性ドライバー求人への導線
- **会社案内**: 25年の歴史 + 社名変更の意味
- **サービス**: 一般貨物・軽貨物の違いを分かりやすく
- **求人**: 女性の働きやすさを具体的に表現
- **お問い合わせ**: 目的別フォーム（求人/サービス/見学）

## 技術仕様

### HTML/CSS/JavaScript
- **HTML5**: セマンティックマークアップ必須
- **CSS3**: Grid + Flexbox、カスタムプロパティ活用
- **JavaScript**: バニラJS（ライブラリ不使用）
- **レスポンシブ**: モバイルファースト設計
- **パフォーマンス**: 軽量・高速読み込み最適化

### SEO・アクセシビリティ
- **メタタグ**: 適切なdescription、keywords設定
- **構造化データ**: 企業情報のJSON-LD
- **alt属性**: 全画像に説明文必須
- **見出し構造**: h1-h6の適切な階層
- **フォーカス管理**: キーボードナビゲーション対応

## 開発規則

### コーディング標準
- **インデント**: スペース2文字
- **命名規則**: BEM記法（Block__Element--Modifier）
- **コメント**: 重要な処理には日本語コメント
- **ファイル分割**: 機能別・ページ別に適切に分割

### 画像管理
- **プレースホルダー**: 実装時は全てプレースホルダー使用
- **alt属性**: 内容を具体的に記述
- **レスポンシブ画像**: srcsetとsizes属性活用
- **最適化**: WebP対応、適切なサイズ設定

### パフォーマンス
- **CSS**: 重要なスタイルはインライン、残りは外部ファイル
- **JavaScript**: 非同期読み込み、必要最小限
- **画像**: 遅延読み込み（lazy loading）実装
- **圧縮**: HTML/CSS/JSの軽量化

## Development Notes

- No package.json or build system - this is a static site
- Direct editing of HTML, CSS, and JavaScript files
- Claude Code permissions configured in `.claude/settings.local.json`
- All images should use placeholders during development
- Focus on clean, semantic HTML structure
- Prioritize accessibility and performance optimization

## 実装優先順位

1. **構造設計**: 全ページのHTML骨格
2. **基本スタイル**: カラーパレット適用
3. **レスポンシブ**: モバイル対応
4. **アニメーション**: マイクロインタラクション
5. **最適化**: SEO・パフォーマンス調整