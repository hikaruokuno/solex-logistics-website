// SOLEX LOGISTICS - Animation Controller

/**
 * アニメーション制御クラス
 * マイクロインタラクション、パララックス効果、フェードインアニメーションを管理
 */
class AnimationController {
  constructor() {
    this.init();
  }

  /**
   * アニメーション機能の初期化
   */
  init() {
    // ユーザーがモーション削減を設定している場合は初期化をスキップ
    if (this.prefersReducedMotion()) {
      console.log('Reduced motion preference detected. Animations disabled.');
      return;
    }

    this.initFadeInAnimations();
    this.initHoverEffects();
    this.initScrollAnimations();
    this.initParallaxEffects();
    this.initCounterAnimations();
    this.initTypewriterEffects();
    this.initMicroInteractions();
    this.initParticleAnimation();
    this.initModernHeroAnimations();
    
    // DOM読み込み完了後の処理
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMReady();
      });
    } else {
      this.onDOMReady();
    }
  }

  /**
   * DOM読み込み完了時の処理
   */
  onDOMReady() {
    // 初期アニメーションのトリガー
    this.triggerInitialAnimations();
    
    // アニメーション用CSSクラスの追加
    document.body.classList.add('animations-ready');
  }

  /**
   * ユーザーのモーション設定をチェック
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * フェードインアニメーションの初期化
   */
  initFadeInAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          setTimeout(() => {
            element.classList.add('fade-in-active');
          }, parseInt(delay));
          
          fadeObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    // フェードイン対象要素を監視
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
      fadeObserver.observe(el);
    });
  }

  /**
   * ホバー効果の初期化
   */
  initHoverEffects() {
    // カード要素のホバー効果
    const cards = document.querySelectorAll('.features__item, .services-preview__item');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverGlow(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverGlow(card);
      });
    });

    // ボタンの波紋効果
    const buttons = document.querySelectorAll('.hero__cta-button, .recruitment-cta__button');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(button, e);
      });
    });
  }

  /**
   * スクロールアニメーションの初期化
   */
  initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animation || 'slideUp';
          
          element.classList.add('animate-in', `animate-${animationType}`);
          scrollObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    // スクロールアニメーション対象要素を監視
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  /**
   * パララックス効果の初期化
   */
  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * カウンターアニメーションの初期化
   */
  initCounterAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          this.animateCounter(counter);
          counterObserver.unobserve(counter);
        }
      });
    }, {
      threshold: 0.5
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  /**
   * タイプライター効果の初期化
   */
  initTypewriterEffects() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      element.style.borderRight = '2px solid';
      element.style.animation = 'blink 1s infinite';
      
      this.typeWriter(element, text, speed);
    });
  }

  /**
   * マイクロインタラクションの初期化
   */
  initMicroInteractions() {
    // ロゴのアニメーション
    const logo = document.querySelector('.header__logo-img');
    if (logo) {
      logo.addEventListener('click', () => {
        this.logoAnimation(logo);
      });
    }

    // 社名変更告知のパルス効果
    const announcement = document.querySelector('.hero__announcement');
    if (announcement) {
      setInterval(() => {
        this.pulseAnimation(announcement);
      }, 5000); // 5秒ごと
    }

    // ナビゲーションリンクのアニメーション
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.navLinkHover(link);
      });
    });
  }

  /**
   * 初期アニメーションのトリガー
   */
  triggerInitialAnimations() {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add('hero-animate-in');
      }, 300);
    }

    // 社名変更告知のアニメーション
    const announcement = document.querySelector('.hero__announcement');
    if (announcement) {
      setTimeout(() => {
        announcement.classList.add('announcement-animate-in');
      }, 600);
    }
  }

  /**
   * ホバーグロー効果を追加
   */
  addHoverGlow(element) {
    element.style.boxShadow = '0 10px 30px rgba(30, 136, 229, 0.3)';
    element.style.transform = 'translateY(-8px) scale(1.02)';
  }

  /**
   * ホバーグロー効果を削除
   */
  removeHoverGlow(element) {
    element.style.boxShadow = '';
    element.style.transform = '';
  }

  /**
   * 波紋効果を作成
   */
  createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * カウンターアニメーション
   */
  animateCounter(counter) {
    const target = parseInt(counter.dataset.target) || 0;
    const duration = parseInt(counter.dataset.duration) || 2000;
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  }

  /**
   * タイプライター効果
   */
  typeWriter(element, text, speed) {
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // タイピング完了後、カーソルを点滅させる
        element.style.borderRight = '2px solid transparent';
        element.style.animation = 'blink 1s infinite';
      }
    };
    
    type();
  }

  /**
   * ロゴアニメーション
   */
  logoAnimation(logo) {
    logo.style.transform = 'rotate(360deg) scale(1.1)';
    logo.style.transition = 'transform 0.6s ease';
    
    setTimeout(() => {
      logo.style.transform = '';
    }, 600);
  }

  /**
   * パルスアニメーション
   */
  pulseAnimation(element) {
    element.style.animation = 'pulse 1s ease-in-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 1000);
  }

  /**
   * ナビゲーションリンクホバー効果
   */
  navLinkHover(link) {
    const underline = document.createElement('span');
    underline.classList.add('nav-underline');
    
    if (!link.querySelector('.nav-underline')) {
      link.appendChild(underline);
      
      setTimeout(() => {
        underline.style.width = '100%';
      }, 10);
    }
  }

  /**
   * スクロール位置に基づく要素のアニメーション
   */
  animateOnScroll() {
    const elements = document.querySelectorAll('[data-scroll-animation]');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        const animationType = element.dataset.scrollAnimation;
        element.classList.add('animated', animationType);
      }
    });
  }

  /**
   * 要素を段階的にフェードイン
   */
  staggeredFadeIn(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in-active');
      }, index * delay);
    });
  }

  /**
   * スムーズな高さアニメーション
   */
  slideToggle(element, duration = 300) {
    if (element.style.display === 'none' || !element.style.maxHeight) {
      // 開く
      element.style.display = 'block';
      element.style.maxHeight = '0px';
      element.style.overflow = 'hidden';
      element.style.transition = `max-height ${duration}ms ease`;
      
      setTimeout(() => {
        element.style.maxHeight = element.scrollHeight + 'px';
      }, 10);
      
      setTimeout(() => {
        element.style.maxHeight = '';
        element.style.overflow = '';
        element.style.transition = '';
      }, duration);
    } else {
      // 閉じる
      element.style.maxHeight = element.scrollHeight + 'px';
      element.style.overflow = 'hidden';
      element.style.transition = `max-height ${duration}ms ease`;
      
      setTimeout(() => {
        element.style.maxHeight = '0px';
      }, 10);
      
      setTimeout(() => {
        element.style.display = 'none';
        element.style.maxHeight = '';
        element.style.overflow = '';
        element.style.transition = '';
      }, duration);
    }
  }

  /**
   * 数値の滑らかなアニメーション
   */
  animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング関数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    requestAnimationFrame(updateNumber);
  }

  /**
   * パーティクルアニメーションの初期化
   */
  initParticleAnimation() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // キャンバスサイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // パーティクルクラス
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // パーティクル生成
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * モダンヒーローアニメーションの初期化
   */
  initModernHeroAnimations() {
    // データアニメーション属性を持つ要素を監視
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    if (!animatedElements.length) return;

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animation;
          
          switch(animationType) {
            case 'stagger':
              this.animateStaggerText(element);
              break;
            case 'fade-up':
              element.style.animationPlayState = 'running';
              break;
            case 'fade-left':
              element.style.animationPlayState = 'running';
              break;
            case 'fade-in':
              element.style.animationPlayState = 'running';
              break;
          }
          
          heroObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      // アニメーションを一時停止
      if (element.dataset.animation !== 'stagger') {
        element.style.animationPlayState = 'paused';
      }
      heroObserver.observe(element);
    });
  }

  /**
   * スタッガーテキストアニメーション
   */
  animateStaggerText(element) {
    const words = element.querySelectorAll('.hero__title-word');
    words.forEach((word, index) => {
      word.style.animationDelay = `${index * 0.1}s`;
      word.style.animationPlayState = 'running';
    });
  }
}

