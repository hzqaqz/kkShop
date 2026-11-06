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

    <header class="shop-hero" aria-labelledby="shop-title">
      <img
        class="shop-hero-bg"
        src="/images/shop/shop-hero.jpg"
        alt="A cream Ragdoll cat resting in a red and cream plaid pet bed in a sunlit living room"
        loading="eager"
        decoding="async"
      />
      <span class="shop-hero-scrim" aria-hidden="true"></span>

      <div class="shop-hero-copy">
        <SiteBreadcrumbs :items="breadcrumbs" />
        <p class="shop-eyebrow">Shop</p>
        <h1 id="shop-title">Shop Everyday Pet Essentials</h1>
        <p class="shop-tagline">
          Beds, strollers, carriers, scratchers, toys and pet-friendly air purifiers — everything
          for the home you share.
        </p>
      </div>
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

<style scoped>
/* Photo hero, matching the /business hero: the artwork starts at the very top
   of the page, with the copy laid over a scrim at the bottom left. */
.shop-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: clamp(560px, 86vh, 900px);
  padding: 0 max(7vw, calc((100vw - 1240px) / 2)) clamp(46px, 6vw, 84px);
  overflow: hidden;
}

.shop-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 45%;
}

/* Heavier at the top so the navigation reads, heavier again at the bottom so
   the headline reads. */
.shop-hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(12, 28, 32, 0.66) 0%,
    rgba(12, 28, 32, 0.2) 32%,
    rgba(12, 28, 32, 0.4) 62%,
    rgba(12, 28, 32, 0.82) 100%
  );
}

.shop-hero-copy {
  position: relative;
  z-index: 1;
  max-width: 1040px;
}

.shop-eyebrow {
  margin: 0 0 12px;
  color: #d9eee8;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.shop-hero h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(46px, 6vw, 92px);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.96;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.32);
}

.shop-tagline {
  max-width: 820px;
  margin: 28px 0 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: clamp(18px, 1.9vw, 28px);
  font-weight: 520;
  line-height: 1.35;
}

.shop-hero-copy :deep(.site-breadcrumbs) {
  --seo-muted: rgba(255, 255, 255, 0.72);
  --seo-border: rgba(255, 255, 255, 0.45);
  --seo-ink: #fff;
}

@media (max-width: 900px) {
  .shop-hero {
    min-height: clamp(520px, 78vh, 680px);
    padding: 0 28px 44px;
  }

  .shop-hero-bg {
    object-position: 58% 50%;
  }
}

@media (max-width: 560px) {
  .shop-hero h1 {
    font-size: 46px;
  }

  .shop-tagline {
    margin-top: 22px;
    font-size: 17px;
  }
}
</style>
