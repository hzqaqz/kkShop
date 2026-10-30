<script setup>
import { RouterLink } from 'vue-router';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useSeo } from '../composables/useSeo';
import { contactEmailHref } from '../data/siteInfo';
import { getShopProducts, shopCategories } from '../data/catalog';

useSeo({
  title: 'Shop Pet Supplies & Air Purifiers',
  description:
    'Shop Meower pet supplies and air care: pet strollers, carriers and bags, pet beds, cat scratching posts, toys and pet-friendly HEPA H13 air purifiers.',
  path: '/products',
});

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
];

/**
 * Sections follow the order of `shopCategories` in `src/data/catalog.js`;
 * a category with nothing listed yet renders a "Coming soon" panel instead of
 * an empty grid.
 */
const categories = shopCategories.map((category) => ({
  id: category.id,
  label: category.label,
  description: category.description,
  products: getShopProducts(category.id).map((product) => ({
    name: product.label,
    image: product.image,
    to: { name: 'product-detail', params: { productId: product.id } },
  })),
}));
</script>

<template>
  <main class="site-shell product-list-page">
    <SiteHeader />

    <header class="product-list-hero">
      <SiteBreadcrumbs :items="breadcrumbs" />
      <p class="eyebrow">Shop</p>
      <h1>Shop Everyday Pet Essentials</h1>
      <p>
        Pet strollers, carriers, beds, scratching posts and toys for cats and dogs — plus the
        pet-friendly air purifiers we started with.
      </p>
    </header>

    <div class="product-list-groups">
      <section
        v-for="category in categories"
        :id="category.id"
        :key="category.id"
        class="product-list-group"
        :aria-labelledby="`${category.id}-title`"
      >
        <div class="product-list-group-heading">
          <h2 :id="`${category.id}-title`">{{ category.label }}</h2>
          <p>{{ category.description }}</p>
        </div>

        <div v-if="category.products.length" class="product-list-grid">
          <RouterLink
            v-for="product in category.products"
            :key="product.name"
            class="product-list-card"
            :to="product.to"
          >
            <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
            <h3>{{ product.name }}</h3>
            <span>View product</span>
          </RouterLink>
        </div>

        <p v-else class="product-list-empty">
          <strong>Coming soon</strong>
          <span>
            We are still putting this range together. Tell us what you are looking for at
            <a :href="contactEmailHref">info@meowerair.com</a> and we will come back with options.
          </span>
        </p>
      </section>
    </div>
  </main>
</template>
