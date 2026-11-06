<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import ProductFromPrice from './ProductFromPrice.vue';
import { isShopifyConfigured } from '../composables/useShopify';
import { useShopifyProducts } from '../composables/useShopifyPrices';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Explore other Meower products',
  },
  eyebrow: {
    type: String,
    default: 'More from Meower',
  },
  /** How many cards to show once the candidates are filtered. */
  limit: {
    type: Number,
    default: 3,
  },
  /** Drop anything that is not buyable right now (Shopify stock). */
  inStockOnly: {
    type: Boolean,
    default: false,
  },
});

const configured = isShopifyConfigured();
const { productsByHandle, loadProduct } = useShopifyProducts();

/* Hide the section while availability is loading, so an out-of-stock product
   never flashes into the recommendations. */
const loading = ref(props.inStockOnly && configured);

function hasStock(product) {
  if (!product?.shopifyHandle) {
    return false;
  }
  const variants = productsByHandle.value[product.shopifyHandle]?.variants?.nodes ?? [];
  return variants.some((variant) => variant.availableForSale);
}

const visibleProducts = computed(() => {
  if (!props.inStockOnly || !configured) {
    return props.products.slice(0, props.limit);
  }
  return props.products.filter(hasStock).slice(0, props.limit);
});

async function loadAvailability(products) {
  if (!props.inStockOnly || !configured) {
    return;
  }
  const handles = products.map((product) => product.shopifyHandle).filter(Boolean);
  await Promise.all(handles.map((handle) => loadProduct(handle)));
}

onMounted(async () => {
  await loadAvailability(props.products);
  loading.value = false;
});

watch(
  () => props.products,
  async (products) => {
    if (!props.inStockOnly || !configured) {
      return;
    }
    loading.value = true;
    await loadAvailability(products);
    loading.value = false;
  },
);
</script>

<template>
  <section
    v-if="!loading && visibleProducts.length"
    class="related-section"
    aria-labelledby="related-products-title"
  >
    <div class="section-heading centered">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2 id="related-products-title">{{ title }}</h2>
    </div>

    <div class="product-list-grid related-product-grid">
      <RouterLink
        v-for="product in visibleProducts"
        :key="product.id"
        class="product-list-card"
        :to="{ name: 'product-detail', params: { productId: product.id } }"
      >
        <img :src="product.image" :alt="product.title" />
        <h3>{{ product.cardLabel }}</h3>
        <ProductFromPrice :handle="product.shopifyHandle" />
        <p class="related-product-subtitle">{{ product.cardSubtitle }}</p>
        <span>{{ product.category }}</span>
      </RouterLink>
    </div>
  </section>
</template>
