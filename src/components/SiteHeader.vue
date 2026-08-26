<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { blogArticles } from '../data/blogArticles';

const SCROLL_FADE_DISTANCE = 120;

const activeMenu = ref(null);
const activeCategory = ref(null);
const scrollProgress = ref(0);

const menuPanels = {
  airPurifiers: {
    eyebrow: 'Air Purifier',
    title: 'Shop Air Purifiers',
    categories: [
      {
        id: 'home',
        label: 'Home Use',
        links: [
          { label: 'MW100', to: { name: 'product-detail', params: { productId: 'mw100' } } },
          { label: 'MW200', to: { name: 'product-detail', params: { productId: 'mw200' } } },
        ],
      },
      { id: 'commercial', label: 'Commercial Use', links: [] },
      { id: 'filter', label: 'Filters', links: [] },
    ],
  },
  dehumidifier: {
    eyebrow: 'Dehumidifier',
    title: 'Shop Dehumidifiers',
    categories: [
      { id: 'home', label: 'Home Use', links: [] },
      {
        id: 'commercial',
        label: 'Commercial Use',
        links: [
          {
            label: 'Commercial Dehumidifier',
            to: { name: 'product-detail', params: { productId: 'commercial-dehumidifier' } },
          },
        ],
      },
    ],
  },
};

const navItems = [
  { label: 'Air Purifiers', menu: 'airPurifiers' },
  { label: 'Dehumidifiers', menu: 'dehumidifier' },
  { label: 'Blogs', menu: 'blogs' },
  { label: 'About Us' },
];

const activeMenuPanel = computed(() => (activeMenu.value ? menuPanels[activeMenu.value] : null));
const recentBlogs = computed(() =>
  [...blogArticles]
    .sort((first, second) => (second.sortDate ?? second.date ?? '').localeCompare(first.sortDate ?? first.date ?? ''))
    .slice(0, 9),
);
const activeCategoryPanel = computed(() => {
  if (!activeMenuPanel.value) {
    return null;
  }

  return (
    activeMenuPanel.value.categories.find((category) => category.id === activeCategory.value) ??
    activeMenuPanel.value.categories[0]
  );
});

function openMenu(menu) {
  activeMenu.value = menu ?? null;
  activeCategory.value = activeMenuPanel.value?.categories?.[0]?.id ?? null;
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

onMounted(() => {
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress);
});
</script>

<template>
  <header
    class="topbar"
    aria-label="kkShop navigation"
    :style="{ '--topbar-bg-alpha': scrollProgress }"
    @mouseleave="closeMenu"
  >
    <RouterLink class="brand" to="/" aria-label="kkShop home">
      <img class="brand-logo" src="/images/logo-meower.png" alt="Meower" />
    </RouterLink>

    <nav class="nav-links" aria-label="Primary navigation">
      <div v-for="item in navItems" :key="item.label" class="nav-item">
        <button
          v-if="item.menu"
          class="nav-trigger"
          type="button"
          :aria-expanded="activeMenu === item.menu"
          :aria-label="`${item.label} products`"
          @focus="openMenu(item.menu)"
          @mouseenter="openMenu(item.menu)"
          @click="openMenu(item.menu)"
        >
          {{ item.label }}
        </button>
        <RouterLink
          v-else-if="item.to"
          class="nav-label"
          :to="item.to"
          @click="closeMenu"
          @mouseenter="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="nav-label" @mouseenter="closeMenu">{{ item.label }}</span>
      </div>
    </nav>

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
              <img :src="article.coverImage" :alt="article.title" />
              <span>{{ article.title }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else-if="activeMenuPanel" class="mega-menu" role="region" :aria-label="activeMenuPanel.title">
        <div class="mega-menu-inner">
          <p class="mega-menu-eyebrow">{{ activeMenuPanel.eyebrow }}</p>
          <div class="mega-menu-content">
            <div class="mega-menu-categories" aria-label="Product categories">
              <button
                v-for="category in activeMenuPanel.categories"
                :key="category.id"
                class="mega-menu-category"
                :class="{ active: activeCategoryPanel?.id === category.id }"
                type="button"
                @focus="selectCategory(category.id)"
                @mouseenter="selectCategory(category.id)"
              >
                {{ category.label }}
              </button>
            </div>

            <div class="mega-menu-products">
              <h2>{{ activeCategoryPanel?.label }}</h2>
              <RouterLink
                v-for="link in activeCategoryPanel?.links"
                :key="link.label"
                class="mega-menu-link"
                :to="link.to"
                @click="closeMenu"
              >
                {{ link.label }}
              </RouterLink>
              <p v-if="!activeCategoryPanel?.links.length" class="mega-menu-empty">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
