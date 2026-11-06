<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Loader2, ShoppingBag } from 'lucide-vue-next';
import { fetchProductByHandle, formatMoney, isShopifyConfigured } from '../composables/useShopify';
import { useCart } from '../composables/useCart';
import { useVariantSelection } from '../composables/useVariantSelection';

const props = defineProps({
  handle: {
    type: String,
    required: true,
  },
  /** Site-side product name; Shopify's own title can lag behind a rename. */
  title: {
    type: String,
    default: '',
  },
  /** Optional map for Shopify option values that need a display label. */
  labels: {
    type: Object,
    default: () => ({}),
  },
});

/** Raised when this handle cannot be bought here, so the page can fall back
 *  to the enquiry bar instead of leaving the page without an action bar. */
const emit = defineEmits(['unavailable']);

const configured = isShopifyConfigured();

const { addToCart, loading: cartLoading, error: cartError } = useCart();

const product = ref(null);
const loading = ref(false);
const error = ref(null);
const quantity = ref(1);

/** Selection is shared so in-page size pickers can drive the bar too. */
const { selection, setVariant } = useVariantSelection();

const selectedVariantId = computed({
  get: () => selection.value[props.handle] ?? null,
  set: (variantId) => setVariant(props.handle, variantId),
});

const variants = computed(() => product.value?.variants?.nodes ?? []);
const hasVariants = computed(() => variants.value.length > 1);

const selectedVariant = computed(
  () => variants.value.find((variant) => variant.id === selectedVariantId.value) ?? variants.value[0] ?? null,
);

const price = computed(() => selectedVariant.value?.price ?? null);
const compareAtPrice = computed(() => selectedVariant.value?.compareAtPrice ?? null);
const available = computed(() => selectedVariant.value?.availableForSale ?? false);
const onSale = computed(() => {
  if (!price.value || !compareAtPrice.value) {
    return false;
  }
  return Number(compareAtPrice.value.amount) > Number(price.value.amount);
});

async function load() {
  if (!configured || !props.handle) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const fetched = await fetchProductByHandle(props.handle);
    product.value = fetched;
    if (fetched?.variants?.nodes?.length && !selectedVariantId.value) {
      // Prefer the first purchasable variant.
      const firstAvailable = fetched.variants.nodes.find((v) => v.availableForSale);
      selectedVariantId.value = (firstAvailable ?? fetched.variants.nodes[0]).id;
    }
  } catch (err) {
    error.value = err.message || 'Could not load product.';
    emit('unavailable');
  } finally {
    loading.value = false;
  }

  if (!product.value) {
    emit('unavailable');
  }
}

async function add() {
  if (!selectedVariant.value || !available.value) {
    return;
  }
  await addToCart(selectedVariant.value.id, quantity.value);
  quantity.value = 1;
}

function variantLabel(variant) {
  const options = (variant.selectedOptions ?? []).map(
    (option) => props.labels[option.value] ?? option.value,
  );
  return options.length ? options.join(' / ') : (props.labels[variant.title] ?? variant.title);
}

onMounted(load);
watch(() => props.handle, load);
</script>

<template>
  <div v-if="configured" class="buy-bar" role="region" aria-label="Purchase">
    <div class="buy-bar-inner">
      <div class="buy-bar-product">
        <strong v-if="title || product?.title">{{ title || product?.title }}</strong>
        <div class="buy-bar-price">
          <span v-if="loading || !product" class="buy-bar-loading">Loading price…</span>
          <template v-else-if="price">
            <span class="buy-bar-price-now" :class="{ 'is-sale': onSale }">
              {{ formatMoney(price.amount, price.currencyCode) }}
            </span>
            <s v-if="onSale" class="buy-bar-price-was">
              {{ formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode) }}
            </s>
          </template>
          <span v-else-if="error" class="buy-bar-error">{{ error }}</span>
          <span v-else-if="cartError" class="buy-bar-error">{{ cartError }}</span>
          <span v-else class="buy-bar-loading">Unavailable</span>
        </div>
      </div>

      <div class="buy-bar-actions">
        <label v-if="hasVariants" class="buy-bar-variant">
          <span class="sr-only">Variant</span>
          <select v-model="selectedVariantId">
            <option v-for="variant in variants" :key="variant.id" :value="variant.id">
              {{ variantLabel(variant) }}<template v-if="!variant.availableForSale"> — Sold out</template>
            </option>
          </select>
        </label>

        <div class="buy-bar-qty" aria-label="Quantity">
          <button
            type="button"
            :disabled="quantity <= 1 || cartLoading"
            aria-label="Decrease quantity"
            @click="quantity -= 1"
          >
            −
          </button>
          <span>{{ quantity }}</span>
          <button
            type="button"
            :disabled="cartLoading"
            aria-label="Increase quantity"
            @click="quantity += 1"
          >
            +
          </button>
        </div>

        <button
          class="buy-bar-add"
          type="button"
          :disabled="loading || cartLoading || !available"
          @click="add"
        >
          <Loader2 v-if="cartLoading" class="spin" aria-hidden="true" />
          <ShoppingBag v-else aria-hidden="true" />
          {{ !product ? 'Loading…' : available ? 'Add to cart' : 'Sold out' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buy-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 60;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 253, 250, 0.92);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(51, 76, 81, 0.12);
  box-shadow: 0 -12px 30px rgba(20, 28, 30, 0.08);
}

.buy-bar-inner {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, 100%);
  margin: 0 auto;
}

.buy-bar-product {
  min-width: 0;
}

.buy-bar-product strong {
  display: block;
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: 600;
  color: #21150f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.buy-bar-price {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.buy-bar-price-now {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #21150f;
}

.buy-bar-price-now.is-sale {
  color: #b3372f;
}

.buy-bar-price-was {
  color: #8b9a9d;
  font-size: 14px;
}

.buy-bar-loading,
.buy-bar-error {
  color: #7c8f93;
  font-size: 13px;
}

.buy-bar-error {
  color: #b3372f;
}

.buy-bar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
}

.buy-bar-variant select {
  height: 44px;
  padding: 0 12px;
  border: 1px solid rgba(51, 76, 81, 0.2);
  border-radius: 12px;
  background: #fff;
  color: #21150f;
  font-size: 14px;
  cursor: pointer;
}

.buy-bar-qty {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 44px;
  padding: 0 6px;
  border: 1px solid rgba(51, 76, 81, 0.2);
  border-radius: 12px;
  background: #fff;
}

.buy-bar-qty button {
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.buy-bar-qty button:hover:not(:disabled) {
  background: rgba(51, 76, 81, 0.08);
}

.buy-bar-qty button:disabled {
  opacity: 0.4;
  cursor: default;
}

.buy-bar-qty span {
  min-width: 24px;
  text-align: center;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.buy-bar-add {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #1e2e32;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.12s ease;
}

.buy-bar-add:hover:not(:disabled) {
  background: #162529;
  transform: translateY(-1px);
}

.buy-bar-add:disabled {
  opacity: 0.55;
  cursor: default;
}

.buy-bar-add svg {
  width: 18px;
  height: 18px;
}

.spin {
  animation: buy-bar-spin 0.8s linear infinite;
}

@keyframes buy-bar-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .buy-bar-inner {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .buy-bar-product strong {
    white-space: normal;
  }

  .buy-bar-actions {
    width: 100%;
  }

  .buy-bar-variant {
    flex: 1;
    min-width: 0;
  }

  .buy-bar-variant select {
    width: 100%;
  }

  .buy-bar-add {
    flex: 1;
  }
}
</style>
