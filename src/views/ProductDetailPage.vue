<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CommercialDehumidifierPage from '../components/CommercialDehumidifierPage.vue';
import Mw100ProductPage from '../components/Mw100ProductPage.vue';
import SiteHeader from '../components/SiteHeader.vue';

const route = useRoute();

const productDetails = {
  mw100: {
    label: 'MW100',
  },
  mw200: {
    label: 'MW200',
  },
  'commercial-dehumidifier': {
    label: 'Commercial Dehumidifier',
    page: 'commercial',
  },
};

const currentProduct = computed(() => productDetails[route.params.productId] ?? null);
</script>

<template>
  <main
    class="site-shell product-page"
    :class="{ 'commercial-product-page': currentProduct?.page === 'commercial' }"
  >
    <SiteHeader />

    <CommercialDehumidifierPage v-if="currentProduct?.page === 'commercial'" />

    <Mw100ProductPage
      v-else-if="currentProduct"
      :product-id="route.params.productId"
    />

    <section v-else class="product-empty" aria-label="Product not found">
      <h1>Product not found</h1>
      <RouterLink to="/">Back to home</RouterLink>
    </section>
  </main>
</template>
