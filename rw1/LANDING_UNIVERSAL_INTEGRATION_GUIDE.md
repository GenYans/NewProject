# Tyan Landing Universal Integration Guide

Практическая документация для повторного использования в любых лендингах:
- regwall (email + social auth),
- paywall (планы + оплата),
- параметры трекинга,
- URL-конструкторы и postback-контекст.

База API: `https://tyan.ai`

---

## 1) Что нужно интегрировать

1. Регистрация по email/password:
   - `POST /api/landing/check-email`
   - `POST /api/landing/register`
2. Социальная авторизация:
   - `GET /api/landing/oauth/{provider}`
   - возврат на лендинг с `auth_status` + `auth_token`
3. Получение пользователя/планов после OAuth или token-only регистрации:
   - `GET /api/landing/who-am-i?auth_token=...`
4. Инициация платежа:
   - `GET /api/landing/payment/init?user_id=...&subscription_plan_id=...`

---

## 2) Обязательные и рекомендованные параметры

### Query входа на лендинг

- `p` (рекомендован): billing model code (`t`, `n`, `l`)
- `clickid` (рекомендован для постбека/атрибуции)
- любые `utm_*` и доп. campaign параметры

### Важные правила

- Если `p` отсутствует или невалидный -> использовать `n`.
- Отсутствие `clickid` не должно блокировать регистрацию.
- Все входные campaign-параметры нужно сохранять в `landing_url`.

---

## 3) Конструкторы URL (универсальный паттерн)

### 3.1 `landing_url`

`landing_url` = текущий URL лендинга + нормализованный `p` + `clickid` (если есть).

Пример:

`https://my-landing.com/path?p=n&clickid=abc123&utm_source=fb`

### 3.2 `redirect_url`

`redirect_url` = URL, куда backend вернет после OAuth callback.
Может отличаться от `landing_url`.

Если не задан явно -> fallback на текущий лендинг.

### 3.3 OAuth URL

Формировать так:

`GET /api/landing/oauth/{provider}?redirect_url={...}&landing_url={...}&p={...}&clickid={...}`

Где `provider`: `google` или `discord`.

---

## 4) Regwall: Email flow

## Шаг 1. Check email

`POST /api/landing/check-email`

Body:
```json
{
  "email": "user@example.com"
}
```

Если `exists: true` -> показать ошибку.

## Шаг 2. Register

`POST /api/landing/register`

Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "p": "n",
  "landing_url": "https://my-landing.com/?p=n&clickid=abc123"
}
```

### Варианты успешного ответа

1) Полный:
- есть `user`
- есть `subscription_plans`

2) Token-only:
- есть только `token` (или `auth_token`)

Для token-only обязательно следующий шаг:

`GET /api/landing/who-am-i?auth_token={token}`

И уже из ответа брать `user + subscription_plans`.

---

## 5) Regwall: Social flow (Google/Discord)

## Шаг 1. Клик по кнопке -> redirect на OAuth endpoint

```js
const oauthUrl = new URL(`${API_BASE}/api/landing/oauth/google`);
oauthUrl.searchParams.set('landing_url', landingUrl);
oauthUrl.searchParams.set('redirect_url', redirectUrl);
oauthUrl.searchParams.set('p', billingCode);
if (clickid) oauthUrl.searchParams.set('clickid', clickid);
window.location.href = oauthUrl.toString();
```

## Шаг 2. Возврат на `redirect_url`

Backend возвращает:
- успех: `?auth_status=success&auth_token=...`
- ошибка: `?auth_status=error`

## Шаг 3. Обработка на лендинге

Если `auth_status=success` и есть `auth_token`:
- вызвать `GET /api/landing/who-am-i?auth_token=...`
- получить `user + subscription_plans`
- открыть paywall

Если `auth_status=error`:
- показать UI-ошибку auth

После обработки почистить служебные query-параметры из URL:
- `auth_status`
- `auth_token`
- `auth_provider` (если есть)
- `code`, `state`, `oauth_return`, `oauth_error` (если есть)

---

## 6) Paywall flow

1. Показать планы из `subscription_plans`.
2. Пользователь выбирает план.
3. Инициировать оплату:

`GET /api/landing/payment/init?user_id={id}&subscription_plan_id={plan_id}`

Важно: в текущем контракте endpoint принимает только:
- `user_id`
- `subscription_plan_id`

4. Backend возвращает редирект на платежную страницу.

---

## 7) Postback/атрибуция: что важно не потерять

Чтобы backend корректно связал пользователя с рекламным кликом:

- передавай `clickid` при OAuth-init, если он есть;
- всегда передавай `landing_url` с campaign-параметрами;
- передавай `p` консистентно в register + oauth init;
- не отрезай `utm_*` и кастомные параметры из входного URL.

---

## 8) Универсальный каркас JS (минимум)

```javascript
const API_BASE = 'https://tyan.ai';

function normalizeP(raw) {
  const p = String(raw || 'n').toLowerCase();
  return ['t', 'n', 'l'].includes(p) ? p : 'n';
}

function buildLandingUrl() {
  const u = new URL(window.location.href);
  const p = normalizeP(u.searchParams.get('p'));
  u.searchParams.set('p', p);
  return u.toString();
}

async function fetchWhoAmI(authToken) {
  const u = new URL(`${API_BASE}/api/landing/who-am-i`);
  u.searchParams.set('auth_token', authToken);
  const res = await fetch(u.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}
```

---

## 9) Чеклист перед запуском

- [ ] Email flow проходит до открытия paywall
- [ ] OAuth flow возвращает на `redirect_url`, не в продукт
- [ ] `auth_status=success` -> `who-am-i` -> планы отображаются
- [ ] `auth_status=error` корректно показывает ошибку
- [ ] `payment/init` вызывается только с `user_id` + `subscription_plan_id`
- [ ] `p`, `clickid`, `landing_url` корректно пробрасываются
- [ ] `clickid` отсутствует -> регистрация не блокируется