// CSS アニメーション定義を動的に追加
const addAnimationStyles = () => {
  const styles = `
    /* フェードインアニメーション */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-active {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* スクロールアニメーション */
    .animate-in {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s ease;
    }
    
    .animate-slideUp {
      transform: translateY(0);
    }
    
    .animate-slideLeft {
      transform: translateX(0);
    }
    
    .animate-scale {
      transform: scale(1);
    }
    
    /* ヒーローアニメーション */
    .hero-animate-in {
      animation: heroSlideIn 1s ease-out;
    }
    
    .announcement-animate-in {
      animation: announcementBounce 0.8s ease-out;
    }
    
    /* 波紋効果 */
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-effect 0.6s linear;
      pointer-events: none;
    }
    
    /* パルス効果 */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    /* ヒーロースライドイン */
    @keyframes heroSlideIn {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    /* 告知バウンス */
    @keyframes announcementBounce {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
      }
      60% {
        opacity: 1;
        transform: scale(1.05) translateY(0);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    /* 波紋エフェクト */
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    /* 点滅効果 */
    @keyframes blink {
      0%, 50% { border-color: transparent; }
      51%, 100% { border-color: currentColor; }
    }
    
    /* ナビゲーションアンダーライン */
    .nav-underline {
      position: absolute;
      bottom: -2px;
      left: 0;
      height: 2px;
      width: 0;
      background: linear-gradient(135deg, #FF8F00, #FFA726);
      transition: width 0.3s ease;
    }
    
    /* レスポンシブアニメーション調整 */
    @media (max-width: 768px) {
      .fade-in {
        transform: translateY(20px);
      }
      
      .hero-animate-in {
        animation-duration: 0.8s;
      }
      
      .announcement-animate-in {
        animation-duration: 0.6s;
      }
    }
    
    /* 低パフォーマンスデバイス用の軽量アニメーション */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
};

// スタイルを追加
addAnimationStyles();

// アニメーションコントローラーの初期化
const animationController = new AnimationController();

// グローバルスコープにエクスポート
window.AnimationController = AnimationController;