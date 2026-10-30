<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ShoppingBag } from 'lucide-vue-next';
import { blogArticles } from '../data/blogArticles';
import {
  businessGroups,
  getBusinessProducts,
  getShopProducts,
  shopCategories,
} from '../data/catalog';
import { isShopifyConfigured } from '../composables/useShopify';
import { useCart } from '../composables/useCart';

/** `overlayHero`: the page starts with a full-bleed photo behind the bar, so the
 *  bar switches to light-on-dark until the visitor scrolls off the image. */
const props = defineProps({
  overlayHero: {
    type: Boolean,
    default: false,
  },
});

const { count: cartCount, openCart } = useCart();
const shopifyConfigured = isShopifyConfigured();

const SCROLL_FADE_DISTANCE = 120;

const activeMenu = ref(null);
const activeCategory = ref(null);
const scrollProgress = ref(0);

/** Turn a product record into a mega-menu card. */
function toMenuCard(product) {
  return {
    label: product.label,
    image: product.navImage ?? product.image,
    to: { name: 'product-detail', params: { productId: product.id } },
  };
}

/**
 * Mega-menu panels are derived from `src/data/catalog.js`, which also drives
 * the /products page and the /business product list — so a product added to
 * `products.js` shows up in all three places at once.
 */
const shopPanel = {
  eyebrow: 'Shop',
  categories: shopCategories.map((category) => ({
    id: category.id,
    label: category.label,
    links: getShopProducts(category.id).map(toMenuCard),
  })),
};

const businessPanel = {
  eyebrow: 'For business',
  branches: businessGroups.map((group) => ({
    id: group.id,
    label: group.label,
    to: { name: 'business', hash: `#${group.id}` },
    links: getBusinessProducts(group.id).map(toMenuCard),
    placeholders: group.placeholders ?? [],
  })),
};

const navItems = [
  { label: 'Shop', menu: 'shop', to: { name: 'products' } },
  { label: 'Business', menu: 'business', to: { name: 'business' } },
  { label: 'Blog', menu: 'blogs', to: { name: 'blogs' } },
  { label: 'Support', to: { name: 'support' } },
];

/** Light bar only while it is sitting on the hero photo (first ~100px of scroll). */
const overlayMode = computed(() => props.overlayHero && scrollProgress.value < 0.85);

const activeShopCategory = computed(() => {
  if (activeMenu.value !== 'shop') {
    return null;
  }

  return (
    shopPanel.categories.find((category) => category.id === activeCategory.value) ??
    shopPanel.categories[0]
  );
});

const recentBlogs = computed(() =>
  [...blogArticles]
    .sort((first, second) => (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''))
    .slice(0, 9),
);

function openMenu(menu) {
  activeMenu.value = menu ?? null;
  activeCategory.value = menu === 'shop' ? (shopPanel.categories[0]?.id ?? null) : null;
}

function closeMenu() {
  activeMenu.value = null;
  activeCategory.value = null;
}

function selectCategory(categoryId) {
  activeCategory.value = categoryId;
}

function updateScrollProgress() {
  scrollProgress.value = Math.min(window.scrollY / SCROLL_FADE_DISTANCE, 1);
}

function handleKeydown(event) {
  if (event.key === 'Escape' && activeMenu.value) {
    closeMenu();
  }
}

