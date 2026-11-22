<script setup>
import { computed, onMounted } from 'vue';
import { formatMoney, isShopifyConfigured } from '../composables/useShopify';
import { useShopifyPrices } from '../composables/useShopifyPrices';

/**
 * Prominent price label for the top of a product page.
 *
 * Every product page shows one of these in its hero, so a shopper sees the price
 * before scrolling:
 *   - products on Shopify  → the live Storefront price ("From …" when the price
 *     depends on the variant, e.g. three bed sizes)
 *   - ranges sold by quote → the `fallback` text, e.g. "Price on request"
 *
 * Colours come from the page, not from here: each page sets `--price-ink` /
 * `--price-muted` from its own palette (they all use the shared #314e53 ink, but
 * the commercial pages are a shade darker).
 */
const props = defineProps({
  /** Shopify product handle; leave empty for products sold by quote. */
  handle: {
    type: String,
    default: '',
  },
  /** Shown when there is no Shopify price — e.g. "Price on request". */
  fallback: {
    type: String,
    default: '',
  },
  /** Small line after the price, e.g. "per set of three, 210 g". */
  note: {
    type: String,
    default: '',
  },
});

const configured = isShopifyConfigured();
const { prices, loadPrice } = useShopifyPrices();

const entry = computed(() => (props.handle ? prices.value[props.handle] ?? null : null));

const label = computed(() => {
  if (entry.value) {
    return formatMoney(entry.value.amount, entry.value.currencyCode);
  }
  /* With a handle the live price is still on its way — hold the space rather
     than flashing a quote label and then swapping it. */
  return props.handle && configured ? '' : props.fallback;
});

const showFrom = computed(() => (entry.value?.variantCount ?? 0) > 1);

onMounted(() => {
  if (props.handle) {
    loadPrice(props.handle);
  }
});
</script>

<template>
  <!-- A `div`, not a `p`: the commercial pages style every `p` inside their hero
       copy (`.commercial-hero-copy p:not(.commercial-eyebrow)`), which would win
       over this component's own font-size and shrink the price back down. -->
  <div class="product-price-tag" :class="{ 'product-price-tag--quiet': !label }">
    <template v-if="label">
      <span v-if="showFrom" class="product-price-tag-from">From</span>
      <strong class="product-price-tag-amount">{{ label }}</strong>
    </template>
    <span v-else aria-hidden="true">&nbsp;</span>

    <span v-if="note" class="product-price-tag-note">{{ note }}</span>
  </div>
</template>

<style scoped>
.product-price-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: baseline;
  /* Reserve the line even before the price arrives, so the hero does not jump. */
  min-height: 1.15em;
  margin: 22px 0 0;
  color: var(--price-ink, #314e53);
}

.product-price-tag-from {
  color: var(--price-muted, #7a9499);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.product-price-tag-amount {
  font-size: clamp(24px, 2.3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.product-price-tag-note {
  color: var(--price-muted, #5f7a80);
  font-size: 13px;
  font-weight: 500;
}
</style>
