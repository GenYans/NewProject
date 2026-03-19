# Landing Page Integration Guide for Frontend Developers

Простое руководство по интеграции вашего лендинга с системой регистрации Tyan AI.

## Что нужно сделать

На вашем лендинге нужно:

1. Собрать email пользователя
2. Отправить API запрос с email и URL вашего лендинга
3. Показать пользователю сообщение об успехе или ошибке
4. Перенаправить пользователя на страницу подтверждения

Вся остальная работа происходит автоматически - мы отправим email с кодом подтверждения, и пользователь завершит регистрацию на нашей стороне.

## API Endpoint

```
POST https://tyan.ai/api/landing/start-registration
```

### Staging для тестирования

```
POST https://avachat-release.ondev.run/api/landing/start-registration
```

## Формат запроса

### Headers

```http
Content-Type: application/json
Accept: application/json
```

### Body

```json
{
  "email": "user@example.com",
  "landing_url": "https://your-landing.com/promo?utm_campaign=summer&utm_source=facebook&utm_medium=cpc"
}
```

**Важно**:
- `email` - email пользователя
- `landing_url` - полный URL вашего лендинга (куда попал пользователь после перехода по рекламе)
- URL должен начинаться с `https://` (не `http://`)
- Максимальная длина URL - 500 символов

## Ответы API

### ✅ Успешный ответ (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Verification code has been sent to your email.",
    "redirect_url": "https://tyan.ai/register-verify-code/user%40example.com/abc-123-def"
  }
}
```

**Что делать дальше:**
Перенаправить пользователя на `redirect_url`

### ❌ Email уже занят (400 Bad Request)

```json
{
  "success": false,
  "error": "Email user@example.com already been taken",
  "code": 1002
}
```

### ❌ Ошибка валидации (422 Unprocessable Entity)

```json
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": ["The email field must be a valid email address."],
    "landing_url": ["The landing url must use HTTPS protocol."]
  }
}
```

### ⏱️ Превышен лимит запросов (429 Too Many Requests)

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "rate_limit": {
    "available_in": 45
  }
}
```

## Примеры кода

### Vanilla JavaScript (Fetch API)

```javascript
// Получаем текущий URL с UTM параметрами
const currentUrl = window.location.href;

async function registerFromLanding(email) {
  const response = await fetch('https://tyan.ai/api/landing/start-registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      landing_url: currentUrl // Передаем полный URL лендинга
    })
  });

  const data = await response.json();

  if (response.ok) {
    window.location.href = data.data.redirect_url;
  } else {
    // Обрабатываем ответы-ошибки
  }
}

// Вариант 1: Использование HTML5 Constraint Validation API
function validateFormHTML5() {
  const emailInput = document.getElementById('email-input');

  // Браузер автоматически проверит validity если у input есть type="email"
  if (!emailInput.validity.valid) {
    // Показываем встроенное сообщение браузера
    emailInput.reportValidity();
    return false;
  }

  return true;
}

// Вариант 2: HTML5 валидация с кастомными сообщениями
function validateFormWithCustomMessages() {
  const emailInput = document.getElementById('email-input');

  // Сбрасываем предыдущие кастомные сообщения
  emailInput.setCustomValidity('');

  if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity('Введите email адрес');
    emailInput.reportValidity();
    return false;
  }

  if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Введите правильный email адрес');
    emailInput.reportValidity();
    return false;
  }

  return true;
}

// Вариант 3: Ручная валидация (без HTML5 API)
function validateFormManual() {
  const email = document.getElementById('email-input').value;

  if (!email) {
    showError('Введите email');
    return false;
  }

  // Простая проверка формата email через регулярное выражение
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Введите правильный email адрес');
    return false;
  }

  return true;
}

// Использование с HTML5 валидацией
document.getElementById('submit-btn').addEventListener('click', () => {
  if (validateFormHTML5()) { // или validateFormWithCustomMessages()
    const email = document.getElementById('email-input').value;
    registerFromLanding(email);
  }
});
```

**HTML разметка для HTML5 валидации:**

```html
<form id="registration-form">
  <!-- type="email" включает автоматическую валидацию email -->
  <!-- required делает поле обязательным -->
  <input
    type="email"
    id="email-input"
    name="email"
    placeholder="Введите email"
    required
    autocomplete="email"
  />

  <button type="submit" id="submit-btn">
    Зарегистрироваться
  </button>
</form>

<script>
// Обработка submit формы (предотвращаем перезагрузку страницы)
document.getElementById('registration-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Останавливаем стандартную отправку формы

  // Валидация уже произошла благодаря type="email" и required
  // Если форма валидна, отправляем запрос
  const email = document.getElementById('email-input').value;
  registerFromLanding(email);
});
</script>
```
