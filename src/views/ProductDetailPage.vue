<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';

const route = useRoute();

const productDetails = {
  mw100: {
    label: 'MW100',
    images: [
      {
        src: '/images/products/mw100/01-self-grooming.png',
        alt: 'MW100 self-grooming brush design',
      },
      {
        src: '/images/products/mw100/02-cat-friendly-space.png',
        alt: 'MW100 in cat-friendly home spaces',
      },
      {
        src: '/images/products/mw100/03-why-meower100.png',
        alt: 'MW100 features and filtration benefits',
      },
      {
        src: '/images/products/mw100/04-hero-overview.png',
        alt: 'MW100 smart air purifier overview',
      },
    ],
  },
  mw200: {
    label: 'MW200',
    images: [
      {
        src: '/images/products/mw200/01-hero-overview.png',
        alt: 'MW200 smart air purifier for pet homes overview',
      },
      {
        src: '/images/products/mw200/02-why-meower200.png',
        alt: 'MW200 features, filtration, and specifications',
      },
    ],
  },
};

const currentProduct = computed(() => productDetails[route.params.productId] ?? null);
</script>

<template>
  <main class="site-shell product-page">
    <SiteHeader />

    <section
      v-if="currentProduct"
      class="product-detail-images"
      :aria-label="`${currentProduct.label} product details`"
    >
      <img v-for="image in currentProduct.images" :key="image.src" :src="image.src" :alt="image.alt" />
    </section>

    <section v-else class="product-empty" aria-label="Product not found">
      <h1>Product not found</h1>
      <RouterLink to="/">Back to home</RouterLink>
    </section>
  </main>
</template>
