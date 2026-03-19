document.addEventListener('DOMContentLoaded', () => {
    // Таймер обратного отсчета
    const timerElement = document.getElementById('timer');
    let totalSeconds = 48 * 3600; // 48 часов в секундах

    function updateTimer() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timerElement) {
            timerElement.textContent = formattedTime;
        }

        if (totalSeconds > 0) {
            totalSeconds--;
        }
    }

    // Обновляем таймер каждую секунду
    updateTimer();
    setInterval(updateTimer, 1000);

    // 4. Языковое меню
        const langDropdown = document.querySelector('.lang-dropdown');
        const mainFlagBtn = document.querySelector('.main-flag');
        if (langDropdown && mainFlagBtn) {
            mainFlagBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!langDropdown.contains(e.target)) {
                    langDropdown.classList.remove('open');
                }
            });
        }
    const toggle = document.getElementById('price-toggle');
    const amounts = document.querySelectorAll('.amount');
    const cards = document.querySelectorAll('.card');

    // 1. Анимация появления карточек по очереди (Stagger effect)
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 150 * (index + 1));
    });

    // 2. Логика переключения Monthly / Yearly
    toggle.addEventListener('change', () => {
        amounts.forEach(amount => {
            const monthlyValue = amount.getAttribute('data-monthly');
            const yearlyValue = amount.getAttribute('data-yearly');
            // Плавное мигание при смене цены
            amount.style.opacity = '0';
            setTimeout(() => {
                amount.textContent = toggle.checked ? yearlyValue : monthlyValue;
                amount.style.opacity = '1';
            }, 200);
        });
    });

    // 3. Свайпер отзывов с ручным и авто-переключением
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const slides = document.querySelectorAll('.swiper-slide');
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    let currentSlide = 0;
    const slideCount = slides.length;
    const interval = 7000; // 7 секунд
    let swiperTimer = null;

    function showSlide(index) {
        swiperWrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    function goToSlide(index) {
        currentSlide = (index + slideCount) % slideCount;
        showSlide(currentSlide);
        resetSwiperTimer();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function resetSwiperTimer() {
        if (swiperTimer) clearInterval(swiperTimer);
        swiperTimer = setInterval(nextSlide, interval);
    }

    // Кнопки навигации
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Инициализация
    showSlide(currentSlide);
    resetSwiperTimer();

    // 5. FAQ аккордеон
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Закрываем все другие элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });

    // ==================== Модальное окно авторизации ====================
    
    const authModal = document.getElementById('auth-modal');
    const authModalClose = document.getElementById('auth-modal-close');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authModalTitle = document.querySelector('.auth-modal-title');
    const authModalSubtitle = document.querySelector('.auth-modal-subtitle');

    // Функция открытия модального окна
    function openAuthModal() {
        if (authModal) {
            authModal.classList.remove('hidden');
            // Используем requestAnimationFrame для плавного появления
            requestAnimationFrame(() => {
                authModal.classList.add('active');
            });
            document.body.style.overflow = 'hidden';
        }
    }

    // Функция закрытия модального окна
    function closeAuthModal() {
        if (authModal) {
            authModal.classList.remove('active');
            setTimeout(() => {
                authModal.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        }
    }

    // Переключение вкладок
    function switchTab(tabName) {
        authTabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        if (tabName === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            authModalTitle.textContent = 'Вход в аккаунт';
            authModalSubtitle.textContent = 'Войдите для продолжения';
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            authModalTitle.textContent = 'Создать аккаунт';
            authModalSubtitle.textContent = 'Зарегистрируйтесь для начала работы';
        }
    }

    // Обработчики кнопок тарифов
    const tariffButtons = document.querySelectorAll('[data-auth-trigger]');
    tariffButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const planName = button.getAttribute('data-auth-trigger');
            openAuthModal();
            // Можно сохранить название плана для дальнейшей обработки
            console.log('Выбран план:', planName);
        });
    });

    // Закрытие по крестику
    if (authModalClose) {
        authModalClose.addEventListener('click', closeAuthModal);
    }

    // Закрытие по клику вне модального окна
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    // Переключение вкладок
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Обработка формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            console.log('Вход:', { email, password });
            // Здесь будет логика входа
        });
    }

    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (password !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            console.log('Регистрация:', { email, password });
            // Здесь будет логика регистрации
        });
    }

    // Кнопка "Забыли пароль?"
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Функция восстановления пароля будет реализована');
        });
    }

    // Кнопки социальных сетей
    const googleLogin = document.getElementById('google-login');
    const discordLogin = document.getElementById('discord-login');

    if (googleLogin) {
        googleLogin.addEventListener('click', () => {
            // Переадресация на OAuth Google
            const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
                'client_id=YOUR_GOOGLE_CLIENT_ID&' +
                'redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google/callback') + '&' +
                'response_type=code&' +
                'scope=email%20profile&' +
                'access_type=offline&' +
                'prompt=consent';
            window.location.href = googleAuthUrl;
        });
    }

    if (discordLogin) {
        discordLogin.addEventListener('click', () => {
            // Переадресация на OAuth Discord
            const discordAuthUrl = 'https://discord.com/api/oauth2/authorize?' +
                'client_id=YOUR_DISCORD_CLIENT_ID&' +
                'redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/discord/callback') + '&' +
                'response_type=code&' +
                'scope=identify%20email';
            window.location.href = discordAuthUrl;
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
            closeAuthModal();
        }
    });
});