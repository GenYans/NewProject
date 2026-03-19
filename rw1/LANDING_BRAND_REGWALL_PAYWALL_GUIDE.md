# Tyan AI Girl Landing Guide (Regwall + Paywall)

Этот документ описывает бренд-правила для новых лендингов и продуктовую логику regwall/paywall.
Он не привязан к конкретной HTML-структуре и нужен как универсальная спецификация.

## 1) Суть бренда

- Продукт: AI girl experience, premium adult-oriented коммуникация 18+.
- Тон: premium, clean, dark, sensual, без визуального шума.
- Главный визуальный принцип: один акцентный цвет + нейтральная темная база.

## 2) Цветовая система (обязательная)

Используйте эти токены как основу для новых лендингов:

- `--color-primary: #FE3CB3` - главный акцент (CTA, активные состояния, чек-марки).
- `--color-primary-hover: #E535A0` - hover для primary-кнопок.
- `--color-bg: #050507` - базовый фон.
- `--color-surface: rgba(17, 17, 22, 0.82)` - стеклянные панели/модальные контейнеры.
- `--color-surface-2: rgba(26, 26, 34, 0.92)` - более плотные секции (paywall).
- `--color-text: #FFFFFF` - основной текст.
- `--color-text-secondary: rgba(255, 255, 255, 0.68)` - вторичный текст.
- `--color-border: rgba(255, 255, 255, 0.16)` - границы карточек/контролов.
- `--color-error: #E53935` - ошибка.
- `--color-error-bg: rgba(229, 57, 53, 0.12)` - фон ошибки.
- `--color-input-bg: rgba(255, 255, 255, 0.08)` - фон инпута.

Правило: не вводить второй конкурентный акцентный цвет для CTA.

## 3) Типографика

- Заголовки: `Unbounded` (500), с легким `letter-spacing: -0.01em`.
- Основной текст, формы, кнопки: `Inter` (400/500/600/700).
- Доп. подзаголовки: допускается `Inter Tight`.

Рекомендация по иерархии:

- Hero title: `clamp(26px, 3.4vw, 44px)`, line-height около `130%`.
- Subtitle: `clamp(14px, 1.3vw, 18px)`, line-height около `140%`.
- CTA text: 15-16px, `font-weight: 700`.

## 4) Компонентный стиль (без layout-ограничений)

### Кнопки

- Primary:
  - фон `#FE3CB3`, текст белый, скругление крупное (`16px+`),
  - hover: `#E535A0`,
  - transition: 0.2s по `background`, `transform`, `box-shadow`.
- Secondary (OAuth):
  - светлый фон, темный текст, тонкий нейтральный border,
  - мягкий hover с легкой тенью.

### Поля ввода

- Высота около `52px`.
- Скругление `16px`.
- Focus: primary-бордер.
- Error: красный бордер + error background.

### Модальность (regwall/paywall)

- Backdrop: полупрозрачный черный + blur.
- Контейнер: мягкая тень, темная glass/surface подложка.
- Скругления: крупные (24-28px).

### Текст поверх изображения (paywall image overlay)

- Для читаемости обязательна градиентная подложка:
  - от прозрачного к темному в нижней части.
- Белый текст с легкой тенью (`text-shadow`) поверх фото.
- Иконки/check marks в primary-цвете.

## 5) Контентная рамка regwall/paywall

- Основной месседж лендинга: AI girl, персонализация, мгновенный доступ.
- В paywall benefits используйте value-пункты, связанные с:
  - uncensored chats,
  - spicy/private content,
  - media generation,
  - privacy.

Не смешивать messaging со "scenarios", если лендинг про AI girl.

## 6) Логика регистрации (Regwall)

Поддерживаются 2 входа:

1. Email/Password
2. OAuth (Google/Discord и др. провайдеры API)

### Email flow

1. Проверка email: `POST /api/landing/check-email`
2. Регистрация: `POST /api/landing/register`
3. При успехе - получить `subscription_plans`, открыть paywall.

### OAuth flow

- Endpoint: `GET /api/landing/oauth/{provider}`
- Обязательно передавать `landing_url` как query параметр OAuth endpoint.

Пример:

`/api/landing/oauth/google?landing_url={ENCODED_FULL_LANDING_URL}`

## 7) Параметры трекинга и billing (`p`, `clickid`, `landing_url`)

### `p` (billing model code)

- Допустимые значения: `t`, `n`, `l`.
- Если `p` отсутствует или некорректен -> использовать `n`.
- Для OAuth `p` должен идти внутри `landing_url`.
- Для email-register передавайте `p` в body и `landing_url` в body.

### `clickid`

- Нужен для трекинга/postback.
- Если есть во входном URL -> обязательно прокидывать дальше в `landing_url`.
- Если отсутствует -> не блокировать регистрацию пользователя.

### `landing_url`

- Передавать всегда (и в email/register, и в OAuth).
- Включать в него:
  - `p` (нормализованное),
  - `clickid` (если есть),
  - исходные campaign/utm параметры (и любые дополнительные).

## 8) Логика paywall

- Источник планов: `subscription_plans` из ответа регистрации.
- Выбор плана: локальное выделение активного плана.
- Дефолт: первый план из отсортированного списка.

Инициация оплаты:

- `GET /api/landing/payment/init`
- Параметры:
  - `user_id`
  - `subscription_plan_id`
  - `return_url` (URL вашей redirect-страницы, если поддерживается вашим окружением)

## 9) Поведение после оплаты и после "pay later"

- После gateway пользователь возвращается на `redirect.html`.
- Redirect-страница пересылает пользователя в продукт (`https://tyan.ai/`) и сохраняет query параметры.
- Для атрибуции добавить `lp=lpreg`.

"Continue without payment" должно вести в продукт без блокировки.

## 10) Что нельзя ломать в будущих лендингах

- Нельзя блокировать регистрацию из-за отсутствия `clickid`.
- Нельзя терять `p` при формировании `landing_url`.
- Нельзя делать нечитаемый текст поверх ярких/контрастных картинок без overlay.
- Нельзя использовать несколько конкурирующих акцентных CTA-цветов.

---

Если делаете новый лендинг с другой структурой, сохраняйте:
- эту цветовую систему,
- этот UI-характер (dark + premium + clean),
- и этот API-контракт regwall/paywall.
