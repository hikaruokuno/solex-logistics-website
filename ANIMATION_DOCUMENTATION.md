# SOLEX LOGISTICS サイト アニメーション仕様書

このドキュメントは、SOLEX LOGISTICSのWebサイトで使用されているアニメーション効果をまとめたものです。
他のプロジェクトでも再利用できるように、各アニメーションの詳細な仕様と実装方法を記載しています。

## 目次
1. [3D背景アニメーション](#3d背景アニメーション)
2. [スクロールアニメーション](#スクロールアニメーション)
3. [ヒーローセクションアニメーション](#ヒーローセクションアニメーション)
4. [インタラクティブエフェクト](#インタラクティブエフェクト)
5. [実装ガイド](#実装ガイド)

---

## 3D背景アニメーション

### 概要
ページ全体の背景に3D空間を演出する、複数の要素を組み合わせたアニメーション効果。

### 構成要素

#### 1. グリッドフロア
```css
/* 3D Grid Floor */
.grid-floor {
    position: absolute;
    width: 200%;
    height: 200%;
    bottom: -50%;
    left: -50%;
    background-image: 
        linear-gradient(rgba(30, 136, 229, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 136, 229, 0.1) 1px, transparent 1px);
    background-size: 100px 100px;
    transform: rotateX(70deg) translateZ(-200px);
    transform-style: preserve-3d;
    animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
    0% {
        transform: rotateX(70deg) translateZ(-200px) translateY(0);
    }
    100% {
        transform: rotateX(70deg) translateZ(-200px) translateY(100px);
    }
}
```
- **効果**: TRON風の3Dグリッドが奥行きを持って動く
- **用途**: サイバー空間や未来的な印象を演出

#### 2. 浮遊するキューブ
```css
.cube {
    position: absolute;
    width: 60px;
    height: 60px;
    transform-style: preserve-3d;
    animation: float 15s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: rotateX(0deg) rotateY(0deg) translateY(0px);
    }
    25% {
        transform: rotateX(30deg) rotateY(90deg) translateY(-20px);
    }
    50% {
        transform: rotateX(60deg) rotateY(180deg) translateY(-40px);
    }
    75% {
        transform: rotateX(90deg) rotateY(270deg) translateY(-20px);
    }
}
```
- **効果**: 3Dキューブが回転しながら浮遊
- **バリエーション**: 各キューブに異なるアニメーション時間と遅延を設定

#### 3. パーティクルエフェクト
```css
.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(30, 136, 229, 0.6);
    border-radius: 50%;
    animation: particleFloat 10s linear infinite;
}

@keyframes particleFloat {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% {
        transform: translateY(-100vh) rotate(720deg);
        opacity: 0;
    }
}
```
- **効果**: 小さな光の粒子が下から上へ流れる
- **用途**: 空間に動きと深さを追加

---

## スクロールアニメーション

### フェードインアップ
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.scroll-animate {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animate.fadeInUp {
    transform: translateY(30px);
}

.scroll-animate.fadeInUp.show {
    opacity: 1;
    transform: translateY(0);
}
```

### JavaScript実装
```javascript
// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});
```

---

## ヒーローセクションアニメーション

### 1. ヒーローパーティクル
```css
.hero-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(30, 136, 229, 0.8);
    border-radius: 50%;
    box-shadow: 
        0 0 10px rgba(30, 136, 229, 0.8), 
        0 0 20px rgba(30, 136, 229, 0.4);
    animation: heroParticleFloat 4s ease-in-out infinite;
}

@keyframes heroParticleFloat {
    0%, 100% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0;
    }
    20% { opacity: 1; }
    50% {
        transform: translateY(-200px) translateX(50px) scale(1.5);
        opacity: 1;
    }
    80% { opacity: 1; }
}
```

### 2. ヒーローキューブ（オレンジアクセント）
```css
.hero-cube {
    position: absolute;
    width: 60px;
    height: 60px;
    transform-style: preserve-3d;
    animation: heroFloat 15s ease-in-out infinite;
}

.hero-cube-face {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(255, 143, 0, 0.6);
    background: linear-gradient(135deg, 
        rgba(255, 143, 0, 0.1), 
        rgba(255, 167, 38, 0.05));
    box-shadow: inset 0 0 20px rgba(255, 143, 0, 0.2);
}
```

---

## インタラクティブエフェクト

### 1. ホバースケール
```css
.hover-scale {
    transition: transform 0.3s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}
```

### 2. グロー効果
```css
.glow {
    box-shadow: 0 0 20px rgba(30, 136, 229, 0.5);
    transition: box-shadow 0.3s ease;
}

.glow:hover {
    box-shadow: 0 0 30px rgba(30, 136, 229, 0.8);
}
```

### 3. パルスアニメーション
```css
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.animate-pulse {
    animation: pulse 2s ease-in-out infinite;
}
```

---

## 実装ガイド

### 必要なファイル構成
```
project/
├── css/
│   └── 3d-background.css    # 3D背景専用CSS
├── js/
│   └── animations.js         # スクロールアニメーション等
└── index.html               # メインHTML
```

### HTML構造例
```html
<!-- 3D背景 -->
<div class="three-d-background">
    <div class="grid-floor"></div>
    <div class="cube-container">
        <div class="cube">
            <div class="cube-face"></div>
            <div class="cube-face"></div>
            <div class="cube-face"></div>
            <div class="cube-face"></div>
            <div class="cube-face"></div>
            <div class="cube-face"></div>
        </div>
        <!-- 複数のキューブを配置 -->
    </div>
    <div class="three-d-overlay"></div>
</div>

<!-- スクロールアニメーション要素 -->
<div class="scroll-animate fadeInUp">
    <h2>コンテンツ</h2>
</div>
```

### カスタマイズポイント

#### カラーテーマの変更
```css
/* ブルー系からグリーン系へ変更する例 */
:root {
    --primary-color: #00C853;  /* 元: #1E88E5 */
    --accent-color: #FF6F00;   /* 元: #FF8F00 */
}
```

#### アニメーション速度の調整
```css
/* 全体的に速くする場合 */
.cube { animation-duration: 10s; }  /* 元: 15s */
.particle { animation-duration: 7s; }  /* 元: 10s */
```

#### レスポンシブ対応
```css
@media (max-width: 768px) {
    /* モバイルでは要素を削減してパフォーマンスを確保 */
    .cube:nth-child(4),
    .cube:nth-child(5) {
        display: none;
    }
}
```

### パフォーマンス最適化

1. **GPU加速の活用**
   ```css
   .animated-element {
       will-change: transform, opacity;
   }
   ```

2. **アニメーション要素の制限**
   - モバイルデバイスでは要素数を削減
   - 必要に応じて`prefers-reduced-motion`に対応

3. **遅延読み込み**
   ```javascript
   // 3D背景を遅延生成
   setTimeout(() => {
       generateParticles();
       generateCubes();
   }, 100);
   ```

### ブラウザ対応
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 注意事項
- 3D transformはCPU/GPU負荷が高いため、要素数に注意
- モバイルデバイスでは簡略化を検討
- アクセシビリティ: `prefers-reduced-motion`への対応を推奨

---

## まとめ

このアニメーションシステムは以下の特徴があります：

1. **モジュラー設計**: 各アニメーションが独立しており、必要な部分だけ使用可能
2. **カスタマイズ性**: CSS変数やクラス名で簡単にテーマ変更可能
3. **パフォーマンス考慮**: GPU加速とレスポンシブ対応
4. **再利用性**: 他プロジェクトへの移植が容易

他のプロジェクトで使用する際は、ブランドカラーに合わせて色を調整し、
コンテンツに応じてアニメーション速度や要素数を最適化してください。