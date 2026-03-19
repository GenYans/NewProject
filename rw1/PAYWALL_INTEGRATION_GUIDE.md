# Paywall Integration Guide (1:1 Replica)

Этот документ фиксирует **точную реализацию текущего paywall** из `index.html`.
Если в новом лендинге нужно сделать такой же paywall 1-в-1, копируй блоки из этого файла без изменений ID/class/function names.

---

## 1) Что считать "1-в-1"

Для идентичного результата в другом лендинге должны совпадать:

- HTML-структура модалки и все `id` элементов
- CSS классы (`.paywall-wrap`, `.plan-option`, `.paywall-image-overlay` и т.д.)
- JS-переменные/функции (`selectedPlanId`, `subscriptionPlans`, `renderPlans`, `goPayment`)
- тексты в benefits и кнопках
- endpoint оплаты: только `user_id` + `subscription_plan_id`

---

## 2) Data contract для paywall

Paywall рендерится из `subscription_plans` + `currentUser`.

Ожидаемая структура одного плана:

```json
{
  "id": 3,
  "price": "8.00",
  "duration_in_days": 360,
  "sort": 1,
  "full_price": "96.00",
  "full_price_old": 20,
  "discount": "70"
}
```

---

## 3) CSS (копировать как есть)

```css
.paywall-wrap {
  width: 100%;
  max-width: 1020px;
  max-height: calc(var(--vh) * 100 - 32px);
  border-radius: 28px;
  overflow: hidden;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.plan-option {
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
}

.plan-option.active {
  border-color: var(--color-primary);
  background: rgba(254, 60, 179, 0.1);
  box-shadow: 0 0 0 1px rgba(254, 60, 179, 0.35);
}

.tiny-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: var(--color-primary);
}

.paywall-left {
  background: linear-gradient(135deg, #14141b 0%, #0c0c11 100%);
}

.paywall-right {
  background: linear-gradient(145deg, rgba(35, 35, 44, 0.92) 0%, rgba(16, 16, 23, 0.96) 100%);
  padding: 0;
  overflow: hidden;
}

.paywall-img {
  display: block;
  width: 100%;
  max-width: none;
  object-fit: cover;
  border: 0;
  border-radius: 0;
}

.paywall-image-wrap {
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 100%;
}

.paywall-image-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 20px 18px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.78) 62%, rgba(0, 0, 0, 0.92) 100%);
}

.paywall-benefits {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  color: rgba(255, 255, 255, 0.96);
  font-size: 14px;
  line-height: 1.35;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.paywall-benefits li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

@media (max-width: 768px) {
  .paywall-wrap {
    border-radius: 24px;
    max-height: calc(var(--vh) * 100 - 24px);
  }
}
```

---

## 4) HTML paywall (копировать как есть)

