// SOLEX LOGISTICS - Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initContactMethods();
    initContactForm();
    initFAQ();
    initFormValidation();
});

// Contact Method Selection
function initContactMethods() {
    const methodCards = document.querySelectorAll('.contact-method');
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.method;
            selectContactMethod(method);
        });
    });
}

function selectContactMethod(method) {
    // Update UI
    document.querySelectorAll('.contact-method').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-method="${method}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Update form
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    if (inquiryTypeSelect) {
        inquiryTypeSelect.value = method;
        updateDynamicFields(method);
    }
    
    // Scroll to form
    const formSection = document.getElementById('contact-form');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Dynamic Form Fields
function initContactForm() {
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    
    if (inquiryTypeSelect) {
        inquiryTypeSelect.addEventListener('change', (e) => {
            updateDynamicFields(e.target.value);
        });
    }
}

function updateDynamicFields(inquiryType) {
    // Hide all dynamic sections
    const dynamicSections = document.querySelectorAll('.form__dynamic-section');
    dynamicSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show relevant section
    const targetSection = document.getElementById(`${inquiryType}-fields`);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Add smooth animation
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetSection.style.transition = 'all 0.3s ease';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }, 10);
    }
}

// FAQ Functionality
function initFAQ() {
    // Category switching
    const categoryBtns = document.querySelectorAll('.faq__category-btn');
    const faqContents = document.querySelectorAll('.faq__content');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update buttons
            categoryBtns.forEach(b => b.classList.remove('faq__category-btn--active'));
            btn.classList.add('faq__category-btn--active');
            
            // Update content
            faqContents.forEach(content => {
                content.classList.remove('faq__content--active');
            });
            
            const targetContent = document.getElementById(`faq-${category}`);
            if (targetContent) {
                targetContent.classList.add('faq__content--active');
            }
        });
    });
    
    // Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq__item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all items in the same category
            const currentCategory = question.closest('.faq__content');
            const allItems = currentCategory.querySelectorAll('.faq__item');
            allItems.forEach(item => {
                item.classList.remove('active');
                const q = item.querySelector('.faq__question');
                q.setAttribute('aria-expanded', 'false');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'この項目は必須です';
    }
    
    // Specific field validation
    switch (fieldName) {
        case 'contact_name':
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'お名前は2文字以上で入力してください';
            }
            break;
            
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = '正しいメールアドレスを入力してください';
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = '正しい電話番号を入力してください（例：03-1234-5678）';
            }
            break;
            
        case 'message':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'お問い合わせ内容は10文字以上で入力してください';
            }
            break;
    }
    
    // Show/hide error
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        clearError(field);
    }
    
    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.getElementById(`${field.name.replace('[]', '')}-error`) || 
                        document.getElementById(`${field.id}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(field) {
    field.classList.remove('error');
    
    const errorElement = document.getElementById(`${field.name.replace('[]', '')}-error`) || 
                        document.getElementById(`${field.id}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Japanese phone number patterns
    const phoneRegex = /^(\d{2,4}-\d{2,4}-\d{4}|\d{10,11})$/;
    return phoneRegex.test(phone.replace(/[^\d-]/g, ''));
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    
    // Validate all fields
    let isFormValid = true;
    const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Check privacy policy
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        showError(privacyCheckbox, 'プライバシーポリシーに同意してください');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.form__input.error, .form__select.error, .form__textarea.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessMessage() {
    const formContent = document.querySelector('.contact-form__content');
    const successMessage = document.getElementById('success-message');
    
    if (formContent && successMessage) {
        formContent.style.display = 'none';
        successMessage.style.display = 'flex';
        
        // Scroll to success message
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function resetForm() {
    const form = document.getElementById('contactForm');
    const formContent = document.querySelector('.contact-form__content');
    const successMessage = document.getElementById('success-message');
    
    if (form) {
        form.reset();
        
        // Clear all errors
        const fields = form.querySelectorAll('.form__input, .form__select, .form__textarea');
        fields.forEach(clearError);
        
        // Hide dynamic fields
        const dynamicSections = document.querySelectorAll('.form__dynamic-section');
        dynamicSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Reset contact method selection
        document.querySelectorAll('.contact-method').forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    if (formContent && successMessage) {
        successMessage.style.display = 'none';
        formContent.style.display = 'block';
    }
}

// Utility Functions
function debounce(func, wait) {
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

// Export functions for global access
window.selectContactMethod = selectContactMethod;
window.resetForm = resetForm;

// Analytics tracking (if needed)
function trackFormEvent(event, data = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            event_category: 'Contact Form',
            ...data
        });
    }
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track method selection
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('click', () => {
            trackFormEvent('method_selected', {
                method_type: method.dataset.method
            });
        });
    });
    
    // Track form submission attempts
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', () => {
            const inquiryType = document.getElementById('inquiry-type').value;
            trackFormEvent('form_submitted', {
                inquiry_type: inquiryType
            });
        });
    }
    
    // Track FAQ interactions
    document.querySelectorAll('.faq__question').forEach(question => {
        question.addEventListener('click', () => {
            trackFormEvent('faq_opened', {
                question: question.querySelector('.faq__question-text').textContent
            });
        });
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Improve keyboard navigation for contact methods
    document.querySelectorAll('.contact-method').forEach(method => {
        method.setAttribute('tabindex', '0');
        method.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                method.click();
            }
        });
    });
    
    // Improve screen reader announcements
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            if (e.defaultPrevented) {
                // Form has errors
                const errorCount = form.querySelectorAll('.form__error.show').length;
                if (errorCount > 0) {
                    announceToScreenReader(`フォームに${errorCount}個のエラーがあります。修正してください。`);
                }
            }
        });
    }
});

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}