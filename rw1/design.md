# TYAN Design System & Brand Guide

> Единый стандарт дизайна для всех лендингов tyan.ai.
> Версия 1.0 — основано на `one.nsfw`

---

## 1. Философия бренда

**Mood:** Мягкий, современный, слегка игривый. Лёгкость и воздушность — без агрессии.
**Ощущение:** Premium casual — как приложение от Apple, но с характером.
**Ключевые принципы:**

- **Чистота** — много воздуха, минимум визуального шума
- **Мягкость** — скруглённые углы, полупрозрачности, нежные тени
- **Контраст на одном акценте** — один яркий цвет управляет вниманием
- **Адаптивность** — `clamp()` вместо фиксированных размеров, fluid-first подход

---

## 2. Цветовая палитра

### Основные цвета

| Токен | HEX | Использование |
|-------|-----|---------------|
| `--color-primary` | `#FE3CB3` | CTA-кнопки, иконки, ссылки, бордеры активных элементов, фокус инпутов |
| `--color-primary-hover` | `#E535A0` | Hover-состояние primary кнопок |
| `--color-bg` | `#FEEBFB` | Фон страницы — мягкий розовый |
| `--color-surface` | `#FFFFFF` | Карточки, модалки, оверлеи |
| `--color-text` | `#131313` | Основной текст |
| `--color-text-secondary` | `#222121` | Текст в карточках, оверлеях |
| `--color-error` | `#E53935` | Ошибки валидации |
| `--color-error-bg` | `#FFF5F5` | Фон инпута при ошибке |
| `--color-input-bg` | `#F8F8F8` | Фон текстовых полей |

### Полупрозрачности (opacity-система)

| Элемент | Значение |
|---------|----------|
| Подзаголовки, подписи | `opacity: 0.6` |
| Divider-текст ("or"), Terms | `opacity: 0.4` |
| Placeholder текст | `opacity: 0.35` |
| Неактивные чекмарки | `opacity: 0.28` |
| Иконка-контейнер (tint) | `rgba(254, 60, 179, 0.1)` — 10% от primary |
| Бордер кнопок/инпутов | `rgba(0, 0, 0, 0.1)` |
| Backdrop модалки | `rgba(0, 0, 0, 0.5)` + `backdrop-filter: blur(6px)` |

### Правило: один акцент

> На каждом лендинге используется **только один** акцентный цвет. `#FE3CB3` — это наш primary.
> Все остальные цвета — нейтральные (чёрные, белые, серые с opacity).
> Никаких вторых акцентов. Только бренд-провайдеры (Google, Discord) сохраняют свои цвета.

---

## 3. Типографика

### Шрифтовой стек

```
Google Fonts: Inter (400, 500, 600, 700) + Inter Display (400) + Outfit (400, 600) + Unbounded (500)
```

| Роль | Шрифт | Вес | Размер | Line-height |
|------|-------|-----|--------|-------------|
| **H1 — Главный заголовок** | Unbounded | 500 | `clamp(26px, 3.4vw, 52px)` | 130% |
| **Subtitle — Подзаголовок** | Inter Display | 400 | `clamp(14px, 1.3vw, 20px)` | 140% |
| **Body — Текст карточек** | Inter | 500 | `clamp(12px, 1vw, 16px)` | 140% |
| **CTA Primary** | Inter | 700 | `clamp(16px, 1.2vw, 18px)` | `clamp(19px, 1.4vw, 22px)` |
| **CTA Secondary** | Inter | 600 | `clamp(16px, 1.2vw, 18px)` | `clamp(19px, 1.4vw, 22px)` |
| **Labels (мелкие подписи)** | Outfit | 600 | `clamp(10px, 0.8vw, 12px)` | `clamp(12px, 1vw, 15px)` |
| **Modal Title** | Unbounded | 500 | 24px (20px mobile) | 130% |
| **Modal Subtitle** | Inter Display | 400 | 15px (14px mobile) | 140% |
| **Social Buttons** | Inter | 600 | 15px | — |
| **Input text** | Inter | 400 | 15px | — |
| **Submit button** | Inter | 700 | 16px | — |
| **Terms (мелкий текст)** | Inter | 400 | 12px | 160% |

