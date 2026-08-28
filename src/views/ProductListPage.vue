<script setup>
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';

const productGroups = [
  {
    id: 'home-air-purifiers',
    title: 'Home Use Air Purifier',
    description: 'Cleaner, quieter air care for everyday homes and pet-friendly spaces.',
    products: [
      {
        name: 'MW100',
        image: '/images/products/list/mw100.png',
        to: { name: 'product-detail', params: { productId: 'mw100' } },
      },
      {
        name: 'MW200',
        image: '/images/products/list/mw200.png',
        to: { name: 'product-detail', params: { productId: 'mw200' } },
      },
    ],
  },
  {
    id: 'home-dehumidifiers',
    title: 'Home Use Dehumidifier',
    description: 'Comfortable humidity control for everyday indoor living.',
    products: [
      {
        name: 'MD001 Dehumidifier',
        image: '/images/products/md001/product-white.png',
        to: { name: 'product-detail', params: { productId: 'md001' } },
      },
    ],
  },
  {
    id: 'commercial-dehumidifiers',
    title: 'Commercial Dehumidifier',
    description: 'Reliable moisture management for larger spaces and professional projects.',
    products: [
      {
        name: 'Commercial Dehumidifier',
        image: '/images/products/list/commercial-dehumidifier.png',
        to: { name: 'product-detail', params: { productId: 'commercial-dehumidifier' } },
      },
      {
        name: 'Ceiling-Mounted Dehumidifier',
        image: '/images/products/md0002/ceiling-mounted-dehumidifier-white.png',
        to: { name: 'product-detail', params: { productId: 'ceiling-mounted-dehumidifier' } },
      },
    ],
  },
];
</script>

<template>
  <main class="site-shell product-list-page">
    <SiteHeader />

    <header class="product-list-hero">
      <p class="eyebrow">Products</p>
      <h1>Find The Right Air Care Fit</h1>
      <p>Explore air purification and dehumidification solutions for homes and commercial spaces.</p>
    </header>

    <div class="product-list-groups">
      <section
        v-for="group in productGroups"
        :id="group.id"
        :key="group.id"
        class="product-list-group"
        :aria-labelledby="`${group.id}-title`"
      >
        <div class="product-list-group-heading">
          <h2 :id="`${group.id}-title`">{{ group.title }}</h2>
          <p>{{ group.description }}</p>
        </div>

        <div class="product-list-grid">
          <template v-for="product in group.products" :key="product.name">
            <RouterLink v-if="product.to" class="product-list-card" :to="product.to">
              <img :src="product.image" :alt="product.name" />
              <h3>{{ product.name }}</h3>
              <span>View product</span>
            </RouterLink>
            <article v-else class="product-list-card">
              <img :src="product.image" :alt="product.name" />
              <h3>{{ product.name }}</h3>
            </article>
          </template>
        </div>
      </section>
    </div>
  </main>
</template>
