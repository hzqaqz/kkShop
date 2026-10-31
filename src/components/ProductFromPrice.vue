<script setup>
import { computed, onMounted, watch } from 'vue';
import { formatMoney } from '../composables/useShopify';
import { useShopifyPrices } from '../composables/useShopifyPrices';

/**
 * Price label for a product card. Reads the cheapest buyable variant from
 * Shopify and prefixes "From" only when the product really has more than one
 * price (e.g. three bed sizes).
 */
const props = defineProps({
  handle: {
    type: String,
    default: '',
  },
});

const { prices, loadPrice } = useShopifyPrices();

const entry = computed(() => (props.handle ? prices.value[props.handle] : null));

const label = computed(() => {
  if (!entry.value) {
    return '';
  }
  return formatMoney(entry.value.amount, entry.value.currencyCode);
});

const showFrom = computed(() => (entry.value?.variantCount ?? 0) > 1);

onMounted(() => loadPrice(props.handle));
watch(
  () => props.handle,
  (handle) => loadPrice(handle),
);
</script>

<template>
  <p v-if="label" class="product-card-price">
    <span v-if="showFrom" class="product-card-price-from">From</span>
    {{ label }}
  </p>
</template>

<style scoped>
.product-card-price {
  display: flex;
  gap: 6px;
  align-items: baseline;
  margin: 8px 0 0;
  color: #253b40;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.product-card-price-from {
  color: #7a9499;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
