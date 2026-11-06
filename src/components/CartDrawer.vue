<script setup>
import { computed } from 'vue';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { formatMoney } from '../composables/useShopify';
import { useCart } from '../composables/useCart';
import { products } from '../data/products';

const { cart, count, subtotal, checkoutUrl, loading, error, isOpen, closeCart, updateQuantity, removeLine } =
  useCart();

const lines = computed(() => cart.value?.lines?.nodes ?? []);

function checkout() {
  if (!checkoutUrl.value) {
    return;
  }
  window.location.assign(checkoutUrl.value);
}

function lineTitle(line) {
  return line.merchandise?.product?.title ?? 'Item';
}

/** Display labels for Shopify variant values (e.g. non-English colour names). */
const VARIANT_LABELS = {};
for (const product of Object.values(products)) {
  for (const [value, label] of Object.entries(product.variantLabels ?? {})) {
    VARIANT_LABELS[value] = label;
  }
}

function lineVariant(line) {
  const title = line.merchandise?.title;
  if (!title || title === 'Default Title') {
    return '';
  }
  return VARIANT_LABELS[title] ?? title;
}

function lineTotal(line) {
  const price = line.merchandise?.price;
  if (!price) {
    return '';
  }
  return formatMoney(Number(price.amount) * line.quantity, price.currencyCode);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cart-fade">
      <div v-if="isOpen" class="cart-overlay" @click="closeCart"></div>
    </Transition>

    <Transition name="cart-slide">
      <aside
        v-if="isOpen"
        class="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header class="cart-drawer-header">
          <h2>
            <ShoppingBag aria-hidden="true" />
            Your cart<span v-if="count"> ({{ count }})</span>
          </h2>
          <button class="cart-drawer-close" type="button" aria-label="Close cart" @click="closeCart">
            <X aria-hidden="true" />
          </button>
        </header>

        <p v-if="error" class="cart-drawer-error" role="alert">{{ error }}</p>

        <div v-if="lines.length" class="cart-drawer-lines">
          <div v-for="line in lines" :key="line.id" class="cart-line">
            <img
              v-if="line.merchandise?.image?.url"
              :src="line.merchandise.image.url"
              :alt="lineTitle(line)"
            />
            <div v-else class="cart-line-placeholder" aria-hidden="true"></div>

            <div class="cart-line-info">
              <p class="cart-line-title">{{ lineTitle(line) }}</p>
              <p v-if="lineVariant(line)" class="cart-line-variant">{{ lineVariant(line) }}</p>
              <div class="cart-line-controls">
                <button
                  type="button"
                  :disabled="loading"
                  aria-label="Decrease quantity"
                  @click="updateQuantity(line.id, line.quantity - 1)"
                >
                  <Minus aria-hidden="true" />
                </button>
                <span class="cart-line-qty">{{ line.quantity }}</span>
                <button
                  type="button"
                  :disabled="loading"
                  aria-label="Increase quantity"
                  @click="updateQuantity(line.id, line.quantity + 1)"
                >
                  <Plus aria-hidden="true" />
                </button>
                <button
                  type="button"
                  class="cart-line-remove"
                  :disabled="loading"
                  aria-label="Remove item"
                  @click="removeLine(line.id)"
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </div>

            <p class="cart-line-price">{{ lineTotal(line) }}</p>
          </div>
        </div>

        <div v-else class="cart-drawer-empty">
          <ShoppingBag class="cart-drawer-empty-icon" aria-hidden="true" />
          <p>Your cart is empty.</p>
          <RouterLink class="cart-drawer-continue" to="/products" @click="closeCart">
            Browse products
          </RouterLink>
        </div>

        <footer v-if="lines.length" class="cart-drawer-footer">
          <div class="cart-drawer-subtotal">
            <span>Subtotal</span>
            <strong v-if="subtotal">{{ formatMoney(subtotal.amount, subtotal.currencyCode) }}</strong>
          </div>
          <p class="cart-drawer-note">Taxes and shipping calculated at checkout.</p>
          <button
            class="cart-drawer-checkout"
            type="button"
            :disabled="loading || !count"
            @click="checkout"
          >
            {{ loading ? 'Updating…' : 'Checkout' }}
          </button>
          <p class="cart-drawer-trust">Secure checkout · PayPal</p>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(20, 28, 30, 0.45);
  backdrop-filter: blur(2px);
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 201;
  display: flex;
  width: min(440px, 92vw);
  flex-direction: column;
  background: #fffdfa;
  color: #21150f;
  box-shadow: -24px 0 60px rgba(20, 28, 30, 0.18);
}

.cart-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(51, 76, 81, 0.12);
}

.cart-drawer-header h2 {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.cart-drawer-header h2 svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}

.cart-drawer-close {
  display: grid;
  width: 40px;
  height: 40px;
  padding: 0;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.cart-drawer-close:hover {
  background: rgba(51, 76, 81, 0.08);
}

.cart-drawer-close svg {
  width: 20px;
  height: 20px;
}

.cart-drawer-error {
  margin: 16px 24px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fdecec;
  color: #b3372f;
  font-size: 14px;
  line-height: 1.4;
}

.cart-drawer-lines {
  flex: 1;
  padding: 8px 24px;
  overflow-y: auto;
}

.cart-line {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 16px 0;
  border-bottom: 1px solid rgba(51, 76, 81, 0.08);
}

.cart-line img,
.cart-line-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.cart-line-placeholder {
  background: rgba(51, 76, 81, 0.06);
}

.cart-line-info {
  min-width: 0;
}

.cart-line-title {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
}

.cart-line-variant {
  margin: 0 0 10px;
  color: #5a7c85;
  font-size: 13px;
}

.cart-line-controls {
  display: flex;
  gap: 6px;
  align-items: center;
}

.cart-line-controls button {
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(51, 76, 81, 0.18);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.cart-line-controls button:hover:not(:disabled) {
  border-color: rgba(51, 76, 81, 0.4);
}

.cart-line-controls button:disabled {
  opacity: 0.5;
  cursor: default;
}

.cart-line-controls svg {
  width: 15px;
  height: 15px;
}

.cart-line-qty {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.cart-line-remove {
  margin-left: 6px;
  border-color: transparent !important;
  background: transparent !important;
  color: #9b6a5e;
}

.cart-line-price {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.cart-drawer-empty {
  display: flex;
  flex: 1;
  padding: 40px 24px;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cart-drawer-empty-icon {
  width: 44px;
  height: 44px;
  color: #9fb9bd;
  stroke-width: 1.5;
}

.cart-drawer-empty p {
  margin: 0;
  color: #5a7c85;
  font-size: 16px;
}

.cart-drawer-continue {
  margin-top: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  background: #334c51;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.cart-drawer-footer {
  padding: 18px 24px 22px;
  border-top: 1px solid rgba(51, 76, 81, 0.12);
  background: #fff;
}

.cart-drawer-subtotal {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 16px;
}

.cart-drawer-subtotal strong {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.cart-drawer-note {
  margin: 0 0 14px;
  color: #7c8f93;
  font-size: 13px;
}

.cart-drawer-checkout {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: #1e2e32;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.12s ease;
}

.cart-drawer-checkout:hover:not(:disabled) {
  background: #162529;
  transform: translateY(-1px);
}

.cart-drawer-checkout:disabled {
  opacity: 0.55;
  cursor: default;
}

.cart-drawer-trust {
  margin: 10px 0 0;
  color: #9ab0b4;
  font-size: 12px;
  text-align: center;
}

.cart-fade-enter-active,
.cart-fade-leave-active {
  transition: opacity 0.22s ease;
}
.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
}

.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateX(100%);
}
</style>