### Правила типографики

- **Unbounded** — ТОЛЬКО для заголовков (H1, заголовок модалки). Больше нигде.
- **Inter Display** — для подзаголовков, которые идут сразу под H1.
- **Outfit** — для мелких лейблов на изображениях (поверх градиента).
- **Inter** — для всего остального (body, кнопки, формы, ошибки, terms).
- **Letter-spacing:** `-0.01em` на CTA-кнопках.
- Размеры всегда через `clamp(min, preferred, max)` для fluid scaling.

---

## 4. Пространство и отступы

### Fluid-система

Все отступы, размеры и gap'ы через `clamp()`:

| Контекст | Формула |
|----------|---------|
| Основной padding секции | `clamp(40px, 7vw, 105px)` vertical, `clamp(20px, 6.6vw, 100px)` horizontal |
| Gap между секциями | `clamp(20px, 4vw, 40px)` |
| Gap заголовок↔подзаголовок | `clamp(8px, 1.6vw, 16px)` |
| Gap между карточками | `clamp(8px, 1vw, 16px)` |
| Gap между кнопками | `clamp(10px, 1.3vw, 19px)` |
| Padding внутри оверлеев | `clamp(12px, 1.6vw, 24px)` |

### Правило отступов

> **Никогда не использовать фиксированные пиксели для layout-отступов на desktop.**
> Исключение — mobile breakpoint (< 768px), где допустимы фиксированные значения.

---

## 5. Компоненты

### 5.1 Hero Section

```
Layout: CSS Grid
Desktop: grid-template-columns: 1fr minmax(0, clamp(300px, 40vw, 600px))
Tablet:  grid-template-columns: 1fr minmax(0, clamp(250px, 35vw, 500px))
Mobile:  grid-template-columns: 1fr (single column)
```

- Левая часть: контент (заголовок, карточки, кнопки), `justify-content: center`
- Правая часть: визуал (изображение + декоративные оверлеи), `position: relative`
- На мобиле: визуал фиксируется к низу экрана, кнопки фиксируются к низу

### 5.2 Info Cards (Blocks)

```css
width:           clamp(140px, 11.9vw, 180px)
height:          clamp(140px, 11.9vw, 180px)  /* квадрат */
background:      #FFFFFF
border-radius:   clamp(14px, 1.3vw, 20px)
```

Структура:
1. **Icon container** — абсолютно позиционирован top-left
   - Размер: `clamp(32px, 3.3vw, 50px)` квадрат
   - Фон: `rgba(254, 60, 179, 0.1)` — 10% tint от primary
   - Border-radius: `clamp(8px, 0.9vw, 14px)`
2. **Текст** — абсолютно позиционирован, ниже иконки
3. **Иконки** — inline SVG, заливка `#FE3CB3`

На мобиле: карточки становятся горизонтальными (158x58), иконка слева, текст справа.

### 5.3 CTA Buttons

#### Primary Button

```css
background:      #FE3CB3
color:           #FFFFFF
border-radius:   clamp(14px, 1.3vw, 20px)
height:          clamp(48px, 4.6vw, 70px)
font-weight:     700
```

- Иконка слева + текст
- Hover: не определён (допустимо `#E535A0` или `filter: brightness(0.92)`)

#### Secondary Button

```css
background:      #FFFFFF
color:           #222121
border-radius:   clamp(14px, 1.3vw, 20px)
height:          clamp(48px, 4.6vw, 70px)
font-weight:     600
```

- Текст + стрелка вправо (chevron)
- Стрелка через CSS `mask` — позволяет менять цвет через `background`

### 5.4 Customization Overlays (декоративные)

Белые карточки, которые "парят" поверх hero-изображения:

```css
background:      #FFFFFF
border-radius:   clamp(15px, 2vw, 30px)
padding:         clamp(12px, 1.6vw, 24px)
box-shadow:      0px 4px 74px rgba(0, 0, 0, 0.25)  /* для глубины */
```

Внутри:
- **Title** — мелкий, с opacity 0.6
- **Контент** — цветовые кружки / карточки с изображениями