```html
<div id="paywall-modal" class="fixed inset-0 z-50 hidden">
  <div class="absolute inset-0 regwall-overlay"></div>
  <div class="relative z-10 h-[calc(var(--vh)*100)] flex items-center justify-center p-4">
    <div class="paywall-wrap relative">
      <button id="paywall-close" class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white">✕</button>

      <div class="hidden lg:grid lg:grid-cols-2 min-h-[560px]">
        <section class="paywall-left p-7 flex flex-col gap-5">
          <div class="mb-1">
            <h2 class="title-font text-3xl mb-1">Premium Benefits</h2>
            <p class="text-white/70 text-sm">Choose your plan</p>
          </div>

          <div id="plan-list-desktop" class="space-y-3"></div>

          <div class="space-y-2 text-xs text-white/85">
            <div class="flex items-start gap-2"><span class="tiny-check">✓</span><span>No adult transaction in bank statement</span></div>
            <div class="flex items-start gap-2"><span class="tiny-check">✓</span><span>Cancel anytime</span></div>
          </div>

          <button id="pay-btn-desktop" class="btn-primary h-[52px] rounded-2xl text-white font-bold text-[16px] mt-auto">
            Pay with Card
          </button>
          <button id="pay-later-btn" class="text-white/60 hover:text-white text-xs underline">Continue without payment</button>
        </section>

        <section class="paywall-right flex flex-col">
          <div class="paywall-image-wrap">
            <img src="assets/paywall.png" alt="Premium preview" class="paywall-img h-full" />
            <div class="paywall-image-overlay">
              <ul class="paywall-benefits">
                <li><span class="tiny-check">✓</span><span>Extremely Spicy Content 🌶</span></li>
                <li><span class="tiny-check">✓</span><span>Unlimited Uncensored Chats</span></li>
                <li><span class="tiny-check">✓</span><span>Generate Photos</span></li>
                <li><span class="tiny-check">✓</span><span>Create More Girlfriend</span></li>
                <li><span class="tiny-check">✓</span><span>Content Privacy</span></li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div class="lg:hidden paywall-left p-0 max-h-[92vh] overflow-y-auto">
        <div class="paywall-image-wrap">
          <img src="assets/paywall.png" alt="Premium preview" class="paywall-img" />
          <div class="paywall-image-overlay">
            <ul class="paywall-benefits">
              <li><span class="tiny-check">✓</span><span>Extremely Spicy Content 🌶</span></li>
              <li><span class="tiny-check">✓</span><span>Unlimited Uncensored Chats</span></li>
              <li><span class="tiny-check">✓</span><span>Generate Photos</span></li>
              <li><span class="tiny-check">✓</span><span>Create More Girlfriend</span></li>
              <li><span class="tiny-check">✓</span><span>Content Privacy</span></li>
            </ul>
          </div>
        </div>
        <div class="p-5">
          <div id="plan-list-mobile" class="space-y-3 mb-4"></div>
          <button id="pay-btn-mobile" class="btn-primary h-[52px] rounded-2xl text-white font-bold text-[16px] w-full">
            Pay with Card
          </button>
          <button id="pay-later-btn-mobile" class="text-white/60 hover:text-white text-xs underline w-full mt-3">
            Continue without payment
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 5) JS paywall logic (копировать как есть)

```javascript
var currentUser = null;
var selectedPlanId = null;
var subscriptionPlans = [];
var PAYMENT_INIT_URL = API_BASE + "/api/landing/payment/init";

function toCurrency(value) {
  var number = Number(value || 0);
  return "$" + number.toFixed(2);
}

function getDiscountLabel(plan) {
  var discount = String(plan.discount || "").trim();
  return discount ? discount + "% OFF" : "";
}

function getPlanDurationLabel(days) {
  var value = Number(days || 0);
  if (value >= 360) return "12 months";
  if (value >= 180) return "6 months";
  if (value >= 90) return "3 months";
  if (value >= 30) return "1 month";
  return value > 0 ? value + " days" : "Plan";
}

function normalizePlans(plans) {
  if (!Array.isArray(plans)) return [];
  return plans.slice().sort(function (a, b) {
    var left = Number(a.sort || 999);
    var right = Number(b.sort || 999);
    return left - right;
  });
}

function renderPlanHtml(plan, isActive) {
  var duration = getPlanDurationLabel(plan.duration_in_days);
  var oldPrice = Number(plan.full_price_old || 0);
  var fullPrice = Number(plan.full_price || plan.price || 0);
  var mainPrice = Number(plan.price || 0);
  var discountLabel = getDiscountLabel(plan);
  var oldPriceText = "";

  if (oldPrice > 0) {
    oldPriceText = '<div class="text-white/45 line-through text-xs">' + toCurrency(oldPrice) + "</div>";
  } else if (fullPrice > mainPrice) {
    oldPriceText = '<div class="text-white/45 line-through text-xs">' + toCurrency(fullPrice) + "</div>";
  }

  return (
    '<button type="button" class="plan-option w-full p-4 text-left ' + (isActive ? "active" : "") + '" data-plan-id="' + plan.id + '">' +
      '<div class="flex items-center justify-between gap-3">' +
        '<div>' +
          '<div class="text-white font-semibold text-lg leading-tight">' + duration + "</div>" +
          '<div class="text-[var(--color-primary)] text-xs font-semibold mt-1">' + (discountLabel || "&nbsp;") + "</div>" +
        "</div>" +
        '<div class="text-right">' +
          oldPriceText +
          '<div class="text-white text-2xl font-bold leading-tight">' + toCurrency(mainPrice) + "</div>" +
        "</div>" +
      "</div>" +
    "</button>"
  );
}

