document.addEventListener('DOMContentLoaded', () => {

    // Код для формы заявки (без изменений)
    const form = document.getElementById('lead-form');
    const formMessage = document.getElementById('form-message');
    if (form) {
        const submitButton = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            try {
                const response = await fetch('/api/submit-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                if (response.ok) { showMessage('✅ Спасибо! Ваша заявка принята.', 'success'); form.reset(); } 
                else { throw new Error('Ошибка на сервере. Попробуйте позже.'); }
            } catch (error) {
                showMessage(`❌ Ошибка: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить заявку';
            }
        });
    }
    function showMessage(message, type) {
        if (formMessage) { formMessage.textContent = message; formMessage.className = `form-alert ${type}`; formMessage.hidden = false; }
    }

    // Код для FAQ-аккордеона - ИСПРАВЛЕНО
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active'); // Просто переключаем класс у текущего элемента
                // Закрываем все остальные
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });

    // Код для мобильного меню (без изменений)
    const hamburgerButton = document.querySelector('.hamburger-button');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    if (hamburgerButton && mobileNav) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('is-active');
            mobileNav.classList.toggle('is-open');
        });
    }
    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('is-active');
                mobileNav.classList.remove('is-open');
            });
        });
    }

});