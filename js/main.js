document.addEventListener('DOMContentLoaded', () => {

    // !!! НОВЫЙ БЛОК: Инициализация маски ввода для телефона !!!
    const phoneInput = document.getElementById('phone');
    let phoneMask; // Объявляем переменную для маски здесь

    if (phoneInput) {
        phoneMask = IMask(phoneInput, {
            mask: '+7 (000) 000-00-00',
            lazy: false // Показывать маску сразу, а не при вводе
        });
    }


    // ==========================================================================
    // Код для формы заявки
    // ==========================================================================
    const form = document.getElementById('lead-form');
    const formMessage = document.getElementById('form-message');
    if (form) {
        const submitButton = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // !!! ИЗМЕНЕННЫЙ БЛОК ВАЛИДАЦИИ И ФОРМАТИРОВАНИЯ !!!
            if (phoneMask) {
                // 1. Получаем "чистый" номер без маски (только 10 цифр)
                const unmaskedPhone = phoneMask.unmaskedValue;

                // 2. Проверяем, что номер введен полностью
                if (unmaskedPhone.length !== 10) {
                    showMessage('❌ Пожалуйста, введите номер телефона полностью.', 'error');
                    return; // Прерываем отправку
                }

                // 3. Формируем номер для отправки в CRM в формате +7XXXXXXXXXX
                data.phone = `+7${unmaskedPhone}`;
            }
            // !!! КОНЕЦ ИЗМЕНЕННОГО БЛОКА !!!

            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            try {
                const response = await fetch('/api/submit-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    showMessage('✅ Спасибо! Ваша заявка принята.', 'success');
                    form.reset();
                    if (phoneMask) phoneMask.updateValue(); // Сбрасываем значение маски после отправки
                } else {
                    throw new Error('Ошибка на сервере. Попробуйте позже.');
                }
            } catch (error) {
                showMessage(`❌ Ошибка: ${error.message}`, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить заявку';
            }
        });
    }
    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-alert ${type}`;
            formMessage.hidden = false;
        }
    }

    // ==========================================================================
    // Код для FAQ-аккордеона (без изменений)
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });

    // ==========================================================================
    // Код для мобильного меню (Гамбургер) (без изменений)
    // ==========================================================================
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