// SOLEX LOGISTICS - Form Handling

/**
 * フォーム処理専用クラス
 * お問い合わせフォーム、求人応募フォームなどの処理を管理
 */
class FormHandler {
  constructor() {
    this.forms = {};
    this.init();
  }

  /**
   * フォームハンドラーの初期化
   */
  init() {
    this.initAllForms();
    this.setupFormValidation();
  }

  /**
   * 全フォームの初期化
   */
  initAllForms() {
    // お問い合わせフォーム
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      this.forms.contact = new ContactForm(contactForm);
    }

    // 求人応募フォーム
    const recruitForm = document.querySelector('.recruit-form');
    if (recruitForm) {
      this.forms.recruit = new RecruitForm(recruitForm);
    }

    // ニュースレター登録フォーム
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      this.forms.newsletter = new NewsletterForm(newsletterForm);
    }
  }

  /**
   * 共通バリデーションの設定
   */
  setupFormValidation() {
    // 共通のバリデーションルール
    this.validationRules = {
      required: (value) => value.trim() !== '',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone: (value) => /^[\d-+()]+$/.test(value),
      minLength: (value, min) => value.length >= min,
      maxLength: (value, max) => value.length <= max,
      zipcode: (value) => /^\d{3}-?\d{4}$/.test(value)
    };

    // エラーメッセージ
    this.errorMessages = {
      required: 'この項目は必須です',
      email: 'メールアドレスの形式が正しくありません',
      phone: '電話番号の形式が正しくありません',
      minLength: (min) => `${min}文字以上で入力してください`,
      maxLength: (max) => `${max}文字以内で入力してください`,
      zipcode: '郵便番号の形式が正しくありません（例：123-4567）'
    };
  }

  /**
   * フィールドバリデーション
   */
  validateField(field, rules = []) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    for (const rule of rules) {
      if (typeof rule === 'string') {
        // 単純なルール
        if (!this.validationRules[rule](value)) {
          isValid = false;
          errorMessage = this.errorMessages[rule];
          break;
        }
      } else if (typeof rule === 'object') {
        // パラメータ付きルール
        const { type, param } = rule;
        if (!this.validationRules[type](value, param)) {
          isValid = false;
          errorMessage = typeof this.errorMessages[type] === 'function' 
            ? this.errorMessages[type](param)
            : this.errorMessages[type];
          break;
        }
      }
    }

    this.updateFieldError(field, isValid, errorMessage);
    return isValid;
  }

  /**
   * フィールドエラー表示の更新
   */
  updateFieldError(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    let errorElement = formGroup.querySelector('.form-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      formGroup.appendChild(errorElement);
    }

    if (isValid) {
      field.classList.remove('form-input--error');
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    } else {
      field.classList.add('form-input--error');
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  }

  /**
   * フォーム送信状態の管理
   */
  setFormSubmitting(form, isSubmitting) {
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select, button');

    if (isSubmitting) {
      form.classList.add('form--submitting');
      inputs.forEach(input => input.disabled = true);
      if (submitButton) {
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = '送信中...';
      }
    } else {
      form.classList.remove('form--submitting');
      inputs.forEach(input => input.disabled = false);
      if (submitButton && submitButton.dataset.originalText) {
        submitButton.textContent = submitButton.dataset.originalText;
      }
    }
  }

  /**
   * 成功メッセージの表示
   */
  showSuccessMessage(form, message) {
    let successElement = form.querySelector('.form-success');
    
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'alert alert--success form-success';
      form.insertBefore(successElement, form.firstChild);
    }

    successElement.textContent = message;
    successElement.style.display = 'block';

    // 3秒後に非表示
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }

  /**
   * エラーメッセージの表示
   */
  showErrorMessage(form, message) {
    let errorElement = form.querySelector('.form-error-general');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'alert alert--error form-error-general';
      form.insertBefore(errorElement, form.firstChild);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // 5秒後に非表示
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

/**
 * お問い合わせフォームクラス
 */
class ContactForm {
  constructor(form) {
    this.form = form;
    this.handler = new FormHandler();
    this.init();
  }

  init() {
    this.setupValidation();
    this.setupSubmission();
  }

  setupValidation() {
    const fields = {
      name: ['required', { type: 'minLength', param: 2 }],
      email: ['required', 'email'],
      phone: ['phone'],
      company: [],
      subject: ['required'],
      message: ['required', { type: 'minLength', param: 10 }]
    };

    Object.entries(fields).forEach(([fieldName, rules]) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.addEventListener('blur', () => {
          this.handler.validateField(field, rules);
        });

        field.addEventListener('input', () => {
          if (field.classList.contains('form-input--error')) {
            this.handler.validateField(field, rules);
          }
        });
      }
    });
  }

  setupSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // バリデーション
    const isValid = this.validateForm();
    if (!isValid) {
      const firstError = this.form.querySelector('.form-input--error');
      if (firstError) firstError.focus();
      return;
    }

    this.handler.setFormSubmitting(this.form, true);

    try {
      // 実際の送信処理（模擬）
      await this.submitToServer(data);
      
      this.handler.showSuccessMessage(this.form, 'お問い合わせを受け付けました。ありがとうございます。');
      this.form.reset();
      this.clearErrors();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.handler.showErrorMessage(this.form, '送信中にエラーが発生しました。しばらく後でもう一度お試しください。');
    } finally {
      this.handler.setFormSubmitting(this.form, false);
    }
  }

  validateForm() {
    const fields = {
      name: ['required', { type: 'minLength', param: 2 }],
      email: ['required', 'email'],
      phone: ['phone'],
      subject: ['required'],
      message: ['required', { type: 'minLength', param: 10 }]
    };

    let isValid = true;

    Object.entries(fields).forEach(([fieldName, rules]) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        if (!this.handler.validateField(field, rules)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  clearErrors() {
    const errorInputs = this.form.querySelectorAll('.form-input--error');
    const errorMessages = this.form.querySelectorAll('.form-error');

    errorInputs.forEach(input => input.classList.remove('form-input--error'));
    errorMessages.forEach(msg => {
      msg.textContent = '';
      msg.style.display = 'none';
    });
  }

  async submitToServer(data) {
    // 模擬的な送信処理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90%の確率で成功
        if (Math.random() > 0.1) {
          resolve({ success: true, message: '送信完了' });
        } else {
          reject(new Error('Server error'));
        }
      }, 1500);
    });
  }
}

