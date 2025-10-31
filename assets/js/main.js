document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.getElementById('site-header');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a[href^="#"]') : [];
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastFocusedElement = null;
  let trapFocusHandler = null;
  let heroAnimationFrameId = null;

  const toggleHeaderShadow = () => {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  };

  window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  toggleHeaderShadow();

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    lastFocusedElement = document.activeElement;
    mobileMenu.classList.remove('hidden');
    mobileMenuButton?.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';

    const focusableItems = mobileMenu.querySelectorAll(focusableSelector);
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];
    firstItem?.focus();

    trapFocusHandler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }
      if (event.key !== 'Tab' || focusableItems.length === 0) return;
      if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      } else if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      }
    };

    document.addEventListener('keydown', trapFocusHandler);
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    body.style.removeProperty('overflow');
    if (trapFocusHandler) {
      document.removeEventListener('keydown', trapFocusHandler);
      trapFocusHandler = null;
    }
    lastFocusedElement?.focus();
  };

  mobileMenuButton?.addEventListener('click', () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  const smoothScrollTo = (targetId) => {
    if (!targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetElement = document.querySelector(href);
      if (!targetElement) return;
      event.preventDefault();
      closeMobileMenu();
      smoothScrollTo(href);
    });
  });

  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const target = button.getAttribute('data-scroll-target');
      smoothScrollTo(target);
    });
  });

  const setupScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    const animatedLines = document.querySelectorAll('[data-animate-line]');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const revealCards = document.querySelectorAll('.reveal-card');

    const showImmediately = () => {
      [...animatedElements, ...animatedLines, ...timelineSteps, ...revealCards].forEach((element) => {
        element.classList.add('is-visible');
      });
    };

    if (prefersReducedMotion.matches) {
      showImmediately();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      showImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    const registerElements = (elements, stepDelay = 0) => {
      elements.forEach((element, index) => {
        if (stepDelay > 0 && !element.dataset.animateDelay) {
          element.style.transitionDelay = `${index * stepDelay}ms`;
        } else if (element.dataset.animateDelay) {
          element.style.transitionDelay = `${element.dataset.animateDelay}ms`;
        }
        observer.observe(element);
      });
    };

    registerElements(animatedElements);
    registerElements(animatedLines);
    registerElements(revealCards);
    registerElements(timelineSteps, 120);

    prefersReducedMotion.addEventListener?.('change', (event) => {
      if (event.matches) {
        observer.disconnect();
        showImmediately();
      }
    });
  };

  const setupGlowEffects = () => {
    const glowTargets = document.querySelectorAll('[data-glow]');
    if (!glowTargets.length) return;

    const resetGlow = (target) => {
      target.style.setProperty('--glow-x', '50%');
      target.style.setProperty('--glow-y', '50%');
    };

    const handlePointerMove = (event) => {
      if (prefersReducedMotion.matches) return;
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--glow-x', `${x}%`);
      target.style.setProperty('--glow-y', `${y}%`);
    };

    glowTargets.forEach((target) => {
      resetGlow(target);
      target.addEventListener('pointermove', handlePointerMove);
      target.addEventListener('pointerleave', () => resetGlow(target));
      target.addEventListener('focus', () => resetGlow(target));
      target.addEventListener('blur', () => resetGlow(target));
    });

    prefersReducedMotion.addEventListener?.('change', (event) => {
      if (event.matches) {
        glowTargets.forEach((target) => resetGlow(target));
      }
    });
  };

  const setupHeroDrift = () => {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    const ribbons = heroSection.querySelectorAll('.hero-ribbon');
    if (!ribbons.length) return;

    let tick = 0;

    const setRibbonOffset = (x = 0, y = 0) => {
      ribbons.forEach((ribbon) => {
        ribbon.style.setProperty('--ribbon-x', `${x}px`);
        ribbon.style.setProperty('--ribbon-y', `${y}px`);
      });
    };

    const drift = () => {
      if (prefersReducedMotion.matches) {
        setRibbonOffset();
        heroAnimationFrameId = null;
        return;
      }

      tick += 0.006;

      ribbons.forEach((ribbon, index) => {
        const amplitudeX = index === 0 ? 16 : 22;
        const amplitudeY = index === 0 ? 9 : 7;
        const phase = index * 0.8;
        const offsetX = Math.sin(tick + phase) * amplitudeX;
        const offsetY = Math.cos(tick * 0.8 + phase) * amplitudeY;
        ribbon.style.setProperty('--ribbon-x', `${offsetX}px`);
        ribbon.style.setProperty('--ribbon-y', `${offsetY}px`);
      });

      heroAnimationFrameId = requestAnimationFrame(drift);
    };

    const start = () => {
      if (heroAnimationFrameId !== null || prefersReducedMotion.matches) {
        setRibbonOffset();
        return;
      }
      heroAnimationFrameId = requestAnimationFrame(drift);
    };

    const stop = () => {
      if (heroAnimationFrameId !== null) {
        cancelAnimationFrame(heroAnimationFrameId);
        heroAnimationFrameId = null;
      }
      setRibbonOffset();
    };

    start();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    prefersReducedMotion.addEventListener?.('change', (event) => {
      if (event.matches) {
        stop();
      } else {
        start();
      }
    });
  };

  setupScrollAnimations();
  setupGlowEffects();
  setupHeroDrift();

  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const privacyCheckbox = document.getElementById('privacy');
  const privacyErrorMessage = document.querySelector('[data-error-for="privacy"]');

  const successFeedbackClasses = ['border-brand-sky/30', 'bg-brand-sky/10', 'text-brand-blue'];
  const errorFeedbackClasses = ['border-red-300', 'bg-red-50', 'text-red-600'];

  const resetFeedback = () => {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.classList.add('hidden');
    feedback.classList.remove(...successFeedbackClasses, ...errorFeedbackClasses);
  };

  const showFeedback = (message, type = 'success') => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('hidden');
    if (type === 'success') {
      feedback.classList.remove(...errorFeedbackClasses);
      feedback.classList.add(...successFeedbackClasses);
    } else {
      feedback.classList.remove(...successFeedbackClasses);
      feedback.classList.add(...errorFeedbackClasses);
    }
  };

  const showFieldError = (field, message) => {
    if (!field) return;
    const errorMessage = document.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('border-red-500', 'focus:ring-red-200');
    errorMessage?.classList.remove('hidden');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  };

  const clearFieldError = (field) => {
    if (!field) return;
    const errorMessage = document.querySelector(`[data-error-for="${field.id}"]`);
    field.removeAttribute('aria-invalid');
    field.classList.remove('border-red-500', 'focus:ring-red-200');
    errorMessage?.classList.add('hidden');
  };

  if (feedback) {
    feedback.classList.add('hidden');
  }

  form?.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    clearFieldError(target);
  });

  privacyCheckbox?.addEventListener('change', () => {
    if (privacyCheckbox.checked) {
      privacyErrorMessage?.classList.add('hidden');
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    resetFeedback();
    if (!form) return;

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    const privacyField = form.querySelector('#privacy');

    let hasError = false;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameField instanceof HTMLInputElement && nameField.value.trim() === '') {
      hasError = true;
      showFieldError(nameField, 'お名前を入力してください。');
    }

    if (emailField instanceof HTMLInputElement) {
      if (emailField.value.trim() === '' || !emailPattern.test(emailField.value.trim())) {
        hasError = true;
        showFieldError(emailField, '正しいメールアドレスを入力してください。');
      }
    }

    if (messageField instanceof HTMLTextAreaElement && messageField.value.trim() === '') {
      hasError = true;
      showFieldError(messageField, 'お問い合わせ内容を入力してください。');
    }

    if (privacyField instanceof HTMLInputElement) {
      if (!privacyField.checked) {
        hasError = true;
        privacyErrorMessage?.classList.remove('hidden');
      } else {
        privacyErrorMessage?.classList.add('hidden');
      }
    }

    if (hasError) {
      showFeedback('入力内容をご確認ください。必須項目の入力が必要です。', 'error');
      return;
    }

    showFeedback('送信が完了しました。担当者より折り返しご連絡いたします。', 'success');
    form.reset();
  });
});
