# API для интеграции лендинга

Документация по интеграции внешнего лендинга с платформой Tyan AI для регистрации пользователей и покупки подписок.

## 1. Проверка существования email

Проверяет, занят ли email в системе.

**Endpoint:** `POST /api/landing/check-email`

**Rate Limit:** `landing_registration` (5 запросов в минуту с одного IP)

### Запрос

```json
{
  "email": "user@example.com"
}
```

### Успешный ответ (200 OK)

```json
{
  "exists": false,
  "email": "user@example.com"
}
```

### Примеры ответов

**Email свободен:**
```json
{
  "exists": false,
  "email": "user@example.com"
}
```

**Email уже занят:**
```json
{
  "exists": true,
  "email": "user@example.com"
}
```

### Ошибки валидации (422)

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

---

## 2. Регистрация пользователя

Регистрирует нового пользователя и возвращает доступные планы подписок.

**Endpoint:** `POST /api/landing/register`

**Rate Limit:** `landing_registration` (5 запросов в минуту с одного IP)

### Запрос

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### Требования к паролю

- Минимум 8 символов
- Максимум 255 символов

### Успешный ответ (201 Created)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com"
    },
    "subscription_plans": [
      {
        "id": 1,
        "name": "Monthly Subscription",
        "price": "9.99",
        "duration_in_days": 30,
        "sort": 1,
        "full_price": "9.99",
        "full_price_old": 0,
        "discount": null
      },
      {
        "id": 2,
        "name": "Annual Subscription",
        "price": "99.99",
        "duration_in_days": 365,
        "sort": 2,
        "full_price": "119.88",
        "full_price_old": 0,
        "discount": "17"
      }
    ]
  }
}
```

### Ошибки

**Email уже занят (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email is already taken",
  "code": 1002
}
```

**Ошибка валидации (422 Unprocessable Entity):**
```json
{
  "message": "The password field must be at least 8 characters.",
  "errors": {
    "password": [
      "The password field must be at least 8 characters."
    ]
  }
}
```

**Внутренняя ошибка сервера (500):**
```json
{
  "success": false,
  "error": "An error occurred while processing your request."
}
```

---

## 3. Инициация оплаты подписки

Создает транзакцию оплаты и возвращает URL для редиректа на страницу оплаты Finby.

**Endpoint:** `GET /api/landing/payment/init`

**Параметры запроса (Query String):**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `user_id` | integer | Да | ID пользователя из ответа регистрации |
| `subscription_plan_id` | integer | Да | ID выбранного плана подписки |

### Пример запроса

```
GET /api/landing/payment/init?user_id=123&subscription_plan_id=2
```

### Успешный ответ (302 Found)
Редирект на промежуточную страницу обработки платежа