/**
 * 求人応募フォームクラス
 */
class RecruitForm extends ContactForm {
  constructor(form) {
    super(form);
  }

  setupValidation() {
    const fields = {
      name: ['required', { type: 'minLength', param: 2 }],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      age: ['required'],
      experience: [],
      motivation: ['required', { type: 'minLength', param: 50 }],
      resume: []
    };

    Object.entries(fields).forEach(([fieldName, rules]) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.addEventListener('blur', () => {
          this.handler.validateField(field, rules);
        });

        field.addEventListener('input', () => {
          if (field.classList.contains('form-input--error')) {
            this.handler.validateField(field, rules);
          }
        });
      }
    });

    // ファイルアップロードの処理
    const fileInput = this.form.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e);
      });
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (file) {
      if (file.size > maxSize) {
        this.handler.updateFieldError(event.target, false, 'ファイルサイズは5MB以下にしてください');
        event.target.value = '';
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        this.handler.updateFieldError(event.target, false, 'PDF、JPEG、PNG形式のファイルのみアップロード可能です');
        event.target.value = '';
        return;
      }

      this.handler.updateFieldError(event.target, true, '');
    }
  }
}

/**
 * ニュースレター登録フォームクラス
 */
class NewsletterForm {
  constructor(form) {
    this.form = form;
    this.handler = new FormHandler();
    this.init();
  }

  init() {
    this.setupValidation();
    this.setupSubmission();
  }

  setupValidation() {
    const emailField = this.form.querySelector('input[type="email"]');
    if (emailField) {
      emailField.addEventListener('blur', () => {
        this.handler.validateField(emailField, ['required', 'email']);
      });

      emailField.addEventListener('input', () => {
        if (emailField.classList.contains('form-input--error')) {
          this.handler.validateField(emailField, ['required', 'email']);
        }
      });
    }
  }

  setupSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const emailField = this.form.querySelector('input[type="email"]');
    
    if (!this.handler.validateField(emailField, ['required', 'email'])) {
      emailField.focus();
      return;
    }

    this.handler.setFormSubmitting(this.form, true);

    try {
      // 模擬的な送信処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.handler.showSuccessMessage(this.form, 'ニュースレターの登録が完了しました。');
      this.form.reset();
      
    } catch (error) {
      this.handler.showErrorMessage(this.form, '登録中にエラーが発生しました。');
    } finally {
      this.handler.setFormSubmitting(this.form, false);
    }
  }
}

// グローバルスコープにエクスポート
window.FormHandler = FormHandler;
window.ContactForm = ContactForm;
window.RecruitForm = RecruitForm;
window.NewsletterForm = NewsletterForm;