Активное состояние:
- Карточки: `border: 1px solid #FE3CB3`
- Цветовые кружки: `border: 1px solid rgba(0, 0, 0, 0.6)`

Чекмарки:
- Активный: белый круг, галочка `#FE3CB3`
- Неактивный: `opacity: 0.28`, галочка белая

Градиент на изображениях (для читаемости лейблов):
```css
linear-gradient(180deg, rgba(0,0,0,0) 63.38%, rgba(0,0,0,0.8) 100%)
```

### 5.5 Registration Modal (Regwall)

```css
max-width:       440px
background:      #FFFFFF
border-radius:   28px (24px mobile)
padding:         40px 36px (32px 24px mobile)
box-shadow:      0 20px 60px rgba(0, 0, 0, 0.2)
```

**Backdrop:**
```css
background:      rgba(0, 0, 0, 0.5)
backdrop-filter:  blur(6px)
```

**Анимация появления:**
```css
@keyframes regwallSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
/* 0.3s ease-out */
```

**Кнопка закрытия:**
- 36x36px, круглая, `rgba(0, 0, 0, 0.05)`
- Hover: `rgba(0, 0, 0, 0.1)`

**Social Buttons:**
```css
height:          52px
border-radius:   16px
border:          1.5px solid rgba(0, 0, 0, 0.1)
/* hover: */
background:      #FAFAFA
border-color:    rgba(0, 0, 0, 0.2)
box-shadow:      0 2px 8px rgba(0, 0, 0, 0.06)
```

**Divider "or":**
- Линии через `::before` / `::after` с `flex: 1`
- Текст: uppercase, `letter-spacing: 0.05em`, `opacity: 0.4`

**Input:**
```css
height:          52px
border-radius:   16px
background:      #F8F8F8
border:          1.5px solid transparent
/* focus: */
border-color:    #FE3CB3
background:      #FFFFFF
/* error: */
border-color:    #E53935
background:      #FFF5F5
```

**Submit Button:**
```css
height:          52px
border-radius:   16px
background:      #FE3CB3
/* hover: #E535A0 */
/* disabled: opacity: 0.6, cursor: not-allowed */
```

**Loading spinner:**
```css
width: 22px; height: 22px;
border: 2.5px solid rgba(255,255,255,0.3);
border-top-color: #FFFFFF;
animation: regwallSpin 0.6s linear infinite;
```

---

## 6. Иконография

### Правила

- Все иконки — **inline SVG** (не img, не font-icon)
- Заливка: `#FE3CB3` (primary) для декоративных иконок
- Заливка: `#FFFFFF` для иконок внутри primary кнопок
- Размеры иконок задаются через CSS, не через атрибуты SVG
- Стрелки / chevron — через CSS `mask` (для гибкого перекрашивания)

### Используемые иконки

| Иконка | Размер | Контекст |
|--------|--------|----------|
| Play (курсор-клик) | 12x19 | Info card |
| Account (человек в круге) | 20x20 | Info card |
| Female (символ Венеры) | 14x22 | Info card + CTA |
| Tag (ценник) | 20x20 | Info card |
| Chevron Right | 20x20 | Secondary button |
| Close (X) | 24x24 | Modal close |
| Google logo | 20x20 | OAuth (мультицвет) |
| Discord logo | 20x20 | OAuth (`#5865F2`) |

---

## 7. Анимации и переходы

### Transition-стандарт

```css
/* Для hover-эффектов — всегда 0.2s */
transition: background 0.2s;
transition: border-color 0.2s;
transition: box-shadow 0.2s;
transition: opacity 0.2s;
```

> Правило: `0.2s` — единый тайминг для всех micro-interactions.

### Модалки

```css
/* Появление модалки */
animation: slideUp 0.3s ease-out;
/* from: opacity 0, translateY(24px), scale(0.96) */
/* to:   opacity 1, translateY(0), scale(1) */
```

### Loading

```css
/* Spinner */
animation: spin 0.6s linear infinite;
/* border-trick с прозрачной стороной */
```

### Принципы

- Никаких bounce, elastic, или сложных easing
- `ease-out` для появлений, `linear` для бесконечных анимаций
- Длительность: 0.2s (hover), 0.3s (появление), 0.6s (spinner)

