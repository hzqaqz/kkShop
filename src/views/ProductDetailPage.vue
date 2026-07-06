<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
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
};

const currentProduct = computed(() => productDetails[route.params.productId] ?? null);
</script>

<template>
  <main class="site-shell product-page">
    <SiteHeader />

    <Mw100ProductPage v-if="currentProduct" :product-id="route.params.productId" />

    <section v-else class="product-empty" aria-label="Product not found">
      <h1>Product not found</h1>
      <RouterLink to="/">Back to home</RouterLink>
    </section>
  </main>
</template>