function renderPlans() {
  var desktop = document.getElementById("plan-list-desktop");
  var mobile = document.getElementById("plan-list-mobile");
  if (!desktop || !mobile) return;

  if (!subscriptionPlans.length) {
    desktop.innerHTML = '<div class="text-sm text-white/70">No plans available now.</div>';
    mobile.innerHTML = '<div class="text-sm text-white/70">No plans available now.</div>';
    return;
  }

  desktop.innerHTML = subscriptionPlans.map(function (plan) {
    return renderPlanHtml(plan, Number(plan.id) === Number(selectedPlanId));
  }).join("");

  mobile.innerHTML = subscriptionPlans.map(function (plan) {
    return renderPlanHtml(plan, Number(plan.id) === Number(selectedPlanId));
  }).join("");

  var allOptions = document.querySelectorAll(".plan-option");
  allOptions.forEach(function (item) {
    item.addEventListener("click", function () {
      selectedPlanId = Number(item.getAttribute("data-plan-id"));
      renderPlans();
    });
  });
}

function openPaywall() {
  var modal = document.getElementById("paywall-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePaywall() {
  var modal = document.getElementById("paywall-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function toProduct() {
  var product = new URL("https://tyan.ai/");
  product.searchParams.set("lp", "lpreg");
  window.location.href = product.toString();
}

function initPaymentButtons() {
  function goPayment() {
    if (!currentUser || !currentUser.id || !selectedPlanId) {
      showError("Select a plan and complete registration first");
      closePaywall();
      return;
    }

    var paymentUrl = new URL(PAYMENT_INIT_URL);
    paymentUrl.searchParams.set("user_id", currentUser.id);
    paymentUrl.searchParams.set("subscription_plan_id", selectedPlanId);
    window.location.href = paymentUrl.toString();
  }

  var payDesktop = document.getElementById("pay-btn-desktop");
  var payMobile = document.getElementById("pay-btn-mobile");
  if (payDesktop) payDesktop.addEventListener("click", goPayment);
  if (payMobile) payMobile.addEventListener("click", goPayment);

  var laterDesktop = document.getElementById("pay-later-btn");
  var laterMobile = document.getElementById("pay-later-btn-mobile");
  if (laterDesktop) laterDesktop.addEventListener("click", toProduct);
  if (laterMobile) laterMobile.addEventListener("click", toProduct);

  var closeBtn = document.getElementById("paywall-close");
  if (closeBtn) closeBtn.addEventListener("click", toProduct);
}
```

---

## 6) Как открывать paywall после регистрации/OAuth

После успешной авторизации (email или social):

```javascript
subscriptionPlans = normalizePlans(payload.subscription_plans);
selectedPlanId = subscriptionPlans.length ? Number(subscriptionPlans[0].id) : null;
currentUser = payload.user;
renderPlans();
openPaywall();
```

Где `payload` это data из `who-am-i` или из `register` (если backend вернул планы сразу).

---

## 7) Критичные правила, чтобы не сломать 1-в-1

1. Не переименовывать IDs:
   - `paywall-modal`
   - `plan-list-desktop`
   - `plan-list-mobile`
   - `pay-btn-desktop`
   - `pay-btn-mobile`
   - `pay-later-btn`
   - `pay-later-btn-mobile`
   - `paywall-close`
2. Не менять `plan-option` / `plan-option active` классы.
3. Не добавлять лишние query-параметры в `/api/landing/payment/init`.
4. `clickid` может отсутствовать, но paywall flow должен работать.

---

## 8) Быстрый copy-paste чеклист (в новый лендинг)

- [ ] Вставлен CSS блок из раздела 3
- [ ] Вставлен HTML блок из раздела 4
- [ ] Вставлен JS блок из раздела 5
- [ ] После auth выполняется код из раздела 6
- [ ] `assets/paywall.png` существует по нужному пути
- [ ] `PAYMENT_INIT_URL = https://tyan.ai/api/landing/payment/init`
- [ ] Протестированы desktop + mobile + no-plans кейс