---

## 8. Responsive Breakpoints

| Breakpoint | Что меняется |
|------------|-------------|
| **> 1024px** | Полный desktop layout |
| **1024px** | Сужается правая колонка, оверлеи перепозиционируются |
| **768px** | Single column, центрированный контент, фиксированные кнопки внизу, hero-изображение фиксировано к низу |

### Mobile-специфика (< 768px)

- Кнопки: фиксируются к `bottom: 0`, full-width, `padding-bottom: safe-area-inset-bottom`
- Карточки: из квадратов → горизонтальные (иконка слева, текст справа)
- Hero-image: `position: fixed`, привязан к низу
- Заголовок: центрируется
- Модалка: `border-radius: 24px`, `padding: 32px 24px`

---

## 9. Border-Radius система

| Элемент | Значение |
|---------|----------|
| Карточки (cards) | `clamp(14px, 1.3vw, 20px)` |
| Кнопки CTA | `clamp(14px, 1.3vw, 20px)` |
| Оверлеи (overlays) | `clamp(15px, 2vw, 30px)` |
| Модалка Desktop | `28px` |
| Модалка Mobile | `24px` |
| Social / Input / Submit | `16px` |
| Icon containers | `clamp(8px, 0.9vw, 14px)` |
| Чекмарки / цветовые кружки | `50%` (круг) |
| Eye/Body карточки | `clamp(10px, 0.8vw, 12px)` — `clamp(12px, 1.1vw, 16px)` |

> Правило: скругления **всегда большие** (min 8px). Никаких `2px`, `4px` border-radius.
> Чем крупнее элемент — тем больше скругление.

---

## 10. Тени

| Контекст | Значение |
|----------|----------|
| Декоративные оверлеи | `0px 4px 74px rgba(0, 0, 0, 0.25)` |
| Модалка | `0 20px 60px rgba(0, 0, 0, 0.2)` |
| Social button hover | `0 2px 8px rgba(0, 0, 0, 0.06)` |

> Правило: тени — мягкие, размытые. Большой blur-radius, малая opacity.
> Никаких жёстких теней. Никогда `box-shadow: 2px 2px 4px black`.

---

## 11. Структура HTML

### Шаблон страницы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Page Title}</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Display:wght@400&family=Outfit:wght@400;600&family=Unbounded:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="hero">
        <div class="hero-left">
            <header class="header">
                <h1 class="main-title">{Заголовок}</h1>
                <p class="subtitle">{Подзаголовок}</p>
            </header>
            <section class="blocks-section">
                <!-- Info cards -->
            </section>
            <section class="buttons-section">
                <button class="button-primary">{Primary CTA}</button>
                <button class="button-secondary">{Secondary CTA}</button>
            </section>
        </div>
        <div class="hero-right">
            <!-- Визуал + декоративные оверлеи -->
        </div>
    </div>
    <!-- Regwall Modal -->
    <div class="regwall-overlay" id="regwall">...</div>
    <script src="script.js"></script>
</body>
</html>
```

### Семантика

- `<header>` — для заголовочной группы
- `<section>` — для логических блоков
- `<button>` — для интерактивных элементов (не `<div>`)
- `<a>` — для OAuth-ссылок
- `<form>` — для email-регистрации
- Inline SVG — для всех иконок

---

## 12. CSS-архитектура

### Правила

1. **Reset:** `* { margin: 0; padding: 0; box-sizing: border-box; }`
2. **Один файл** `styles.css` — без BEM, без CSS modules, без препроцессоров
3. **Naming:** `.component-element` (kebab-case, 1-2 уровня)
4. **Responsive:** mobile-last (`@media max-width`) — desktop-first подход
5. **Fluid values:** `clamp()` для всех размеров кроме mobile-specific
6. **No !important** — никогда
7. **Состояния:** `.active`, `.error`, `.visible`, `.inactive` — через toggle-классы

### Организация CSS

```
/* Global reset */
/* Hero layout */
/* Hero-left: header, blocks, buttons */
/* Hero-right: image, overlays */
/* @media 1024px */
/* @media 768px */
/* Regwall modal */
/* @media 768px (regwall) */
```

---

## 13. JavaScript-паттерны

### Архитектура

- **IIFE** `(function() { 'use strict'; ... })()` — изоляция scope
- **Vanilla JS** — без фреймворков и библиотек
- **ES5-compatible** — `var`, `function`, `.then()` (не `async/await`)

### Regwall-паттерн

```javascript
// Открытие: добавить .active, заблокировать scroll
regwall.classList.add('active');
document.body.style.overflow = 'hidden';

