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
});