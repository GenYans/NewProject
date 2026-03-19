# Социальная авторизация на лендингах

## Поддерживаемые провайдеры

- `google` - Google OAuth
- `discord` - Discord OAuth

## Эндпоинты

### 1. Редирект на провайдера OAuth

**Метод:** `GET`
**URL:** `/landing/auth/{provider}/redirect`

Перенаправляет пользователя на страницу авторизации выбранного OAuth-провайдера.

#### Параметры запроса (Query String)

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `landing_url` | string | Нет | URL лендинга, на который нужно вернуть пользователя после авторизации |
| `clickid` | string | Нет | ID клика для аналитики/трекинга |
| `p` | string | Нет | Код модели биллинга (например, `t`, `n`, `l` |

#### Примеры запросов

```bash
# Базовый запрос
GET /landing/auth/google/redirect

# С указанием лендинга и параметров
GET /landing/auth/google/redirect?landing_url=https://example.com/landing&clickid=abc123&p=t
```

#### Что происходит

1. Сохраняет `landing_url` в сессии
2. Извлекает и сохраняет `clickid` (из текущего URL или `landing_url`)
3. Извлекает и сохраняет `billing_model_code` (параметр `p`)
4. Перенаправляет пользователя на страницу OAuth-провайдера

---

### 2. Обработка callback от провайдера

**Метод:** `GET`
**URL:** `/landing/auth/{provider}/callback`

Обрабатывает ответ от OAuth-провайдера после авторизации пользователя.

#### Параметры запроса (Query String)

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `code` | string | Да | Код авторизации от OAuth-провайдера |
| `state` | string | Да | State-токен для защиты от CSRF |

> **Примечание:** Эти параметры автоматически добавляются OAuth-провайдером при редиректе.

#### Возможные ответы

##### Успешная авторизация (новый пользователь)

**HTTP Status:** `201 Created`

```json
{
  "success": true,
  "redirect_url": "https://example.com/landing",
  "data": {
    "user": {
      "id": 12345,
      "email": "user@example.com"
    },
    "subscription_plans": [
      {
        "id": 1,
        "name": "Trial подписка",
        "duration_in_days": 1,
        "price": 0,
        "currency": "RUB",
        "billing_model": "trial_subscription"
      }
    ]
  }
}
```

##### Успешная авторизация (существующий пользователь)

**HTTP Status:** `200 OK`

```json
{
  "success": true,
  "redirect_url": "https://example.com/landing",
  "data": {
    "user": {
      "id": 12345,
      "email": "user@example.com"
    },
    "subscription_plans": [
      {
        "id": 2,
        "name": "Месячная подписка",
        "duration_in_days": 30,
        "price": 990,
        "currency": "RUB",
        "billing_model": "subscription"
      },
      {
        "id": 3,
        "name": "Годовая подписка",
        "duration_in_days": 365,
        "price": 9990,
        "currency": "RUB",
        "billing_model": "subscription"
      }
    ]
  }
}
```

##### Ошибка: отсутствует код авторизации

**HTTP Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": "Authorization code not provided",
  "redirect_url": "https://example.com/landing"
}
```

##### Ошибка: сбой авторизации

**HTTP Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "error": "Authentication failed. Please try again.",
  "redirect_url": "https://example.com/landing"
}
```