// Закрытие: убрать .active, вернуть scroll
regwall.classList.remove('active');
document.body.style.overflow = '';

// Триггеры закрытия: кнопка, клик за модалку, Escape
```

### Form-паттерн

1. Validate email (regex + empty check)
2. Show loading spinner (заменить innerHTML кнопки)
3. POST JSON к API
4. Handle success → redirect
5. Handle errors → показать inline-ошибку
6. Error codes: 400 (registered), 422 (validation), 429 (rate limit)

### OAuth-паттерн

```javascript
// URL: {OAUTH_BASE}/{provider}?landing_url={encodeURIComponent(window.location.href)}
```

---

## 14. Чеклист для нового лендинга

### Обязательные элементы

- [ ] H1 заголовок (Unbounded 500)
- [ ] Подзаголовок (Inter Display 400, opacity 0.6)
- [ ] 2-4 информационных карточки с иконками
- [ ] Primary CTA кнопка (`#FE3CB3`, иконка + текст)
- [ ] Secondary CTA кнопка (белая, текст + стрелка)
- [ ] Hero-визуал справа (изображение / интерактив)
- [ ] Regwall модалка (Google + Discord OAuth + Email form)
- [ ] Responsive: 1024px, 768px breakpoints
- [ ] Фон страницы `#FEEBFB`

### Запрещено

- Использовать второй акцентный цвет
- Использовать `px` вместо `clamp()` на desktop
- Использовать маленькие скругления (< 8px)
- Использовать резкие тени
- Использовать шрифты за пределами стека (Inter, Unbounded, Outfit)
- Использовать `!important`
- Использовать библиотеки/фреймворки для JS (vanilla only)
- Использовать `<img>` для иконок (SVG inline only)

### Допустимые вариации

- Изменение текстов (заголовки, подписи, CTA)
- Изменение hero-визуала (другое изображение, другие оверлеи)
- Изменение количества info-карточек (2-6)
- Добавление новых секций ниже hero (сохраняя стиль)
- Изменение позиционирования оверлеев
- Добавление новых OAuth-провайдеров (Apple, X, etc.)

---

## 15. CSS Custom Properties (рекомендация)

Для новых лендингов рекомендуется вынести ключевые значения в переменные:

```css
:root {
    /* Colors */
    --color-primary: #FE3CB3;
    --color-primary-hover: #E535A0;
    --color-primary-tint: rgba(254, 60, 179, 0.1);
    --color-bg: #FEEBFB;
    --color-surface: #FFFFFF;
    --color-text: #131313;
    --color-text-secondary: #222121;
    --color-error: #E53935;
    --color-error-bg: #FFF5F5;
    --color-input-bg: #F8F8F8;

    /* Typography */
    --font-display: 'Unbounded', sans-serif;
    --font-subtitle: 'Inter Display', sans-serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-label: 'Outfit', sans-serif;

    /* Spacing */
    --radius-sm: clamp(8px, 0.9vw, 14px);
    --radius-md: clamp(14px, 1.3vw, 20px);
    --radius-lg: clamp(15px, 2vw, 30px);
    --radius-modal: 28px;

    /* Transitions */
    --transition-fast: 0.2s;
    --transition-modal: 0.3s ease-out;
}
```

---

## 16. Файловая структура лендинга

```
landing-name/
├── index.html          # Разметка
├── styles.css          # Стили (единый файл)
├── script.js           # Логика (regwall, OAuth, form)
├── *.png / *.webp      # Изображения
└── design.md           # Ссылка на этот гайд (опционально)
```

> Минимализм: 3 файла кода + ассеты. Без bundler'ов, без node_modules.
