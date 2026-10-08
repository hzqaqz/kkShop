<script setup>
import { RouterLink } from 'vue-router';

defineProps({
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
});
</script>

<template>
  <section v-if="products.length" class="related-section" aria-labelledby="related-products-title">
    <div class="section-heading centered">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2 id="related-products-title">{{ title }}</h2>
    </div>

    <div class="product-list-grid related-product-grid">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        class="product-list-card"
        :to="{ name: 'product-detail', params: { productId: product.id } }"
      >
        <img :src="product.image" :alt="product.title" />
        <h3>{{ product.cardLabel }}</h3>
        <p class="related-product-subtitle">{{ product.cardSubtitle }}</p>
        <span>{{ product.category }}</span>
      </RouterLink>
    </div>
  </section>
</template>