onMounted(() => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <header
    class="topbar"
    :class="{ 'topbar--overlay': overlayMode }"
    aria-label="kkShop navigation"
    :style="{ '--topbar-bg-alpha': overlayMode ? 0 : scrollProgress }"
    @mouseleave="closeMenu"
  >
    <RouterLink class="brand" to="/" aria-label="kkShop home">
      <img class="brand-logo" src="/images/logo-meower.webp" alt="Meower" />
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <div v-for="item in navItems" :key="item.label" class="nav-item">
        <RouterLink
          v-if="item.to"
          class="nav-label"
          :to="item.to"
          :aria-expanded="item.menu ? activeMenu === item.menu : undefined"
          @focus="item.menu ? openMenu(item.menu) : closeMenu()"
          @mouseenter="item.menu ? openMenu(item.menu) : closeMenu()"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <button
          v-else-if="item.menu"
          class="nav-trigger"
          type="button"
          :aria-expanded="activeMenu === item.menu"
          :aria-label="`${item.label} menu`"
          @focus="openMenu(item.menu)"
          @mouseenter="openMenu(item.menu)"
          @click="openMenu(item.menu)"
        >
          {{ item.label }}
        </button>
        <span v-else class="nav-label" @mouseenter="closeMenu">{{ item.label }}</span>
      </div>
    </nav>

    <button
      v-if="shopifyConfigured"
      class="cart-button"
      type="button"
      aria-label="Open cart"
      @click="openCart"
    >
      <ShoppingBag aria-hidden="true" />
      <span v-if="cartCount" class="cart-button-badge">{{ cartCount }}</span>
    </button>

    <Transition name="mega-menu">
      <div
        v-if="activeMenu === 'blogs'"
        class="mega-menu mega-menu--blogs"
        role="region"
        aria-label="Recent blogs"
      >
        <div class="mega-menu-inner">
          <p class="mega-menu-eyebrow">Latest insights</p>
          <div class="mega-blog-grid">
            <RouterLink
              v-for="article in recentBlogs"
              :key="article.slug"
              class="mega-blog-card"
              :to="{ name: 'blog-detail', params: { slug: article.slug } }"
              @click="closeMenu"
            >
              <img
                :src="article.coverImage"
                :alt="article.title"
                :class="{ 'blog-card-image--crop-right': article.cardCrop === 'right' }"
              />
              <span>{{ article.title }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div v-else-if="activeMenu === 'shop'" class="mega-menu" role="region" aria-label="Shop categories">
        <div class="mega-menu-inner">
          <p class="mega-menu-eyebrow">{{ shopPanel.eyebrow }}</p>
          <div class="mega-menu-content">
            <div class="mega-menu-categories" aria-label="Shop categories">
              <button
                v-for="category in shopPanel.categories"
                :key="category.id"
                class="mega-menu-category"
                :class="{ active: activeShopCategory?.id === category.id }"
                type="button"
                @focus="selectCategory(category.id)"
                @mouseenter="selectCategory(category.id)"
              >
                {{ category.label }}
              </button>
            </div>

            <div class="mega-menu-products">
              <h2>{{ activeShopCategory?.label }}</h2>
              <RouterLink
                v-for="link in activeShopCategory?.links"
                :key="link.label"
                class="mega-product-card"
                :to="link.to"
                @click="closeMenu"
              >
                <img :src="link.image" :alt="link.label" />
                <span>{{ link.label }}</span>
              </RouterLink>
              <p v-if="!activeShopCategory?.links.length" class="mega-menu-empty">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="activeMenu === 'business'"
        class="mega-menu mega-menu--business"
        role="region"
        aria-label="Business product ranges"
      >
        <div class="mega-menu-inner">
          <p class="mega-menu-eyebrow">{{ businessPanel.eyebrow }}</p>
          <div class="mega-menu-branches">
            <div v-for="branch in businessPanel.branches" :key="branch.id" class="mega-menu-branch">
              <RouterLink class="mega-menu-branch-title" :to="branch.to" @click="closeMenu">
                {{ branch.label }}
              </RouterLink>

              <div class="mega-menu-products">
                <RouterLink
                  v-for="link in branch.links"
                  :key="link.label"
                  class="mega-product-card"
                  :to="link.to"
                  @click="closeMenu"
                >
                  <img :src="link.image" :alt="link.label" />
                  <span>{{ link.label }}</span>
                </RouterLink>

                <!-- Announced but not listed yet: no route, so not a link. -->
                <div
                  v-for="placeholder in branch.placeholders"
                  :key="placeholder.label"
                  class="mega-product-card mega-product-card--placeholder"
                >
                  <span class="mega-product-placeholder-art" aria-hidden="true">+</span>
                  <span>
                    {{ placeholder.label }}
                    <em>{{ placeholder.note }}</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Light-on-dark variant used while the bar sits on a hero photo. */
.topbar--overlay,
.topbar--overlay:hover,
.topbar--overlay:focus-within {
  background: transparent;
  backdrop-filter: none;
}

.topbar--overlay .nav-label,
.topbar--overlay .nav-trigger,
.topbar--overlay .cart-button {
  color: #fff;
}

.topbar--overlay .nav-label:hover,
.topbar--overlay .nav-trigger:hover,
.topbar--overlay .nav-trigger:focus-visible,
.topbar--overlay .nav-trigger[aria-expanded="true"] {
  color: #d9eee8;
}

.topbar--overlay .cart-button:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* The wordmark ships as dark ink; invert it to read on the photo. */
.topbar--overlay .brand-logo {
  filter: brightness(0) invert(1);
}

.cart-button {
  position: relative;
  display: grid;
  width: 42px;
  height: 42px;
  padding: 0;
  flex: 0 0 auto;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #334c51;
  cursor: pointer;
}

.cart-button:hover {
  background: rgba(51, 76, 81, 0.08);
  color: #5a7c85;
}

.cart-button svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}

.cart-button-badge {
  position: absolute;
  top: 0;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #b3372f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}
</style>
