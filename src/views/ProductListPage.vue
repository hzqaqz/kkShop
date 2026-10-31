<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import SiteBreadcrumbs from '../components/SiteBreadcrumbs.vue';
import ProductFromPrice from '../components/ProductFromPrice.vue';
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

const route = useRoute();

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
    shopifyHandle: product.shopifyHandle ?? '',
    to: { name: 'product-detail', params: { productId: product.id } },
  })),
}));

/**
 * The sidebar drives the listing through the URL hash (`/products#pet-beds`),
 * which is the same link shape the Shop mega menu and the home page category
 * tiles already use — so those keep working, and a filtered view is shareable.
 */
const ACTIVE_ALL = 'all';
const activeId = computed(() => {
  const hash = route.hash.replace('#', '');
  return categories.some((category) => category.id === hash) ? hash : ACTIVE_ALL;
});

const visibleCategories = computed(() =>
  activeId.value === ACTIVE_ALL
    ? categories
    : categories.filter((category) => category.id === activeId.value),
);

const totalProducts = computed(() =>
  categories.reduce((total, category) => total + category.products.length, 0),
);

/**
 * On phones the category list is a horizontal scroller: keep the selected
 * category in view without scrolling the page itself.
 */
const navRef = ref(null);

const centreActiveCategory = () => {
  const nav = navRef.value;
  const active = nav?.querySelector('.shop-sidebar-link.is-active');
  if (!nav || !active) {
    return;
  }
  nav.scrollTo({
    left: active.offsetLeft - nav.clientWidth / 2 + active.clientWidth / 2,
    behavior: 'smooth',
  });
};

watch(activeId, () => nextTick(centreActiveCategory));
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

    <div class="shop-layout">
      <aside class="shop-sidebar" aria-label="Product categories">
        <p class="shop-sidebar-title">Categories</p>

        <nav ref="navRef" class="shop-sidebar-nav">
          <RouterLink
            class="shop-sidebar-link"
            :class="{ 'is-active': activeId === ACTIVE_ALL }"
            :to="{ name: 'products' }"
          >
            <span>All products</span>
            <em>{{ totalProducts }}</em>
          </RouterLink>

          <RouterLink
            v-for="category in categories"
            :key="`nav-${category.id}`"
            class="shop-sidebar-link"
            :class="{ 'is-active': activeId === category.id }"
            :to="{ name: 'products', hash: `#${category.id}` }"
          >
            <span>{{ category.label }}</span>
            <em v-if="category.products.length">{{ category.products.length }}</em>
            <em v-else class="shop-sidebar-soon">Soon</em>
          </RouterLink>
        </nav>
      </aside>

      <div class="product-list-groups">
      <section
        v-for="category in visibleCategories"
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
            <ProductFromPrice :handle="product.shopifyHandle" />
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
    </div>
  </main>
</template>
