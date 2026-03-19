# Landing Routes — документация

Все роуты доступны по базовому пути: `https://tyan.ai/`

---

## Содержание

1. [GET /click — переход с лендинга в продукт](#1-get-click--переход-с-лендинга-в-продукт)
2. [POST /landing/check-email](#2-post-landingcheck-email)
3. [POST /landing/start-registration](#3-post-landingstart-registration)
4. [POST /landing/register](#4-post-landingregister)
5. [GET /landing/who-am-i](#5-get-landingwho-am-i)
6. [GET /landing/oauth/{provider}](#6-get-landingoauthprovider)
7. [GET|POST /landing/auth/{provider}](#7-getpost-landingauthprovider)
8. [GET /landing/payment/init](#8-get-landingpaymentinit)
9. [GET /landing/payment/process](#9-get-landingpaymentprocess)
10. [GET /landing/subscription-plans](#10-get-landingsubscription-plans)
11. [Полный сценарий: Email-регистрация с лендинга](#полный-сценарий-email-регистрация-с-лендинга)
12. [Полный сценарий: OAuth с лендинга](#полный-сценарий-oauth-с-лендинга)

---

## 1. GET /click — переход с лендинга в продукт

**Назначение:** Принимает пользователя с лендинга, сохраняет все трекинговые параметры в cookie на 7 дней, и делает редирект в продукт (frontend). Параметры автоматически прокидываются в URL продукта, чтобы фронтенд мог подхватить их и сохранить за пользователем.

**Метод:** `GET`
**URL:** `/click`
**Авторизация:** не требуется

### Параметры запроса

| Параметр         | Обязательный | Тип    | Описание                                                |
|------------------|:---:|--------|---------------------------------------------------------|
| `clickid`        | **да** | string | Уникальный идентификатор клика от трекинговой сети      |
| `page`           | нет | string | Путь/URL страницы продукта, на которую редиректить (если не указан — на главную) |
| `campaign_key`   | нет | string | Идентификатор рекламной кампании                        |
| `clickcost`      | нет | string | Стоимость клика                                         |
| `Sub1`           | нет | string | Дополнительное поле трекинга Sub1                       |
| `Sub2`           | нет | string | Дополнительное поле трекинга Sub2                       |
| `Sub3`           | нет | string | Дополнительное поле трекинга Sub3                       |
| `utm_term`       | нет | string | UTM-метка ключевого слова                               |
| `utm_campaign`   | нет | string | UTM-метка кампании                                      |
| `utm_source`     | нет | string | UTM-метка источника                                     |
| `adcreative_name`| нет | string | Название рекламного креатива                            |
| `adgroup_name`   | нет | string | Название группы объявлений                              |
| `fetish`         | нет | string | Категория контента (см. допустимые значения ниже)       |

#### Допустимые значения `fetish`

`bdsm`, `stockings`, `handcuffs`, `collar`, `bondage`, `spanking`, `roleplay`, `curvy`, `young_woman`, `cumshot`, `anal`, `big_ass`, `lingerie`, `milf`, `foot_fetish`, `fishnet`, `big_breasts`

### Поведение

1. Все трекинговые параметры (кроме `page`) сохраняются в cookie **`tracking`** (JSON, TTL 7 дней).
2. Если указан параметр `page` — редирект происходит на `{FRONTEND_URL}{path_from_page}?{все трекинговые параметры}`.
3. Если `page` не указан или некорректен — редирект на `{FRONTEND_URL}?{все трекинговые параметры}`.
4. Трекинговые параметры также добавляются в query string URL редиректа, чтобы фронтенд мог их обработать при первом визите.

### Примеры

**Минимальный (только clickid, редирект на главную):**
```
GET /click?clickid=abc123
→ 302 → https://tyan.ai/?clickid=abc123
```

**С указанием целевой страницы:**
```
GET /click?clickid=abc123&page=https://tyan.ai/chat/5
→ 302 → https://tyan.ai/chat/5?clickid=abc123
```

**С целевой страницей, у которой есть свои параметры:**
```
GET /click?clickid=abc123&page=https://tyan.ai/avatars?sort=popular
→ 302 → https://tyan.ai/avatars?sort=popular&clickid=abc123
```

**Полный набор параметров:**
```
GET /click
  ?clickid=CLICK_12345
  &campaign_key=camp_summer_2024
  &clickcost=0.25
  &Sub1=banner_top
  &Sub2=segment_adult
  &Sub3=geo_us
  &utm_source=trafficjunky
  &utm_campaign=tyan_main
  &utm_term=ai+chat
  &adcreative_name=creative_v3
  &adgroup_name=group_18plus
  &fetish=bdsm
  &page=https://tyan.ai/

→ 302 → https://tyan.ai/?clickid=CLICK_12345&campaign_key=camp_summer_2024&...
Cookie: tracking={"clickid":"CLICK_12345","campaign_key":"camp_summer_2024",...}; Max-Age=604800
```

---

## 2. POST /landing/check-email

**Назначение:** Проверяет, зарегистрирован ли уже данный email в системе. Используется лендингом перед показом формы регистрации.

**Метод:** `POST`
**URL:** `/landing/check-email`
**Throttle:** `landing_registration`

### Тело запроса (JSON)

| Поле    | Обязательный | Тип    | Описание              |
|---------|:---:|--------|-----------------------|
| `email` | **да** | string | Email для проверки    |

### Ответ

```json
{
  "exists": true,
  "email": "user@example.com"
}
```

| Поле     | Тип     | Описание                                     |
|----------|---------|----------------------------------------------|
| `exists` | boolean | `true` — email уже зарегистрирован           |
| `email`  | string  | Нормализованный email из запроса             |

---

## 3. POST /landing/start-registration

**Назначение:** Начинает процесс регистрации — отправляет код подтверждения на email (действует 5 минут) и возвращает `redirect_url` для дальнейшего шага верификации.

**Метод:** `POST`
**URL:** `/landing/start-registration`
**Throttle:** `landing_registration`

### Тело запроса (JSON)

| Поле          | Обязательный | Тип    | Описание                                          |
|---------------|:---:|--------|---------------------------------------------------|
| `email`       | **да** | string | Email пользователя (max 255)                      |
| `landing_url` | **да** | string | URL текущего лендинга (используется для редиректа после верификации). Должен быть из разрешённого списка доменов. |

### Ответ 200

```json
{
  "success": true,
  "data": {
    "message": "Verification code has been sent to your email.",
    "redirect_url": "https://landing.example.com/verify?email=user%40example.com&challengeId=abc123&..."
  }
}
```

### Ответ 429 (rate limit)

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "rate_limit": {
    "available_in": 60
  }
}
```

### Ответ 400 (email занят)

```json
{
  "success": false,
  "error": "Email is already taken.",
  "code": 1002
}
```

---

## 4. POST /landing/register

**Назначение:** Регистрирует нового пользователя напрямую (без шага верификации через код) и возвращает одноразовый `auth_token`. Используется, если лендинг самостоятельно подтвердил email.

**Метод:** `POST`
**URL:** `/landing/register`
**Throttle:** `landing_registration`

### Тело запроса (JSON)

| Поле          | Обязательный | Тип    | Описание                                              |
|---------------|:---:|--------|-------------------------------------------------------|
| `email`       | **да** | string | Email пользователя                                    |
| `password`    | нет | string | Пароль (min 8, max 255). Если не указан — генерируется случайно |
| `landing_url` | нет | string | URL лендинга, с которого пришёл пользователь          |
| `p`           | нет | string | Код биллинговой модели (определяет доступные тарифы)  |

### Ответ 201

```json
{
  "success": true,
  "data": {
    "token": "Xk9mP2qR..."
  }
}
```

`token` действует **24 часа**. Передаётся в [`GET /landing/who-am-i`](#5-get-landingwho-am-i) для получения данных о пользователе.

### Ответ 400 (email занят)

```json
{
  "success": false,
  "error": "Email is already taken",
  "code": 1002
}
```

---

## 5. GET /landing/who-am-i

**Назначение:** Возвращает данные пользователя и список доступных тарифов по одноразовому `auth_token`, полученному после регистрации или OAuth. Используется для автологина на фронтенде.

**Метод:** `GET`
**URL:** `/landing/who-am-i`

### Параметры запроса

| Параметр     | Обязательный | Тип    | Описание                              |
|--------------|:---:|--------|---------------------------------------|
| `auth_token` | **да** | string | Токен из `/register` или OAuth callback |

### Ответ 200

```json
{
  "user": {
    "id": 42,
    "email": "user@example.com"
  },
  "subscription_plans": [
    {
      "id": 1,
      "name": "Premium Monthly",
      "price": 1999,
      ...
    }
  ]
}
```

### Ответ 401

```json
{
  "message": "Unauthenticated."
}
```

> Токен недействителен или истёк (TTL 24 часа).

---

## 6. GET /landing/oauth/{provider}

**Назначение:** Инициирует OAuth-авторизацию через социальную сеть — сохраняет контекст лендинга в сессию и делает редирект на страницу провайдера.

**Метод:** `GET`
**URL:** `/landing/oauth/{provider}`

### Path-параметры

| Параметр   | Значения                                             |
|------------|------------------------------------------------------|
| `provider` | `google`, `apple`, `discord`, `facebook`, `telegram`, `x` |

### Query-параметры

| Параметр       | Обязательный | Тип    | Описание                                                          |
|----------------|:---:|--------|-------------------------------------------------------------------|
| `landing_url`  | нет | string | URL лендинга (сохраняется в сессию как URL возврата после OAuth)  |
| `redirect_url` | нет | string | Явный URL для редиректа после авторизации (приоритет над `landing_url`) |
| `clickid`      | нет | string | ID клика (сохраняется в сессию)                                   |
| `p`            | нет | string | Код биллинговой модели (сохраняется в сессию)                     |

### Поведение

1. Сохраняет `landing_url`, `redirect_url`, `clickid`, `p` в сессию.
2. Делает `302` редирект на страницу авторизации провайдера.
3. После авторизации провайдер вызывает callback: `GET|POST /landing/auth/{provider}`.

### Пример

```
GET /landing/oauth/google?landing_url=https://landing.example.com/&redirect_url=https://landing.example.com/success&p=premium
→ 302 → https://accounts.google.com/o/oauth2/auth?...
```

---

## 7. GET|POST /landing/auth/{provider}

**Назначение:** Callback от OAuth-провайдера. Авторизует или регистрирует пользователя, возвращает `auth_token` для автологина.

**Метод:** `GET` или `POST` (зависит от провайдера, Apple использует POST)
**URL:** `/landing/auth/{provider}`

> Этот endpoint вызывается автоматически провайдером, вручную не вызывается.

### Поведение

1. Если в запросе нет `code` — редирект с `auth_status=error`.
2. Получает данные пользователя от провайдера (Socialite stateless).
3. Если у провайдера нет email — генерируется синтетический.
4. Если пользователь с таким email уже существует — выполняется логин.
5. Если не существует — регистрируется новый пользователь.
6. Создаётся `auth_token` (TTL 24 часа) и выполняется редирект.

### Редирект после успешной авторизации

```
{redirect_url или landing_url из сессии}?auth_status=success&auth_token=Xk9mP2qR...
```

### Редирект при ошибке

```
{redirect_url или landing_url из сессии}?auth_status=error
```

После редиректа лендинг должен вызвать [`GET /landing/who-am-i?auth_token={token}`](#5-get-landingwho-am-i).

---

## 8. GET /landing/payment/init

**Назначение:** Инициирует оплату подписки — создаёт платёжную транзакцию и редиректит на промежуточную страницу обработки платежа.

**Метод:** `GET`
**URL:** `/landing/payment/init`

### Параметры запроса

| Параметр               | Обязательный | Тип     | Описание                            |
|------------------------|:---:|---------|-------------------------------------|
| `user_id`              | **да** | integer | ID пользователя (из `who-am-i`)     |
| `subscription_plan_id` | **да** | integer | ID тарифного плана (из `subscription-plans`) |

### Поведение

1. Определяет подходящую валюту по геолокации пользователя (приоритет: локальная → USD).
2. Создаёт транзакцию через Finby (3DS-провайдер).
3. Сохраняет `user_id`, `transaction_id`, `gateway_url` в сессию.
4. Делает редирект на `/landing/payment/process`.

### Ответы при ошибке

- `404` — пользователь или тариф не найден.
- `422` — Finby-провайдер недоступен или нет подходящей валюты.
- `500` — ошибка создания транзакции.

### Пример

```
GET /landing/payment/init?user_id=42&subscription_plan_id=1
→ 302 → /landing/payment/process
```

---

## 9. GET /landing/payment/process

**Назначение:** Промежуточная страница обработки платежа.

**Метод:** `GET`
**URL:** `/landing/payment/process`

### Поведение

| Состояние сессии                  | Результат                                                       |
|-----------------------------------|-----------------------------------------------------------------|
| Нет сессии `landing_payment`      | Ошибка 422                                                      |
| Есть `gateway_url` в сессии       | Показывает страницу `landing.payment-process` с auto-redirect на Finby Gateway |
| `gateway_url` уже использован     | Проверяет статус транзакции. Если `Pending` — страница ожидания. Если оплачено — редирект на `{FRONTEND_URL}` |

> Страница `landing.payment-process` автоматически перенаправляет браузер на `gatewayUrl` (платёжный шлюз Finby).

---

## 10. GET /landing/subscription-plans

**Назначение:** Возвращает список всех доступных тарифных планов подписки.

**Метод:** `GET`
**URL:** `/landing/subscription-plans`
**Авторизация:** не требуется

### Ответ 200

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Premium Monthly",
      "price": 1999,
      ...
    },
    {
      "id": 2,
      "name": "Premium Annual",
      "price": 14990,
      ...
    }
  ]
}
```

---

## Полный сценарий: Email-регистрация с лендинга

```
1. Пользователь кликает на баннер
   → GET /click?clickid=CLICK_123&utm_source=trafficjunky&page=https://tyan.ai/
   ← 302 → https://tyan.ai/?clickid=CLICK_123&utm_source=trafficjunky
   Cookie: tracking={...} (7 дней)

2. Пользователь вводит email на лендинге. Лендинг проверяет его.
   → POST /landing/check-email  { "email": "user@example.com" }
   ← { "exists": false, "email": "user@example.com" }

3. Отправка кода подтверждения на email
   → POST /landing/start-registration
      { "email": "user@example.com", "landing_url": "https://landing.example.com/" }
   ← { "success": true, "data": { "redirect_url": "https://landing.example.com/verify?..." } }

4. (Пользователь вводит код на лендинге — верификация на стороне лендинга)

5. Финальная регистрация
   → POST /landing/register
      { "email": "user@example.com", "landing_url": "https://landing.example.com/", "p": "premium" }
   ← { "success": true, "data": { "token": "Xk9mP2qR..." } }

6. Получение данных пользователя (автологин)
   → GET /landing/who-am-i?auth_token=Xk9mP2qR...
   ← { "user": { "id": 42, "email": "user@example.com" }, "subscription_plans": [...] }

7. Инициация оплаты
   → GET /landing/payment/init?user_id=42&subscription_plan_id=1
   ← 302 → /landing/payment/process

8. Обработка платежа (автоматически перенаправляет на Finby Gateway)
   → GET /landing/payment/process
   ← 200 HTML (auto-redirect на https://gateway.finby.com/pay/...)
```

---

## Полный сценарий: OAuth с лендинга

```
1. Пользователь кликает "Войти через Google" на лендинге
   → GET /landing/oauth/google
      ?landing_url=https://landing.example.com/
      &redirect_url=https://landing.example.com/success
      &p=premium
   ← 302 → https://accounts.google.com/o/oauth2/auth?...

2. Пользователь авторизуется на Google

3. Google вызывает callback
   → GET /landing/auth/google?code=...
   ← 302 → https://landing.example.com/success
            ?auth_status=success
            &auth_token=Xk9mP2qR...

4. Лендинг получает token из URL и запрашивает данные пользователя
   → GET /landing/who-am-i?auth_token=Xk9mP2qR...
   ← { "user": { "id": 42, "email": "user@gmail.com" }, "subscription_plans": [...] }

5. Далее — оплата через /landing/payment/init (см. шаги 7–8 выше)
```
