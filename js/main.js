// SOLEX LOGISTICS - Main JavaScript

/**
 * Main application controller
 * モバイルメニュー、スムーススクロール、フォーム処理などの基本機能を管理
 */
class SolexApp {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  /**
   * アプリケーション初期化
   */
  init() {
    this.setupEventListeners();
    this.initMobileMenu();
    this.initSmoothScroll();
    this.initHeaderScroll();
    this.initLazyLoading();
    this.initAnimationObserver();
    this.initNavigation();
    
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
    // JavaScript有効フラグを設定
    document.documentElement.classList.add('js-enabled');
    
    // ページローディング完了をマーク
    document.body.classList.add('loaded');
    
    // ナビゲーションアクティブ状態の設定
    this.setActiveNavigation();
    
    // アクセシビリティの初期化
    this.initAccessibility();
    
    // ページ固有の初期化
    this.initPageSpecific();
    
    // パフォーマンス計測
    this.measurePerformance();
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // リサイズイベント（デバウンス付き）
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // スクロールイベント（スロットル付き）
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          this.handleScroll();
          scrollTimeout = null;
        }, 16); // 60fps
      }
    }, { passive: true });

    // フォーカスイベント（キーボードナビゲーション）
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });

    // エラーハンドリング
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', e.error);
    });
  }

  /**
   * モバイルメニューの初期化
   */
  initMobileMenu() {
    const menuToggle = document.querySelector('.header__nav-toggle');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__nav-link');

    if (!menuToggle || !nav) return;

    // メニュートグルボタンのクリックイベント
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      // ARIA属性の更新
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      
      // クラスの切り替え
      nav.classList.toggle('header__nav--active');
      document.body.classList.toggle('menu-open');
      
      // スクロール制御
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // メニューリンクのクリック時にメニューを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * モバイルメニューを閉じる
   */
  closeMobileMenu() {
    const menuToggle = document.querySelector('.header__nav-toggle');
    const nav = document.querySelector('.header__nav');
    
    if (!menuToggle || !nav) return;

    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('header__nav--active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  /**
   * スムーススクロールの初期化
   */
  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        
        // ヘッダーの高さを考慮してスクロール
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // フォーカス管理
        target.focus({ preventScroll: true });
      });
    });
  }

  /**
   * ヘッダースクロール効果の初期化
   */
  initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      // スクロール方向の判定（モバイルでは非表示にしない）
      if (window.innerWidth > 768) {
        if (scrollY > lastScrollY && scrollY > 100) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      } else {
        header.classList.remove('header--hidden');
      }

      // スクロール位置に応じた透明度調整
      if (scrollY > 20) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    // スクロールイベントのスロットル処理
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * 現在のページを取得
   */
  getCurrentPage() {
    // body要素のdata-page属性から取得
    const bodyPage = document.body?.dataset?.page;
    if (bodyPage) return bodyPage;
    
    // URLパスから推測
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const pageName = filename.replace('.html', '');
    
    return pageName === '' || pageName === 'index' ? 'index' : pageName;
  }

  /**
   * ナビゲーション機能の初期化
   */
  initNavigation() {
    // ページ読み込み時のアクティブ状態設定は onDOMReady で実行
    
    // ナビゲーションリンクのクリックイベント
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // 外部リンクや特別な処理が必要でない限り、デフォルトの動作を許可
        const href = link.getAttribute('href');
        
        // アンカーリンクの場合はスムーススクロール処理
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.scrollToElement(target);
          }
        }
        
        // モバイルメニューを閉じる
        this.closeMobileMenu();
      });
    });
  }

  /**
   * アクティブナビゲーションの設定
   */
  setActiveNavigation() {
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    navLinks.forEach(link => {
      // 既存のアクティブクラスを削除
      link.classList.remove('header__nav-link--active');
      link.removeAttribute('aria-current');
      
      // 現在のページに対応するリンクにアクティブクラスを追加
      const linkPage = link.dataset.page;
      if (linkPage === this.currentPage) {
        link.classList.add('header__nav-link--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * 遅延読み込みの初期化
   */
  initLazyLoading() {
    // ネイティブlazy loadingサポートをチェック
    if ('loading' in HTMLImageElement.prototype) {
      // ネイティブサポートがある場合、すべての画像にloadedクラスを追加
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    }

    // Intersection Observer APIをサポートしている場合のみカスタム遅延読み込みを実行
    if (!('IntersectionObserver' in window)) {
      // フォールバック：すべての画像を即座に読み込み
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 実際の画像をロード（data-src属性を使用する場合）
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          // srcset属性もサポート
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }

          // ローディング完了クラスを追加
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });

          // 既に読み込み完了している場合
          if (img.complete) {
            img.classList.add('loaded');
          }

          // 監視を停止
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // 50px手前で読み込み開始
    });

    // カスタム遅延読み込み対象の画像を監視（data-src属性を持つもの）
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * アニメーション監視の初期化
   */
  initAnimationObserver() {
    if (!('IntersectionObserver' in window)) return;

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // 一度アニメーションしたら監視を停止
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
      animationObserver.observe(el);
    });

    // 自動的にアニメーション要素を追加
    this.addAnimationClasses();
    
    // アニメーション準備完了をマーク
    setTimeout(() => {
      document.documentElement.classList.add('animations-ready');
    }, 100);
  }

  /**
   * アニメーション用クラスを自動追加
   */
  addAnimationClasses() {
    // JavaScriptが有効な場合のみアニメーションクラスを追加
    if (!document.documentElement.classList.contains('js-enabled')) {
      console.log('JS not enabled, skipping animations');
      return;
    }

    const elements = [
      '.features__item',
      '.services-preview__item',
      '.recruitment-cta__content',
      '.recruitment-cta__visual'
    ];

    elements.forEach(selector => {
      const items = document.querySelectorAll(selector);
      items.forEach((item, index) => {
        // アニメーションクラスは後で追加
        setTimeout(() => {
          item.classList.add('animate-on-scroll');
          item.style.animationDelay = `${index * 0.1}s`;
        }, 200);
      });
    });
  }

  /**
   * アクセシビリティ機能の初期化
   */
  initAccessibility() {
    // フォーカス可能な要素にスキップリンク機能を追加
    this.initSkipLinks();
    
    // キーボードナビゲーションの強化
    this.enhanceKeyboardNavigation();
    
    // ARIA属性の動的更新
    this.updateAriaAttributes();
  }

  /**
   * スキップリンクの初期化
   */
  initSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * キーボードナビゲーションの強化
   */
  enhanceKeyboardNavigation() {
    // Tabキーでのフォーカス移動を視覚的に分かりやすくする
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    // マウス操作時はキーボードナビゲーション表示を無効化
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * ARIA属性の動的更新
   */
  updateAriaAttributes() {
    // 展開可能な要素の状態を適切に管理
    const expandableElements = document.querySelectorAll('[aria-expanded]');
    
    expandableElements.forEach(element => {
      const target = document.querySelector(element.getAttribute('aria-controls'));
      if (target) {
        const isExpanded = !target.hidden && target.style.display !== 'none';
        element.setAttribute('aria-expanded', isExpanded.toString());
      }
    });
  }

  /**
   * リサイズ処理
   */
  handleResize() {
    // モバイルメニューが開いている場合は閉じる
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }

    // ヘッダー高さの再計算
    this.updateHeaderHeight();

    // パララックス効果のリセット
    if (window.innerWidth < 768) {
      const parallaxElements = document.querySelectorAll('.hero__visual, .recruitment-cta__visual');
      parallaxElements.forEach(element => {
        element.style.transform = '';
      });
    }
  }

  /**
   * スクロール処理
   */
  handleScroll() {
    // 現在のスクロール位置を記録
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
  }

  /**
   * ヘッダー高さの更新
   */
  updateHeaderHeight() {
    const header = document.querySelector('.header');
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    }
  }

  /**
   * パフォーマンス計測
   */
  measurePerformance() {
    if ('performance' in window && 'navigation' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Page Load Performance:', {
            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
            'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
          });
        }, 0);
      });
    }
  }

  /**
   * ユーティリティ: 要素の表示状態を切り替え
   */
  toggleElement(element, show = null) {
    if (!element) return;

    const isVisible = show !== null ? show : element.hidden || element.style.display === 'none';
    
    element.hidden = !isVisible;
    element.setAttribute('aria-hidden', (!isVisible).toString());
    
    if (isVisible) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  }

  /**
   * ユーティリティ: スムーズスクロール
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;

    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // フォーカス管理
    element.focus({ preventScroll: true });
  }

  /**
   * ページ固有の初期化処理
   */
  initPageSpecific() {
    switch (this.currentPage) {
      case 'index':
        this.initHomePage();
        break;
      case 'about':
        this.initAboutPage();
        break;
      case 'services':
        this.initServicesPage();
        break;
      case 'recruit':
        this.initRecruitPage();
        break;
      case 'contact':
        this.initContactPage();
        break;
      default:
        // デフォルトの初期化
        break;
    }
  }

  /**
   * トップページ固有の初期化
   */
  initHomePage() {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add('hero-animate-in');
      }, 300);
    }

    // 社名変更告知の注意を引くアニメーション
    const announcement = document.querySelector('.hero__announcement');
    if (announcement) {
      // 初回アニメーション
      setTimeout(() => {
        announcement.classList.add('pulse-animation');
      }, 1000);

      // 定期的なパルス効果（控えめに）
      setInterval(() => {
        announcement.classList.add('pulse-animation');
        setTimeout(() => {
          announcement.classList.remove('pulse-animation');
        }, 2000);
      }, 15000); // 15秒ごと
    }

    // パララックス効果の初期化
    this.initParallax();
    
    // タイピング効果の初期化
    this.initTypingEffect();
  }

  /**
   * パララックス効果の初期化
   */
  initParallax() {
    if (window.innerWidth < 768) return; // モバイルでは無効

    const parallaxElements = document.querySelectorAll('.hero__visual, .recruitment-cta__visual');
    
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach(element => {
        if (this.isElementInViewport(element)) {
          element.style.transform = `translateY(${rate}px)`;
        }
      });
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 16), { passive: true });
  }

  /**
   * タイピング効果の初期化
   */
  initTypingEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    // ページロード後に開始
    setTimeout(typeWriter, 800);
  }

  /**
   * 要素がビューポート内にあるかチェック
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  /**
   * 会社案内ページ固有の初期化
   */
  initAboutPage() {
    // 会社案内ページ固有の機能をここに追加
    console.log('About page initialized');
  }

  /**
   * サービスページ固有の初期化
   */
  initServicesPage() {
    // サービスページ固有の機能をここに追加
    console.log('Services page initialized');
  }

  /**
   * 求人ページ固有の初期化
   */
  initRecruitPage() {
    // 求人ページ固有の機能をここに追加
    console.log('Recruit page initialized');
  }

  /**
   * お問い合わせページ固有の初期化
   */
  initContactPage() {
    // お問い合わせページ固有の機能をここに追加
    this.initContactForm();
  }

  /**
   * お問い合わせフォームの初期化
   */
  initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // フォームバリデーション
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        // リアルタイムバリデーション（エラー状態の場合のみ）
        if (input.classList.contains('form-input--error')) {
          this.validateField(input);
        }
      });
    });

    // フォーム送信
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
  }

  /**
   * フィールドバリデーション
   */
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // 必須チェック
    if (isRequired && !value) {
      isValid = false;
      errorMessage = 'この項目は必須です。';
    }

    // メールアドレスのチェック
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'メールアドレスの形式が正しくありません。';
      }
    }

    // 電話番号のチェック
    if (fieldType === 'tel' && value) {
      const phoneRegex = /^[\d-+()]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = '電話番号の形式が正しくありません。';
      }
    }

    // エラー表示の更新
    this.updateFieldError(field, isValid, errorMessage);
    
    return isValid;
  }

  /**
   * フィールドエラー表示の更新
   */
  updateFieldError(field, isValid, errorMessage) {
    const errorElement = field.parentElement.querySelector('.form-error');
    
    if (isValid) {
      field.classList.remove('form-input--error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    } else {
      field.classList.add('form-input--error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
      }
    }
  }

  /**
   * フォーム送信処理
   */
  handleFormSubmit(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    // 全フィールドのバリデーション
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // 最初のエラーフィールドにフォーカス
      const firstError = form.querySelector('.form-input--error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // フォーム送信処理（実際の実装では適切なエンドポイントに送信）
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';

    // 模擬的な送信処理
    setTimeout(() => {
      alert('お問い合わせを送信しました。ありがとうございます。');
      form.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      
      // エラー状態をクリア
      inputs.forEach(input => {
        input.classList.remove('form-input--error');
        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      });
    }, 1500);
  }

  /**
   * ユーティリティ: デバウンス関数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * ユーティリティ: スロットル関数
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * ユーティリティ: 要素の可視性チェック
   */
  isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /**
   * ユーティリティ: CSS変数の設定
   */
  setCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  /**
   * ユーティリティ: 要素の高さをCSS変数として設定
   */
  setElementHeightAsVariable(element, variableName) {
    if (element) {
      const height = element.offsetHeight;
      this.setCSSVariable(variableName, `${height}px`);
    }
  }
}

// アプリケーションの初期化
const app = new SolexApp();

// グローバルスコープに必要な関数をエクスポート
window.SolexApp = SolexApp;

// PWA対応のためのService Worker登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// パフォーマンス監視
if ('performance' in window) {
  window.addEventListener('load', function() {
    // Core Web Vitals の計測
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      }
    });
    
    observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
  });
}